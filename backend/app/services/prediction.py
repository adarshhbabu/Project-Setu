"""
Project Setu - Prediction Service
Wraps two-tier inference logic.
"""

from typing import Dict, Any, Tuple, List
from ..ml.inference import global_inference_engine

def predict_withdrawal_location(complaint: dict, linked_complaints: List[dict] = None) -> Tuple[List[dict], int, float, List[dict], str]:
    cluster_id = complaint.get("cluster_id")
    cluster_size = len(linked_complaints) if linked_complaints else (1 if not cluster_id else 2)
    
    cluster_info = {
        "cluster_id": cluster_id,
        "cluster_size": cluster_size
    }
    
    tier = "TIER_1_CLUSTER_HISTORY" if cluster_id else "TIER_2_COLD_START_IFSC_VELOCITY"
    
    predictions, urgency_mins, top_confidence, feature_importances = global_inference_engine.predict(complaint, cluster_info)
    
    return predictions, urgency_mins, top_confidence, feature_importances, tier
