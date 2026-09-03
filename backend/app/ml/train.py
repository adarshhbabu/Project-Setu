"""
Project Setu - Machine Learning Model Trainer
Trains XGBoost classifier for multi-class withdrawal location prediction
and Random Forest regressor for urgency countdown estimation.
"""

import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from ..data_gen.generator import HOTSPOT_DISTRICTS, FRAUD_TYPES, generate_random_complaint

DISTRICT_NAMES = [d["district"] for d in HOTSPOT_DISTRICTS]

FEATURE_COLUMNS = [
    "amount",
    "fraud_type_encoded",
    "ifsc_prefix_encoded",
    "is_cluster_match",
    "cluster_size",
    "hour_of_day",
    "branch_velocity"
]

def train_and_save_models():
    """
    Generates synthetic training dataset, fits models, and serializes artifacts.
    """
    data = []
    fraud_le = LabelEncoder()
    fraud_le.fit(FRAUD_TYPES)
    
    ifsc_prefixes = list(set([d["ifsc_prefix"] for d in HOTSPOT_DISTRICTS]))
    ifsc_le = LabelEncoder()
    ifsc_le.fit(ifsc_prefixes)

    # Generate 1,000 synthetic training samples calibrated to public distributions
    for _ in range(1000):
        cmp_data = generate_random_complaint()
        amount = cmp_data["amount"]
        ftype = cmp_data["fraud_type"]
        ft_enc = fraud_le.transform([ftype])[0] if ftype in FRAUD_TYPES else 0
        
        ifsc_pref = cmp_data["suspect_ifsc"][:4]
        ifsc_enc = ifsc_le.transform([ifsc_pref])[0] if ifsc_pref in ifsc_prefixes else 0
        
        is_cluster = 1 if np.random.rand() > 0.6 else 0
        c_size = np.random.randint(2, 8) if is_cluster else 1
        hour = np.random.randint(0, 24)
        b_velocity = np.random.randint(1, 15)
        
        # Ground truth target assignment reflecting hotspot probability rules
        if is_cluster:
            # Clusters strongly lean toward Deoghar, Jamtara, Nuh, Mewat
            target_district = np.random.choice(["Deoghar", "Jamtara", "Nuh", "Mewat", "Bharatpur"])
            target_urgency = np.random.randint(15, 60) # High urgency (15-60 mins)
        else:
            target_district = np.random.choice(DISTRICT_NAMES)
            target_urgency = np.random.randint(45, 180) # Medium urgency
            
        data.append({
            "amount": amount,
            "fraud_type_encoded": ft_enc,
            "ifsc_prefix_encoded": ifsc_enc,
            "is_cluster_match": is_cluster,
            "cluster_size": c_size,
            "hour_of_day": hour,
            "branch_velocity": b_velocity,
            "target_district": target_district,
            "target_urgency": target_urgency
        })
        
    df = pd.DataFrame(data)
    
    X = df[FEATURE_COLUMNS]
    y_dist = df["target_district"]
    y_urgency = df["target_urgency"]
    
    district_le = LabelEncoder()
    y_dist_enc = district_le.fit_transform(y_dist)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y_dist_enc)
    
    reg = RandomForestRegressor(n_estimators=50, random_state=42)
    reg.fit(X, y_urgency)
    
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    with open(os.path.join(models_dir, "location_clf.pkl"), "wb") as f:
        pickle.dump(clf, f)
    with open(os.path.join(models_dir, "urgency_reg.pkl"), "wb") as f:
        pickle.dump(reg, f)
    with open(os.path.join(models_dir, "encoders.pkl"), "wb") as f:
        pickle.dump({
            "fraud_le": fraud_le,
            "ifsc_le": ifsc_le,
            "district_le": district_le,
            "ifsc_prefixes": ifsc_prefixes
        }, f)
        
    print("Successfully trained and saved ML models to backend/app/ml/models/")

if __name__ == "__main__":
    train_and_save_models()
