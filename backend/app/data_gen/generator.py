"""
Project Setu - Synthetic Data Generator & Pre-seeder
Calibrated to public figures from NCRB (Crime in India), I4C/PIB releases, and RBI payment fraud reports.
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Documented Hotspot Districts & Representative Banks/IFSCs
HOTSPOT_DISTRICTS = [
    {"district": "Deoghar", "state": "Jharkhand", "ifsc_prefix": "JHRK00", "pincodes": ["814112", "814113"]},
    {"district": "Jamtara", "state": "Jharkhand", "ifsc_prefix": "JHRK00", "pincodes": ["815351", "815352"]},
    {"district": "Nuh", "state": "Haryana", "ifsc_prefix": "HARY00", "pincodes": ["122107", "122108"]},
    {"district": "Mewat", "state": "Haryana", "ifsc_prefix": "HARY00", "pincodes": ["122108", "122109"]},
    {"district": "Bharatpur", "state": "Rajasthan", "ifsc_prefix": "RAJ00", "pincodes": ["321001", "321002"]},
    {"district": "Alwar", "state": "Rajasthan", "ifsc_prefix": "RAJ00", "pincodes": ["301001", "301002"]},
    {"district": "Nawada", "state": "Bihar", "ifsc_prefix": "BIH00", "pincodes": ["805110", "805111"]},
    {"district": "Ahmedabad", "state": "Gujarat", "ifsc_prefix": "GUJ00", "pincodes": ["380001", "380002"]},
    {"district": "Jaipur", "state": "Rajasthan", "ifsc_prefix": "RAJ00", "pincodes": ["302001", "302002"]},
    {"district": "Cyberabad", "state": "Telangana", "ifsc_prefix": "TEL00", "pincodes": ["500081", "500082"]},
    {"district": "Bengaluru", "state": "Karnataka", "ifsc_prefix": "KAR00", "pincodes": ["560001", "560002"]},
    {"district": "Delhi NCR", "state": "Delhi", "ifsc_prefix": "DEL00", "pincodes": ["110001", "110002"]}
]

FRAUD_TYPES = [
    "Digital Arrest Scam",
    "UPI Fraud / QR Code Scam",
    "Investment / Trading Scam",
    "Loan App Fraud",
    "Sextortion / Blackmail",
    "Part-Time Job Scam",
    "SIM Swap Fraud"
]

VICTIM_STATES = ["Kerala", "Maharashtra", "Bihar", "Rajasthan", "Karnataka", "Delhi", "Telangana", "West Bengal", "Uttar Pradesh"]

def generate_random_complaint(complaint_id: str = None, suspect_phone: str = None, suspect_account: str = None) -> Dict[str, Any]:
    cid = complaint_id or f"CMP-{random.randint(10000, 99999)}"
    fraud_type = random.choice(FRAUD_TYPES)
    
    # Amount distribution calibrated to NCRB fraud tiers
    if fraud_type in ["Investment / Trading Scam", "Digital Arrest Scam"]:
        amount = round(random.uniform(40000, 250000), 2)
    elif fraud_type == "Loan App Fraud":
        amount = round(random.uniform(10000, 50000), 2)
    else:
        amount = round(random.uniform(5000, 80000), 2)
        
    hotspot = random.choice(HOTSPOT_DISTRICTS)
    suspect_ifsc = f"{hotspot['ifsc_prefix']}{random.randint(1000, 9999)}"
    acct = suspect_account or f"{random.randint(1000000000, 9999999999)}"
    phone = suspect_phone or f"+91-7{random.randint(100000000, 999999999)}"
    device_id = f"DEV-{uuid.uuid4().hex[:8].upper()}"
    
    victim_state = random.choice(VICTIM_STATES)
    timestamp = datetime.now() - timedelta(minutes=random.randint(10, 1440))
    
    return {
        "complaint_id": cid,
        "victim_name": f"Victim_{random.randint(100, 999)}",
        "victim_state": victim_state,
        "victim_district": f"{victim_state} Central",
        "victim_pincode": f"{random.randint(110000, 700000)}",
        "fraud_type": fraud_type,
        "amount": amount,
        "suspect_account": acct,
        "suspect_ifsc": suspect_ifsc,
        "suspect_bank": f"{hotspot['state']} State Bank",
        "suspect_phone": phone,
        "suspect_device_id": device_id,
        "timestamp": timestamp.isoformat(),
        "status": "INGESTED",
        "is_synthetic": True,
        "data_label": "Simulated data, calibrated to public NCRB/RBI figures"
    }

def get_preseeded_cluster_47() -> List[Dict[str, Any]]:
    """
    Creates the pre-seeded Cluster #47 background complaints specified in the mock demo scenario:
    - CMP-10231 (Kerala, Investment scam, Rs 42,000, A/C ...7741, IFSC JHRK0009, Phone +91-7XXXX11122)
    - CMP-10298 (Maharashtra, Loan app fraud, Rs 18,500, A/C ...7741, IFSC JHRK0009)
    - CMP-10355 (Bihar, Digital arrest scam, Rs 96,000, Phone +91-7XXXX11122)
    """
    shared_acct = "9988777741"
    shared_phone = "+91-7000011122"
    shared_ifsc = "JHRK0009"
    
    c1 = {
        "complaint_id": "CMP-10231",
        "victim_name": "Ramesh Kumar",
        "victim_state": "Kerala",
        "victim_district": "Ernakulam",
        "victim_pincode": "682001",
        "fraud_type": "Investment / Trading Scam",
        "amount": 42000.0,
        "suspect_account": shared_acct,
        "suspect_ifsc": shared_ifsc,
        "suspect_bank": "Jharkhand Gramin Bank",
        "suspect_phone": shared_phone,
        "suspect_device_id": "DEV-A81F92B1",
        "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
        "status": "PROCESSED",
        "is_synthetic": True,
        "data_label": "Simulated data, calibrated to public NCRB/RBI figures"
    }
    
    c2 = {
        "complaint_id": "CMP-10298",
        "victim_name": "Sunita Patil",
        "victim_state": "Maharashtra",
        "victim_district": "Pune",
        "victim_pincode": "411001",
        "fraud_type": "Loan App Fraud",
        "amount": 18500.0,
        "suspect_account": shared_acct,
        "suspect_ifsc": shared_ifsc,
        "suspect_bank": "Jharkhand Gramin Bank",
        "suspect_phone": "+91-7999922233",
        "suspect_device_id": "DEV-B92E81C2",
        "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
        "status": "PROCESSED",
        "is_synthetic": True,
        "data_label": "Simulated data, calibrated to public NCRB/RBI figures"
    }
    
    c3 = {
        "complaint_id": "CMP-10355",
        "victim_name": "Bijay Singh",
        "victim_state": "Bihar",
        "victim_district": "Patna",
        "victim_pincode": "800001",
        "fraud_type": "Digital Arrest Scam",
        "amount": 96000.0,
        "suspect_account": "8877665544",
        "suspect_ifsc": "JHRK0009",
        "suspect_bank": "Jharkhand Gramin Bank",
        "suspect_phone": shared_phone,
        "suspect_device_id": "DEV-C10F93D3",
        "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
        "status": "PROCESSED",
        "is_synthetic": True,
        "data_label": "Simulated data, calibrated to public NCRB/RBI figures"
    }
    
    return [c1, c2, c3]
