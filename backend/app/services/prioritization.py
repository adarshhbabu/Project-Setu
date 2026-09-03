"""
Project Setu - Prioritization Engine
Calculates weighted case priority score combining:
- Urgency score (inverted urgency countdown)
- Log-scaled recovery amount (so Rs 15,000 cases aren't drowned out by Rs 5 Lakhs)
- Syndicate Cluster-size bonus
"""

import math
from typing import Dict, Any

def calculate_priority_score(urgency_minutes: int, amount: float, cluster_size: int = 1) -> float:
    # 1. Urgency score (max score 100 for urgency <= 15 mins, decaying smoothly)
    urgency_score = max(10, 100 - (urgency_minutes * 0.5))
    
    # 2. Log-scaled amount score (log10 scaled to prevent raw rupee dominance)
    # log10(1,000) = 3; log10(15,000) = 4.17; log10(500,000) = 5.70
    log_amount = math.log10(max(1000, amount))
    amount_score = log_amount * 12.0
    
    # 3. Syndicate cluster size bonus (boost multi-victim multi-state syndicates)
    cluster_bonus = (cluster_size - 1) * 25.0 if cluster_size > 1 else 0.0
    
    total_priority = (0.45 * urgency_score) + (0.35 * amount_score) + (0.20 * cluster_bonus)
    return round(total_priority, 2)
