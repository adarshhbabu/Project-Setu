"""
Project Setu - Pydantic Request / Response Schemas
Validation schemas for API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ComplaintCreateSchema(BaseModel):
    victim_name: str = Field(..., example="Priya Sharma")
    victim_state: str = Field(..., example="Rajasthan")
    victim_district: str = Field(..., example="Jaipur")
    victim_pincode: str = Field(..., example="302001")
    fraud_type: str = Field(..., example="Digital Arrest Scam")
    amount: float = Field(..., example=125000.0)
    suspect_account: str = Field(..., example="9988777741")
    suspect_ifsc: str = Field(..., example="JHRK0009")
    suspect_bank: Optional[str] = Field(default="Jharkhand Gramin Bank")
    suspect_phone: str = Field(..., example="+91-7000011122")
    suspect_device_id: Optional[str] = Field(default="DEV-D82F94E4")

class LedgerFlagRequestSchema(BaseModel):
    identifier: str = Field(..., example="9988777741")
    complaint_reference: str = Field(..., example="CMP-10412")
    bank_id: str = Field(..., example="BANK_AXIS_001")
    identifier_type: Optional[str] = Field(default="ACCOUNT")

class LedgerUnflagRequestSchema(BaseModel):
    hash: str = Field(..., example="8f92a1...")
    supervisor_id: str = Field(..., example="SUP_OFFICER_007")
    reason: str = Field(..., example="Formal police verification cleared suspect account.")

class AlertDispatchSchema(BaseModel):
    complaint_id: str = Field(..., example="CMP-10412")
