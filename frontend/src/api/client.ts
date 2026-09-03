/**
 * Project Setu - API Client
 * Interacts with FastAPI backend REST endpoints.
 */

const API_BASE_URL = 'http://localhost:8000';

export async function fetchQueue() {
  const res = await fetch(`${API_BASE_URL}/queue`);
  if (!res.ok) throw new Error('Failed to fetch queue');
  return res.json();
}

export async function fetchComplaintPrediction(id: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/prediction`);
  if (!res.ok) throw new Error('Failed to fetch prediction');
  return res.json();
}

export async function fetchCitizenStatus(id: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`);
  if (!res.ok) throw new Error('Failed to fetch citizen status');
  return res.json();
}

export async function ingestComplaint(payload: any) {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to ingest complaint');
  return res.json();
}

export async function dispatchAlert(complaintId: string) {
  const res = await fetch(`${API_BASE_URL}/alerts/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint_id: complaintId })
  });
  if (!res.ok) throw new Error('Failed to dispatch alert');
  return res.json();
}

export async function generateFreezeRequest(complaintId: string) {
  const res = await fetch(`${API_BASE_URL}/freeze-request/${complaintId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to generate freeze request');
  return res.json();
}

export async function checkLedgerFlag(hashOrId: string) {
  const res = await fetch(`${API_BASE_URL}/ledger/check/${encodeURIComponent(hashOrId)}`);
  if (!res.ok) throw new Error('Failed to check ledger');
  return res.json();
}

export async function flagLedgerIdentifier(payload: { identifier: string; complaint_reference: string; bank_id: string; identifier_type?: string }) {
  const res = await fetch(`${API_BASE_URL}/ledger/flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to flag ledger identifier');
  return res.json();
}

export async function fetchImpactMetrics() {
  const res = await fetch(`${API_BASE_URL}/dashboard/impact`);
  if (!res.ok) throw new Error('Failed to fetch impact metrics');
  return res.json();
}
