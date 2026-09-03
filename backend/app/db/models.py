"""
Project Setu - Relational ORM Models
Defines tables for Complaints, Clusters, Queue Items, Alerts, and Ledger Audit.
"""

from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)
    victim_name = Column(String, nullable=False)
    victim_state = Column(String, nullable=False)
    victim_district = Column(String, nullable=False)
    victim_pincode = Column(String, nullable=False)
    
    fraud_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    
    suspect_account = Column(String, index=True, nullable=False)
    suspect_ifsc = Column(String, index=True, nullable=False)
    suspect_bank = Column(String, nullable=True)
    suspect_phone = Column(String, index=True, nullable=False)
    suspect_device_id = Column(String, index=True, nullable=True)
    
    cluster_id = Column(String, index=True, nullable=True)
    predicted_district = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    urgency_minutes = Column(Integer, nullable=True)
    priority_score = Column(Float, nullable=True)
    
    status = Column(String, default="INGESTED") # INGESTED, CLUSTERED, SCORED, ROUTED
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_synthetic = Column(Boolean, default=True)
    data_label = Column(String, default="Simulated data, calibrated to public NCRB/RBI figures")

class JurisdictionAlert(Base):
    __tablename__ = "jurisdiction_alerts"

    id = Column(String, primary_key=True, index=True)
    complaint_id = Column(String, ForeignKey("complaints.id"))
    cluster_id = Column(String, nullable=True)
    jurisdiction_district = Column(String, nullable=False)
    jurisdiction_state = Column(String, nullable=False)
    officer_email = Column(String, nullable=False)
    urgency_minutes = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    status = Column(String, default="DISPATCHED") # DISPATCHED, ACKNOWLEDGED
    dispatched_at = Column(DateTime, default=datetime.utcnow)

class PermissionedLedgerEntry(Base):
    __tablename__ = "permissioned_ledger"

    id = Column(String, primary_key=True, index=True)
    hmac_hash = Column(String, unique=True, index=True, nullable=False)
    identifier_type = Column(String, nullable=False) # ACCOUNT, PHONE, DEVICE
    complaint_reference = Column(String, nullable=False)
    flagged_by_bank = Column(String, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, UNFLAGGED
    created_at = Column(DateTime, default=datetime.utcnow)
    unflagged_by = Column(String, nullable=True)
    unflagged_at = Column(DateTime, nullable=True)
