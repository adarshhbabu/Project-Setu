"""
Project Setu - Jurisdiction Router
Resolves 3 locations per complaint:
1. Victim address location
2. Suspect account bank branch location (from IFSC lookup)
3. Predicted cash-withdrawal district
Generates targeted alerts per jurisdiction (not blanket spam).
"""

from typing import Dict, List, Set, Any
from ..data_gen.generator import HOTSPOT_DISTRICTS

# Map IFSC prefix to district
IFSC_DISTRICT_MAP = {
    "JHRK": {"district": "Deoghar", "state": "Jharkhand", "email": "cybercell.deoghar@jhpolice.gov.in"},
    "HARY": {"district": "Nuh", "state": "Haryana", "email": "cybercell.nuh@hrpolice.gov.in"},
    "RAJ0": {"district": "Bharatpur", "state": "Rajasthan", "email": "cybercell.bharatpur@rajpolice.gov.in"},
    "BIH0": {"district": "Nawada", "state": "Bihar", "email": "cybercell.nawada@biharpolice.gov.in"},
    "GUJ0": {"district": "Ahmedabad", "state": "Gujarat", "email": "cybercell.ahmedabad@gujaratpolice.gov.in"},
    "TEL0": {"district": "Cyberabad", "state": "Telangana", "email": "cybercell.cyberabad@tspolice.gov.in"},
    "KAR0": {"district": "Bengaluru", "state": "Karnataka", "email": "cybercell.bengaluru@ksp.gov.in"},
    "DEL0": {"district": "Delhi NCR", "state": "Delhi", "email": "cybercell.delhi@delhipolice.gov.in"}
}

def resolve_jurisdictions(complaint: dict, top_predicted_district: str, linked_complaints: List[dict] = None) -> List[Dict[str, Any]]:
    jurisdictions: List[Dict[str, Any]] = []
    seen: Set[str] = set()

    # 1. Victim Location
    v_district = complaint.get("victim_district", "Ernakulam")
    v_state = complaint.get("victim_state", "Kerala")
    v_key = f"{v_district}:{v_state}"
    if v_key not in seen:
        seen.add(v_key)
        jurisdictions.append({
            "district": v_district,
            "state": v_state,
            "role": "Victim Filing Jurisdiction",
            "officer_email": f"cybercell.{v_district.lower().replace(' ', '')}@{v_state.lower()}.gov.in"
        })

    # 2. Suspect Bank Branch IFSC Location
    ifsc_prefix = complaint.get("suspect_ifsc", "JHRK00")[:4]
    branch_info = IFSC_DISTRICT_MAP.get(ifsc_prefix, {"district": "Jamtara", "state": "Jharkhand", "email": "cybercell.jamtara@jhpolice.gov.in"})
    b_key = f"{branch_info['district']}:{branch_info['state']}"
    if b_key not in seen:
        seen.add(b_key)
        jurisdictions.append({
            "district": branch_info["district"],
            "state": branch_info["state"],
            "role": "Suspect Account Branch Jurisdiction",
            "officer_email": branch_info["email"]
        })

    # 3. Predicted Withdrawal Location
    pred_match = next((d for d in HOTSPOT_DISTRICTS if d["district"].lower() == top_predicted_district.lower()), None)
    pred_state = pred_match["state"] if pred_match else "Jharkhand"
    p_key = f"{top_predicted_district}:{pred_state}"
    if p_key not in seen:
        seen.add(p_key)
        jurisdictions.append({
            "district": top_predicted_district,
            "state": pred_state,
            "role": "Predicted Cash-Out Location",
            "officer_email": f"cybercell.{top_predicted_district.lower().replace(' ', '')}@{pred_state.lower()}.gov.in"
        })

    # 4. Linked Complaints' Jurisdictions (if syndicate cluster)
    if linked_complaints:
        for linked in linked_complaints:
            l_district = linked.get("victim_district", linked.get("victim_state"))
            l_state = linked.get("victim_state")
            l_key = f"{l_district}:{l_state}"
            if l_key not in seen:
                seen.add(l_key)
                jurisdictions.append({
                    "district": l_district,
                    "state": l_state,
                    "role": f"Linked Syndicate Victim ({linked.get('complaint_id')})",
                    "officer_email": f"cybercell.{l_district.lower().replace(' ', '')}@{l_state.lower()}.gov.in"
                })

    return jurisdictions
