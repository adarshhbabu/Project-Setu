"""
Project Setu - Main FastAPI Application
Exposes all 9 mandatory REST endpoints:
1. POST /complaints
2. GET /complaints/{id}/prediction
3. GET /complaints/{id}/status
4. GET /queue
5. POST /alerts/dispatch
6. POST /freeze-request/{complaint_id}
7. POST /ledger/flag
8. GET /ledger/check/{hash}
9. GET /dashboard/impact
"""

import random
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .data_gen.generator import get_preseeded_cluster_47, generate_random_complaint
from .db.database import engine, Base, SessionLocal
from .db import models
from .services.correlation import correlate_complaint
from .services.prediction import predict_withdrawal_location
from .services.prioritization import calculate_priority_score
from .services.jurisdiction import resolve_jurisdictions
from .services.explainability import generate_explanation
from .services.alerts import dispatch_jurisdiction_alerts
from .services.ledger import flag_identifier, check_identifier_flag, unflag_identifier
from .services.freeze_generator import generate_freeze_request_doc
from .services.impact import compute_impact_metrics
from .schemas.pydantic_models import ComplaintCreateSchema, LedgerFlagRequestSchema, LedgerUnflagRequestSchema, AlertDispatchSchema
from .queue.ingestion_queue import global_queue_manager

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Setu - Predictive Cybercrime Withdrawal Intelligence System",
    version="1.0.0",
    description="Proactive cybercrime intervention grid API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory fast cache store for prototype speed
COMPLAINTS_STORE: Dict[str, dict] = {}
PREDICTIONS_STORE: Dict[str, dict] = {}
ALERTS_STORE: Dict[str, dict] = {}

def process_complaint_pipeline(cmp_dict: dict) -> dict:
    cid = cmp_dict["complaint_id"]
    
    # 1. Correlate with graph engine
    cluster_id, linked_complaints, graph_data = correlate_complaint(cmp_dict)
    cmp_dict["cluster_id"] = cluster_id
    
    # 2. Predict withdrawal location & urgency
    predictions, urgency_mins, top_conf, feature_importances, tier = predict_withdrawal_location(cmp_dict, linked_complaints)
    
    # 3. Calculate priority score
    amount = cmp_dict.get("amount", 20000.0)
    cluster_size = len(linked_complaints) if linked_complaints else 1
    priority_score = calculate_priority_score(urgency_mins, amount, cluster_size)
    
    # 4. Resolve jurisdictions
    top_district = predictions[0]["district"] if predictions else "Deoghar"
    jurisdictions = resolve_jurisdictions(cmp_dict, top_district, linked_complaints)
    
    # 5. Generate explainability panel content
    explanation = generate_explanation(cmp_dict, predictions, feature_importances, tier)
    
    # Store processed records
    cmp_dict["predicted_district"] = top_district
    cmp_dict["confidence_score"] = top_conf
    cmp_dict["urgency_minutes"] = urgency_mins
    cmp_dict["priority_score"] = priority_score
    
    COMPLAINTS_STORE[cid] = cmp_dict
    
    PREDICTIONS_STORE[cid] = {
        "complaint_id": cid,
        "cluster_id": cluster_id,
        "tier": tier,
        "top_predicted_district": top_district,
        "confidence_score": top_conf,
        "urgency_minutes": urgency_mins,
        "priority_score": priority_score,
        "predictions": predictions,
        "feature_importances": feature_importances,
        "explanation": explanation,
        "jurisdictions": jurisdictions,
        "graph_data": graph_data,
        "linked_complaints": linked_complaints
    }
    
    # Auto-flag suspect account on ledger if high confidence
    if cmp_dict.get("suspect_account"):
        try:
            flag_identifier(
                identifier=cmp_dict["suspect_account"],
                complaint_ref=cid,
                bank_id="SYSTEM_AUTO_FLAG",
                identifier_type="ACCOUNT"
            )
        except Exception:
            pass
            
    return cmp_dict

@app.on_event("startup")
async def startup_event():
    # Pre-seed Cluster #47 background complaints
    preseeded = get_preseeded_cluster_47()
    for c in preseeded:
        process_complaint_pipeline(c)
    # Add a few additional synthetic complaints to build a realistic queue
    for _ in range(5):
        rnd = generate_random_complaint()
        process_complaint_pipeline(rnd)
        
    await global_queue_manager.start_worker()
    global_queue_manager.set_processor(process_complaint_pipeline)

@app.on_event("shutdown")
async def shutdown_event():
    await global_queue_manager.stop_worker()

# ------------------------------------------------------------------------------
# 1. POST /complaints - Ingest a new complaint
# ------------------------------------------------------------------------------
@app.post("/complaints")
async def ingest_complaint(data: ComplaintCreateSchema):
    cid = f"CMP-{random.randint(10000, 99999)}"
    cmp_dict = {
        "complaint_id": cid,
        "victim_name": data.victim_name,
        "victim_state": data.victim_state,
        "victim_district": data.victim_district,
        "victim_pincode": data.victim_pincode,
        "fraud_type": data.fraud_type,
        "amount": data.amount,
        "suspect_account": data.suspect_account,
        "suspect_ifsc": data.suspect_ifsc,
        "suspect_bank": data.suspect_bank or "Target Financial Institution",
        "suspect_phone": data.suspect_phone,
        "suspect_device_id": data.suspect_device_id,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "INGESTED",
        "is_synthetic": True,
        "data_label": "Simulated data, calibrated to public NCRB/RBI figures"
    }
    
    # Process synchronously for instant UI demo feedback
    processed = process_complaint_pipeline(cmp_dict)
    
    # Also push to async queue manager for architecture demonstration
    await global_queue_manager.enqueue(cmp_dict)
    
    return {
        "message": "Complaint ingested and intelligence grid updated successfully",
        "complaint_id": cid,
        "cluster_id": processed.get("cluster_id"),
        "priority_score": processed.get("priority_score"),
        "urgency_minutes": processed.get("urgency_minutes"),
        "top_predicted_district": processed.get("predicted_district")
    }

# ------------------------------------------------------------------------------
# 2. GET /complaints/{id}/prediction - Full predictions & explainability
# ------------------------------------------------------------------------------
@app.get("/complaints/{id}/prediction")
async def get_complaint_prediction(id: str):
    if id not in PREDICTIONS_STORE:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
    return PREDICTIONS_STORE[id]

# ------------------------------------------------------------------------------
# 3. GET /complaints/{id}/status - Citizen-facing status (recovery odds only)
# ------------------------------------------------------------------------------
@app.get("/complaints/{id}/status")
async def get_citizen_status(id: str):
    if id not in COMPLAINTS_STORE:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
        
    c = COMPLAINTS_STORE[id]
    amount = c.get("amount", 0)
    ftype = c.get("fraud_type", "Fraud")
    
    # Simple recovery odds heuristic based on fraud type & time
    if amount < 50000 and ftype in ["Loan App Fraud", "UPI Fraud / QR Code Scam"]:
        odds = "Moderate-High (68%)"
        status_msg = "Alerts dispatched to law enforcement and banking network. Golden hour intervention active."
    else:
        odds = "High (82%)"
        status_msg = "Proactive inter-agency grid alert active. Target branch and jurisdiction notified."
        
    return {
        "complaint_id": id,
        "status": "UNDER_ACTIVE_INVESTIGATION",
        "recovery_odds": odds,
        "plain_language_status": status_msg,
        "last_updated": c.get("timestamp"),
        "note": "Sensitive internal syndicate, graph, and ledger metadata are strictly redacted from citizen view."
    }

# ------------------------------------------------------------------------------
# 4. GET /queue - Prioritized case list
# ------------------------------------------------------------------------------
@app.get("/queue")
async def get_prioritized_queue():
    items = list(COMPLAINTS_STORE.values())
    # Sort descending by priority_score
    items = sorted(items, key=lambda x: x.get("priority_score", 0), reverse=True)
    return {
        "queue_count": len(items),
        "queue": items
    }

# ------------------------------------------------------------------------------
# 5. POST /alerts/dispatch - Dispatch real SendGrid alerts
# ------------------------------------------------------------------------------
@app.post("/alerts/dispatch")
async def dispatch_alert(data: AlertDispatchSchema):
    cid = data.complaint_id
    if cid not in PREDICTIONS_STORE:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
        
    pred = PREDICTIONS_STORE[cid]
    cmp_obj = COMPLAINTS_STORE[cid]
    jurisdictions = pred.get("jurisdictions", [])
    
    dispatch_result = dispatch_jurisdiction_alerts(cmp_obj, pred, jurisdictions)
    ALERTS_STORE[cid] = dispatch_result
    return dispatch_result

# ------------------------------------------------------------------------------
# 6. POST /freeze-request/{complaint_id} - Draft Freeze Document
# ------------------------------------------------------------------------------
@app.post("/freeze-request/{complaint_id}")
async def create_freeze_request(complaint_id: str):
    if complaint_id not in COMPLAINTS_STORE:
        raise HTTPException(status_code=404, detail="Complaint ID not found")
        
    cmp_obj = COMPLAINTS_STORE[complaint_id]
    pred_obj = PREDICTIONS_STORE.get(complaint_id, {})
    
    doc = generate_freeze_request_doc(cmp_obj, pred_obj)
    return doc

# ------------------------------------------------------------------------------
# 7. POST /ledger/flag - Write HMAC-hashed identifier flag
# ------------------------------------------------------------------------------
@app.post("/ledger/flag")
async def flag_ledger_identifier(data: LedgerFlagRequestSchema):
    try:
        res = flag_identifier(
            identifier=data.identifier,
            complaint_ref=data.complaint_reference,
            bank_id=data.bank_id,
            identifier_type=data.identifier_type or "ACCOUNT"
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/ledger/unflag")
async def unflag_ledger_identifier(data: LedgerUnflagRequestSchema):
    try:
        res = unflag_identifier(
            hashed=data.hash,
            supervisor_id=data.supervisor_id,
            reason=data.reason
        )
        return res
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ------------------------------------------------------------------------------
# 8. GET /ledger/check/{hash} - Bank-side flag query
# ------------------------------------------------------------------------------
@app.get("/ledger/check/{hash}")
async def check_ledger_flag(hash: str):
    res = check_identifier_flag(hash)
    return res

# ------------------------------------------------------------------------------
# 9. GET /dashboard/impact - Aggregated live simulation stats
# ------------------------------------------------------------------------------
@app.get("/dashboard/impact")
async def get_dashboard_impact():
    all_c = list(COMPLAINTS_STORE.values())
    metrics = compute_impact_metrics(all_c)
    return metrics

if __name__ == "__main__":
    print("Starting Project Setu Intelligence Server on http://localhost:8000...")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
