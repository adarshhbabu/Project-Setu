"""
Project Setu - Freeze Request Document Generator
Generates pre-filled Freeze Authorization documents.
EXPLICIT CONSTRAINT: The system never claims or simulates an autonomous freeze action.
Every output is explicitly labeled as requiring human/bank authorization under IT Act §91 / CrPC §102.
"""

from datetime import datetime
from typing import Dict, Any

def generate_freeze_request_doc(complaint: dict, prediction: dict) -> Dict[str, Any]:
    cid = complaint.get("complaint_id")
    cluster_id = complaint.get("cluster_id")
    amount = complaint.get("amount", 0)
    acct = complaint.get("suspect_account")
    ifsc = complaint.get("suspect_ifsc")
    bank = complaint.get("suspect_bank", "Target Financial Institution")
    phone = complaint.get("suspect_phone")
    top_district = prediction.get("top_predicted_district", "Deoghar")
    urgency = prediction.get("urgency_minutes", 34)
    
    doc_text = f"""
================================================================================
STATUTORY REQUEST FOR RESTRAINT / ACCOUNTS FREEZE NOTICE
ISSUED UNDER CRPC SECTION 102 / IT ACT SECTION 91
(REQUIRES HUMAN LEA OFFICER & BANK AUTHORIZATION)
================================================================================

Date/Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
Request Reference ID: FRZ-REQ-{cid}-2026
System: Project Setu Cybercrime Predictive Intelligence Grid

TO: Nodal Officer / Chief Fraud Risk Officer
BANK / INSTITUTION: {bank} (IFSC: {ifsc})

SUBJECT: PROACTIVE FREEZE REQUEST FOR SUSPECT MULE ACCOUNT - {acct}

1. COMPLAINT DETAILS:
   - Primary Complaint Reference: {cid}
   - Linked Syndicate Cluster: {cluster_id or 'Standalone Complaint'}
   - Total Recoverable Value: ₹{amount:,.2f}
   - Reporting Victim State: {complaint.get('victim_state')} ({complaint.get('victim_district')})
   - Suspect Phone Number: {phone}

2. INTELLIGENCE FINDINGS:
   - Predicted Cash-Out Hub: {top_district}
   - Estimated Urgency Window: ~{urgency} minutes remaining
   - Predictive Confidence: {int(prediction.get('confidence_score', 0.81) * 100)}%

3. STATUTORY DIRECTIVE & AUTHORIZATION MANDATE:
   Pursuant to provisions under Section 102 of the Code of Criminal Procedure / Section 91 of the Information Technology Act, 2000:
   You are hereby requested to place an immediate LIEN / TEMPORARY DEBIT RESTRAINT on account #{acct} pending formal police verification.

================================================================================
CRITICAL LEGAL NOTICE:
THIS DOCUMENT IS AN AUTOMATED COMPILATION PREPARED BY PROJECT SETU.
IT DOES NOT CONSTITUTE AN AUTONOMOUS FREEZE ACTION.
EXECUTION OF LIEN REQUIRES FORMAL AUTHORIZATION BY A DESIGNATED POLICE OFFICER
AND BANK COMPLIANCE AUTHORIZED SIGNATORY.
================================================================================
"""

    return {
        "request_id": f"FRZ-REQ-{cid}-2026",
        "complaint_id": cid,
        "cluster_id": cluster_id,
        "suspect_account": acct,
        "suspect_ifsc": ifsc,
        "suspect_bank": bank,
        "recoverable_amount": amount,
        "document_text": doc_text.strip(),
        "requires_human_authorization": True,
        "statutory_mandate": "CrPC §102 / IT Act §91",
        "timestamp": datetime.utcnow().isoformat()
    }
