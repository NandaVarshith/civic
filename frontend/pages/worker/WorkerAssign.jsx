import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';
import './IssueDetails.css';

function WorkerAssign() {
  const { id: issueId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [issue, setIssue] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({ workerId: '', instructions: '', priority: 'Medium' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ text: '', type: 'success', open: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issueRes, workerRes] = await Promise.all([
          axios.get(`${apiUrl}api/issues/${issueId}`, { withCredentials: true }),
          axios.get(`${apiUrl}api/admin/workers`, { withCredentials: true }),
        ]);
        setIssue(issueRes.data);
        setForm((prev) => ({
          ...prev,
          priority: issueRes.data.priority || 'Medium',
          workerId: issueRes.data.assignedTo || '',
          instructions: issueRes.data.instructions || '',
        }));
        setWorkers(workerRes.data || []);
      } catch (error) {
        setToast({ text: error.response?.data?.message || 'Failed to load data', type: 'error', open: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, issueId]);

  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, open: false })), 2200);
    return () => clearTimeout(t);
  }, [toast.open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setToast({ text: 'Issue updated', type: 'success', open: true });
      setTimeout(() => navigate('/worker/myissues'), 900);
    } catch (error) {
      setToast({ text: error.response?.data?.message || 'Update failed', type: 'error', open: true });
    } finally {
      setSubmitting(false);
    }
  };

  const priorityTone = (form.priority || 'Medium').toLowerCase();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content wid-page">
        <CommonHeader title="Edit Assignment" />

        {loading && <div className="wid-loading">Loading...</div>}

        {!loading && issue && (
          <div className="wid-layout">
            <section className="wid-card">
              <div className="wid-card-header">
                <div>
                  <p className="wid-label">Title</p>
                  <h2 className="wid-title">{issue.title}</h2>
                  <p className="wid-muted">{issue.category}</p>
                </div>
                <div className="wid-pill-row">
                  <span className={`wid-pill wid-priority-${priorityTone}`}>{issue.priority}</span>
                  <span className={`wid-pill wid-status-${issue.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              <div className="wid-detail-grid">
                <div>
                  <p className="wid-label">Address</p>
                  <p>{issue.location?.address}</p>
                </div>
                <div>
                  <p className="wid-label">Reported</p>
                  <p>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="wid-full">
                  <p className="wid-label">Description</p>
                  <p className="wid-box">{issue.description}</p>
                </div>
              </div>
            </section>

            <section className="wid-card wid-update-card">
              <h3>Assign / Edit</h3>
              <form className="wid-update-form" onSubmit={handleSubmit}>
                <label className="wid-label" htmlFor="workerId">Worker</label>
                <select
                  id="workerId"
                  name="workerId"
                  value={form.workerId}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Select worker</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.username} ({w.email})
                    </option>
                  ))}
                </select>

                <label className="wid-label" htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <label className="wid-label" htmlFor="instructions">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={4}
                  placeholder="Add instructions for the worker"
                  value={form.instructions}
                  onChange={handleChange}
                  disabled={submitting}
                />

                <button type="submit" className="wid-btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      {toast.open && (
        <div className={`wid-toast ${toast.type === 'error' ? 'wid-error' : ''}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default WorkerAssign;
