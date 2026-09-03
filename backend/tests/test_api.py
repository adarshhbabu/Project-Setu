"""
Project Setu - Integration Test Suite
Verifies all 9 mandatory API endpoints and non-negotiable constraints.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_ingest_complaint_and_cluster_47():
    with TestClient(app) as client:
        # Submit live complaint CMP-10412 with shared phone +91-7000011122
        payload = {
            "victim_name": "Priya Sharma",
            "victim_state": "Rajasthan",
            "victim_district": "Jaipur",
            "victim_pincode": "302001",
            "fraud_type": "Digital Arrest Scam",
            "amount": 125000.0,
            "suspect_account": "9988777741",
            "suspect_ifsc": "JHRK0009",
            "suspect_bank": "Jharkhand Gramin Bank",
            "suspect_phone": "+91-7000011122",
            "suspect_device_id": "DEV-D82F94E4"
        }
        
        response = client.post("/complaints", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "complaint_id" in data
        assert data["cluster_id"] is not None
        cid = data["complaint_id"]
        
        # 2. Get Prediction
        pred_res = client.get(f"/complaints/{cid}/prediction")
        assert pred_res.status_code == 200
        pred_data = pred_res.json()
        assert pred_data["confidence_score"] > 0
        assert pred_data["urgency_minutes"] > 0
        
        # 3. Get Citizen Status
        cit_res = client.get(f"/complaints/{cid}/status")
        assert cit_res.status_code == 200
        assert "Sensitive internal" in cit_res.json()["note"]
        
        # 4. Get Queue
        queue_res = client.get("/queue")
        assert queue_res.status_code == 200
        assert queue_res.json()["queue_count"] >= 4
        
        # 5. Dispatch Alert
        alert_res = client.post("/alerts/dispatch", json={"complaint_id": cid})
        assert alert_res.status_code == 200
        assert alert_res.json()["threshold_passed"] is True
        
        # 6. Generate Freeze Request
        frz_res = client.post(f"/freeze-request/{cid}")
        assert frz_res.status_code == 200
        assert frz_res.json()["requires_human_authorization"] is True
        
        # 7. Flag Ledger Identifier
        flag_res = client.post("/ledger/flag", json={
            "identifier": "9988777741",
            "complaint_reference": cid,
            "bank_id": "AXIS_BANK_MUMBAI"
        })
        assert flag_res.status_code == 200
        query_hash = flag_res.json()["hash"]
        
        # 8. Check Ledger Flag
        chk_res = client.get(f"/ledger/check/{query_hash}")
        assert chk_res.status_code == 200
        assert chk_res.json()["flagged"] is True
        assert "Privacy preserved" in chk_res.json()["note"]
        
        # 9. Get Impact Metrics
        imp_res = client.get("/dashboard/impact")
        assert imp_res.status_code == 200
        assert "Simulated data" in imp_res.json()["mandatory_label"]
    
    print("ALL 9 MANDATORY ENDPOINTS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_ingest_complaint_and_cluster_47()
