"""
Project Setu - NetworkX Graph Store Engine
Maintains an in-memory graph of suspect identifier nodes and complaint edges.
"""

import networkx as nx
import re
from typing import Dict, List, Set, Optional, Tuple

class SetuGraphEngine:
    def __init__(self):
        self.graph = nx.Graph()
        self.complaint_map: Dict[str, dict] = {}
        self.cluster_counter = 0

    @staticmethod
    def normalize_identifier(ident_type: str, raw_val: Optional[str]) -> Optional[str]:
        if not raw_val:
            return None
        cleaned = raw_val.strip()
        if ident_type == "phone":
            # Remove +91, 91, spaces, dashes
            cleaned = re.sub(r"[\s\-\+\(\)]", "", cleaned)
            if cleaned.startswith("91") and len(cleaned) == 12:
                cleaned = cleaned[2:]
            return f"phone:{cleaned}"
        elif ident_type == "account":
            cleaned = re.sub(r"[\s\-]", "", cleaned)
            cleaned = cleaned.lstrip("0")
            return f"acct:{cleaned}"
        elif ident_type == "device":
            cleaned = cleaned.upper().strip()
            return f"device:{cleaned}"
        return None

    def add_complaint(self, complaint: dict) -> Tuple[Optional[str], List[dict]]:
        """
        Adds a complaint to the graph. Matches strictly on exact identifiers:
        - Account number
        - Phone number
        - Device ID
        Returns (cluster_id, list_of_linked_complaints).
        """
        cid = complaint["complaint_id"]
        self.complaint_map[cid] = complaint
        
        identifiers = []
        acct_node = self.normalize_identifier("account", complaint.get("suspect_account"))
        phone_node = self.normalize_identifier("phone", complaint.get("suspect_phone"))
        dev_node = self.normalize_identifier("device", complaint.get("suspect_device_id"))
        
        if acct_node:
            identifiers.append(acct_node)
        if phone_node:
            identifiers.append(phone_node)
        if dev_node:
            identifiers.append(dev_node)
            
        # Check matching nodes already in graph
        existing_clusters: Set[str] = set()
        matched_complaint_ids: Set[str] = set()
        
        for ident in identifiers:
            if self.graph.has_node(ident):
                # Look at connected complaints
                for neighbor in self.graph.neighbors(ident):
                    if neighbor.startswith("CMP-") or self.graph.nodes[neighbor].get("type") == "complaint":
                        matched_complaint_ids.add(neighbor)
                        cluster_attr = self.graph.nodes[neighbor].get("cluster_id")
                        if cluster_attr:
                            existing_clusters.add(cluster_attr)

        # Determine cluster ID
        if existing_clusters:
            cluster_id = sorted(list(existing_clusters))[0]
        elif matched_complaint_ids:
            self.cluster_counter += 1
            cluster_id = f"Cluster #{self.cluster_counter:02d}"
        elif len(identifiers) > 0:
            # First complaint in a potential future cluster
            cluster_id = None
        else:
            cluster_id = None

        # Add complaint node
        self.graph.add_node(cid, type="complaint", cluster_id=cluster_id, data=complaint)
        
        # Add edges from complaint node to identifier nodes
        for ident in identifiers:
            if not self.graph.has_node(ident):
                self.graph.add_node(ident, type="identifier")
            self.graph.add_edge(cid, ident)

        # Re-assign cluster_id across connected component if a merge happened
        if matched_complaint_ids and not cluster_id:
            self.cluster_counter += 1
            cluster_id = f"Cluster #{self.cluster_counter:02d}"
            
        if cluster_id:
            # Update all nodes in this connected component
            component = nx.node_connected_component(self.graph, cid)
            for node in component:
                if self.graph.nodes[node].get("type") == "complaint":
                    self.graph.nodes[node]["cluster_id"] = cluster_id
                    comp_cid = node
                    if comp_cid in self.complaint_map:
                        self.complaint_map[comp_cid]["cluster_id"] = cluster_id

        # Collect linked complaints
        linked_complaints = []
        if cluster_id:
            component = nx.node_connected_component(self.graph, cid)
            for node in component:
                if self.graph.nodes[node].get("type") == "complaint":
                    linked_complaints.append(self.complaint_map[node])
                    
        return cluster_id, linked_complaints

    def get_cluster_details(self, cluster_id: str) -> List[dict]:
        results = []
        for cid, cmp_obj in self.complaint_map.items():
            if cmp_obj.get("cluster_id") == cluster_id:
                results.append(cmp_obj)
        return results

    def get_network_graph_data(self, complaint_id: str) -> dict:
        """
        Returns JSON-serializable node and edge list for rendering D3/Canvas graph in UI.
        """
        if not self.graph.has_node(complaint_id):
            return {"nodes": [], "edges": []}
            
        component = nx.node_connected_component(self.graph, complaint_id)
        subgraph = self.graph.subgraph(component)
        
        nodes = []
        edges = []
        
        for n, attrs in subgraph.nodes(data=True):
            node_type = attrs.get("type", "unknown")
            label = n
            if node_type == "complaint":
                data = attrs.get("data", {})
                label = f"{n} (₹{data.get('amount', 0):,.0f})"
            nodes.append({"id": n, "label": label, "type": node_type, "cluster_id": attrs.get("cluster_id")})
            
        for u, v in subgraph.edges():
            edges.append({"source": u, "target": v})
            
        return {"nodes": nodes, "edges": edges}

# Global Singleton Graph Instance
global_graph_engine = SetuGraphEngine()
