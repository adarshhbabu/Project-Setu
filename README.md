# Project Setu — Predictive Cybercrime Withdrawal Intelligence System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-brightgreen.svg)](https://www.python.org/)
[![FastAPI: 0.109+](https://img.shields.io/badge/FastAPI-0.109%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React: 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Design System: Google Stitch](https://img.shields.io/badge/Design_System-Google_Stitch-4285F4.svg)](https://stitch.withgoogle.com/)

**Project Setu** is a proactive cybercrime intelligence grid designed for Law Enforcement Agencies (LEAs) and the Banking, Financial Services, and Insurance (BFSI) sector in India. Rather than reacting after funds have already been laundered through multiple mule accounts, Setu uses **NetworkX graph correlation**, **XGBoost machine learning**, dynamic priority scoring, and **inter-bank HMAC shared registries** to predict cash-out ATM/branch locations within the critical **~34-minute Golden Hour window**.

---

## 🌟 Key Capabilities & Features

1. **Dynamic Urgency & Priority Queue**:
   - Ranks active cybercrime complaints using weighted urgency, log-scaled rupee loss ($\log_{10}\text{Amount}$), and syndicate cluster size.
   - Formula: $\text{Priority} = 0.45 \times \text{UrgencyScore} + 0.35 \times \log_{10}(\text{Amount}) + 0.20 \times \text{ClusterBonus}$

2. **NetworkX Correlation Graph**:
   - Identifies financial fraud syndicates by linking complaints that share exact bank accounts, phone numbers, or device IMEI/IDs.
   - Zero generic bank/IFSC false positives.

3. **Two-Tier Machine Learning Inference Engine**:
   - **Tier 1 (Syndicate Boost)**: $\ge 81\%$ confidence prediction for complaints linked to active syndicate clusters.
   - **Tier 2 (Cold Start Fallback)**: Suspect IFSC branch velocity fallback for isolated first-time complaints.

4. **Model-Native Explainability**:
   - Extracts native XGBoost `feature_importances_` at inference (`Amount`, `Hour Of Day`, `Branch Velocity`).
   - Synthesizes automated plain-language audit logs for law enforcement officers.

5. **Inter-Bank Permissioned Fraud Registry (HMAC-SHA256 Ledger)**:
   - Zero-PII privacy-preserving registry with cryptographic append-only block hash-chaining (`previous_hash`).
   - Requires mandatory FIR / complaint reference logging.
   - Includes **Section 65B Indian Evidence Act** digital certification notices.
   - Exposes supervisory `POST /ledger/unflag` endpoint with mandatory officer rationale logging.

6. **Statutory Freeze Request Generator (CrPC §102 / IT Act §91)**:
   - Pre-fills formal legal restraint documents for bank nodal officers.
   - Includes mandatory non-autonomous framing disclaimers requiring human officer signatory authorization.

7. **Multi-Jurisdiction Alert Dispatcher**:
   - Targeted SendGrid notifications sent simultaneously to Victim Filing Police, Suspect Account Branch Police, and Predicted Cash-Out Hub Police.

---

## 🏗 System Architecture & Directory Layout

```
.
├── backend/
│   ├── app/
│   │   ├── data_gen/        # Synthetic complaint generator & Cluster #47 pre-seeder
│   │   ├── db/              # SQLAlchemy models & SQLite engine
│   │   ├── graph/           # NetworkX correlation graph store engine
│   │   ├── ml/              # XGBoost classifier & Random Forest regressor
│   │   ├── schemas/         # Pydantic request & response validation models
│   │   ├── services/        # Intelligence services (Inference, Ledger, Alerts, Freeze)
│   │   └── main.py          # FastAPI application runner (All 9 REST endpoints)
│   └── tests/               # Comprehensive pytest suite
├── frontend/
│   ├── src/
│   │   ├── api/             # Frontend Axios API client
│   │   ├── components/      # Google Stitch Sidebar, Header, Graph & Explainability UI
│   │   ├── theme/           # Google Stitch design system tokens
│   │   ├── views/           # Dashboard, Priority Queue, Case Detail, Ledger, Impact & Citizen views
│   │   ├── App.tsx          # Main layout & router container
│   │   └── index.css        # Tailwind CSS import directives
│   ├── index.html
│   ├── vite.config.ts       # Vite bundler configuration with PostCSS inline
│   └── tailwind.config.js   # Tailwind theme extensions & Stitch color palette
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: v18.0 or higher
- **Package Manager**: npm or yarn

### 1. Backend Setup & Launch

```bash
# Clone the repository
git clone https://github.com/your-username/project-setu.git
cd project-setu

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy networkx xgboost scikit-learn pydantic sendgrid pytest pandas

# Launch FastAPI Backend Server
python -m backend.app.main
```
> Server runs on `http://localhost:8000`. Automatic OpenAPI documentation available at `http://localhost:8000/docs`.

### 2. Frontend Setup & Launch

```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```
> Application portal runs live on `http://localhost:3000`.

---

## 🧪 Running Automated Tests

```bash
# Run pytest verification suite across all backend modules
pytest backend/tests/
```

---

## ⚖ Statutory & Synthetic Data Compliance Disclosures

- **Data Attribution**: All synthetic complaint records generated by Project Setu are watermarked with the disclosure: `"Simulated data, calibrated to public NCRB/RBI figures"`.
- **Human-in-the-Loop Mandate**: Project Setu strictly prohibits autonomous execution of bank liens or debit freezes. All generated document orders require human authorization by designated police and bank compliance officers.
- **Section 65B Notice**: Ledger transaction hashes provide cryptographic proof of audit trail chain-of-custody under Section 65B of the Indian Evidence Act.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
