"""
Project Setu - Correlation Service
Provides graph-based correlation for complaints.
"""

from typing import Dict, List, Tuple, Optional
from ..graph.graph_engine import global_graph_engine

def correlate_complaint(complaint: dict) -> Tuple[Optional[str], List[dict], dict]:
    """
    Ingests complaint into the graph engine, detects linked syndicate complaints,
    and returns (cluster_id, list_of_linked_complaints, network_graph_data).
    """
    cluster_id, linked = global_graph_engine.add_complaint(complaint)
    graph_data = global_graph_engine.get_network_graph_data(complaint["complaint_id"])
    return cluster_id, linked, graph_data
