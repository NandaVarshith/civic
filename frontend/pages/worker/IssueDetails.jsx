import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';
import './IssueDetails.css';

const statusFlow = ['Assigned', 'In Progress', 'Completed'];

function IssueDetails() {
  const { id: issueId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [toast, setToast] = useState({ text: '', type: 'success', open: false });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/issues/${issueId}`, { withCredentials: true });
        setIssue(res.data);
        setStatus(res.data.status || 'Assigned');
      } catch (error) {
        setToast({ text: error.response?.data?.message || 'Failed to load issue', type: 'error', open: true });
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [apiUrl, issueId]);

  const allowedStatuses = useMemo(() => {
    if (!issue) return ['Assigned'];
    const current = issue.status;
    if (current === 'Assigned') return ['Assigned', 'In Progress'];
    if (current === 'In Progress') return ['In Progress', 'Completed'];
    if (current === 'Completed') return ['Completed'];
    return [current];
  }, [issue]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setToast({ text: 'Only image files allowed', type: 'error', open: true });
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submitUpdate = async () => {
    setLoadingUpload(true);
    setSubmitting(true);
    const formData = new FormData();
    formData.append('status', status);
    if (notes) formData.append('notes', notes);
    if (file) formData.append('image', file);

    try {
      const res = await axios.put(`${apiUrl}api/worker/update/${issueId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIssue(res.data.issue);
      setStatus(res.data.issue.status);
      setToast({ text: 'Status updated successfully', type: 'success', open: true });
      setTimeout(() => navigate('/worker/issues'), 1000);
    } catch (error) {
      setToast({ text: error.response?.data?.message || 'Update failed', type: 'error', open: true });
    } finally {
      setSubmitting(false);
      setLoadingUpload(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'Completed' && !confirmOpen) {
      setConfirmOpen(true);
      return;
    }
    submitUpdate();
  };

  const priorityTone = (issue?.priority || 'Low').toLowerCase();
  const currentStep = statusFlow.indexOf((issue?.status) || 'Assigned');

  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 2200);
    return () => clearTimeout(t);
  }, [toast.open]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content issue-details-page">
        <CommonHeader title="Issue Details" />

        {loading && <div className="loading">Loading issue...</div>}

        {!loading && issue && (
          <div className="issue-details-layout">
            <section className="card detail-card">
              <div className="card-header">
                <div>
                  <p className="label">Title</p>
                  <h2 className="title-text">{issue.title}</h2>
                  <p className="muted">{issue.category}</p>
                </div>
                <div className="pill-col">
                  <span className={`pill priority priority-${priorityTone}`}>{issue.priority}</span>
                  <span className={`pill status status-${issue.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              <div className="stepper">
                {statusFlow.map((step, idx) => (
                  <div key={step} className="step">
                    <div className={`step-dot ${idx <= currentStep ? 'active' : ''}`} />
                    <span className={`step-label ${idx <= currentStep ? 'active' : ''}`}>{step}</span>
                    {idx < statusFlow.length - 1 && <div className={`step-line ${idx < currentStep ? 'active' : ''}`} />}
                  </div>
                ))}
              </div>

              <div className="detail-grid">
                <div>
                  <p className="label">Category</p>
                  <p>{issue.category}</p>
                </div>
                <div>
                  <p className="label">Assigned Date</p>
                  <p>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="full-row">
                  <p className="label">Address</p>
                  <p>{issue.location?.address}</p>
                </div>
                <div className="full-row">
                  <p className="label">Description</p>
                  <p className="muted-box">{issue.description}</p>
                </div>
                {issue.instructions && (
                  <div className="full-row">
                    <p className="label">Admin Instructions</p>
                    <p className="muted-box">{issue.instructions}</p>
                  </div>
                )}
                {issue.proofImage && (
                  <div className="full-row">
                    <p className="label">Existing Proof</p>
                    <img src={issue.proofImage} alt="proof" className="preview existing" />
                  </div>
                )}
              </div>
            </section>

            <section className="card update-card">
              <h3>Update Status</h3>
              <p className="muted small">Advance the issue, add a note, and attach proof if available.</p>
              <form onSubmit={handleSubmit} className="update-form">
                <label className="label" htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={submitting}
                >
                  {allowedStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label className="label" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Add work notes or updates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />

                <label className="label" htmlFor="proof">Proof Image (optional)</label>
                <div className="file-row">
                  <input id="proof" type="file" accept="image/*" onChange={handleFileChange} disabled={submitting} />
                  {file && (
                    <button
                      type="button"
                      className="ghost-btn compact"
                      onClick={() => { setFile(null); setPreview(''); }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {preview && <img src={preview} alt="preview" className="preview" />}

                <button type="submit" className="assign-btn" disabled={submitting || loadingUpload}>
                  {submitting ? 'Updating...' : 'Update Issue'}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      {toast.open && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`} role="status">
          {toast.text}
        </div>
      )}

      {confirmOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true">
            <h3>Mark as completed?</h3>
            <p>This will set the issue status to Completed.</p>
            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={() => setConfirmOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="button" className="assign-btn" onClick={submitUpdate} disabled={submitting}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueDetails;
