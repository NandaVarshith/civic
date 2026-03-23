import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Assignissue.css';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', tone: 'success' },
  { value: 'Medium', label: 'Medium', tone: 'warning' },
  { value: 'High', label: 'High', tone: 'danger' },
];

function Assignissue() {
  const { id: issueId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [issue, setIssue] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loadingIssue, setLoadingIssue] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    workerId: '',
    instructions: '',
    priority: 'Medium',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldError, setFieldError] = useState('');
  const [toast, setToast] = useState({ text: '', type: 'success', open: false });

  const loadIssue = useCallback(async () => {
    setLoadingIssue(true);
    try {
      const res = await axios.get(`${apiUrl}api/issues/${issueId}`, { withCredentials: true });
      setIssue(res.data);
      setForm((prev) => ({ ...prev, priority: res.data?.priority || 'Medium' }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to load issue' });
    } finally {
      setLoadingIssue(false);
    }
  }, [apiUrl, issueId]);

  const loadWorkers = useCallback(async () => {
    setLoadingWorkers(true);
    try {
      const res = await axios.get(`${apiUrl}api/admin/workers`, { withCredentials: true });
      setWorkers(res.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to load workers' });
    } finally {
      setLoadingWorkers(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadIssue();
    loadWorkers();
  }, [loadIssue, loadWorkers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (text, type = 'success') => {
    setToast({ text, type, open: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setFieldError('');

    if (!form.workerId) {
      setFieldError('workerId');
      setMessage({ type: 'error', text: 'Please select a worker.' });
      return;
    }
    if (form.instructions.length > 600) {
      setFieldError('instructions');
      setMessage({ type: 'error', text: 'Instructions should be under 600 characters.' });
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${apiUrl}api/admin/assign/${issueId}`,
        {
          workerId: form.workerId,
          instructions: form.instructions,
          priority: form.priority,
        },
        { withCredentials: true }
      );

      setMessage({ type: 'success', text: 'Issue assigned successfully' });
      showToast('Assigned to worker', 'success');
      setTimeout(() => navigate('/admin/myissues'), 900);
    } catch (error) {
      const text = error.response?.data?.message || 'Failed to assign issue';
      setMessage({ type: 'error', text });
      showToast(text, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!toast.open) return;
    const timer = setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 2500);
    return () => clearTimeout(timer);
  }, [toast.open]);

  const isLoading = loadingIssue || loadingWorkers;
  const disabledSubmit = submitting || isLoading || !form.workerId || workers.length === 0;
  const selectedWorker = useMemo(
    () => workers.find((w) => w._id === form.workerId),
    [form.workerId, workers]
  );
  const selectedPriorityTone = useMemo(
    () => PRIORITY_OPTIONS.find((p) => p.value === form.priority)?.tone || 'warning',
    [form.priority]
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content assign-page">
        <CommonHeader title="Assign Issue" />

        {isLoading && (
          <div className="loading-bar" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Loading issue details...</span>
          </div>
        )}

        {!isLoading && (
          <section className="assign-shell">
            <div className="assign-layout">
              <div className="queue-panel card elevate">
                <div className="panel-header">
                  <h3>Issue</h3>
                  <p>ID: {issue?._id}</p>
                </div>

                {issue && (
                  <div className="issue-summary">
                    <div>
                      <span>Title</span>
                      <p>{issue.title}</p>
                    </div>
                    <div>
                      <span>Status</span>
                      <p>{issue.status}</p>
                    </div>
                    <div>
                      <span>Category</span>
                      <p>{issue.category}</p>
                    </div>
                    <div>
                      <span>Priority</span>
                      <p>{issue.priority}</p>
                    </div>
                    <div className="summary-full">
                      <span>Description</span>
                      <p>{issue.description}</p>
                    </div>
                    {issue.location?.address && (
                      <div className="summary-full">
                        <span>Address</span>
                        <p>{issue.location.address}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="assign-panel card elevate">
                <div className="panel-header">
                  <h3>Assign to Worker</h3>
                  <p>Select a worker, set priority, and add clear instructions.</p>
                </div>

                {message.text && (
                  <div
                    className={`banner ${message.type === 'error' ? 'banner-error' : 'banner-success'}`}
                    role="alert"
                  >
                    {message.text}
                  </div>
                )}

                <form className="assign-form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="workerId">
                        Worker <span className="required">*</span>
                      </label>
                      <select
                        id="workerId"
                        name="workerId"
                        value={form.workerId}
                        onChange={handleChange}
                        disabled={loadingWorkers}
                        className={fieldError === 'workerId' ? 'error-border' : ''}
                      >
                        <option value="">Select worker</option>
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.username} ({worker.email})
                          </option>
                        ))}
                      </select>
                      {selectedWorker && (
                        <p className="helper-text">Assigning to: {selectedWorker.username}</p>
                      )}
                      {!loadingWorkers && workers.length === 0 && (
                        <p className="helper-text warning">No workers available. Please add workers first.</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="priority">Priority</label>
                      <div className={`priority-chip tone-${selectedPriorityTone}`}>
                        <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                        <span className="chip-dot" aria-hidden />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="instructions">Instructions</label>
                      <textarea
                        id="instructions"
                        name="instructions"
                        rows={4}
                        placeholder="Add instructions for the worker"
                        value={form.instructions}
                        onChange={handleChange}
                        className={fieldError === 'instructions' ? 'error-border' : ''}
                      />
                      <p className="helper-text">Be concise and action-focused. Max 600 characters.</p>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="assign-btn" disabled={disabledSubmit}>
                      {submitting ? 'Assigning...' : 'Assign Issue'}
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => navigate(-1)}
                      disabled={submitting}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => {
                        loadIssue();
                        loadWorkers();
                      }}
                      disabled={submitting}
                    >
                      Refresh
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
      {toast.open && (
        <div
          className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-text">{toast.text}</span>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => setToast((prev) => ({ ...prev, open: false }))}
          >
            ×
          </button>
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default Assignissue;
