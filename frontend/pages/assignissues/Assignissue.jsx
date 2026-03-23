import React, { useMemo, useState } from 'react';
import './Assignissue.css';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';

const statusOptions = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const priorityOptions = ['Low', 'Medium', 'High'];

const mockIssues = [
  {
    id: 'ISS-3012',
    title: 'Streetlight outage near MG Road',
    category: 'Street Light',
    priority: 'High',
    status: 'Pending',
    area: 'MG Road',
    reportedBy: 'Aarav',
    createdAt: '2026-03-01T10:30:00.000Z',
    description: 'Three consecutive poles are not working near the bus stop.',
  },
  {
    id: 'ISS-3013',
    title: 'Water leakage from main pipeline',
    category: 'Water Leakage',
    priority: 'Medium',
    status: 'Pending',
    area: 'BTM Layout',
    reportedBy: 'Nisha',
    createdAt: '2026-03-02T08:15:00.000Z',
    description: 'Water has been leaking since last night and flooding the road edge.',
  },
  {
    id: 'ISS-3014',
    title: 'Garbage overflow near market lane',
    category: 'Garbage',
    priority: 'Low',
    status: 'Assigned',
    area: 'Jayanagar',
    reportedBy: 'Rohit',
    createdAt: '2026-03-02T14:45:00.000Z',
    description: 'Bins are overflowing and waste is scattered around the corner.',
  },
];

function Assignissue() {
  const [issues] = useState(mockIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [selectedIssueId, setSelectedIssueId] = useState(mockIssues[0]?.id || '');

  const [assignForm, setAssignForm] = useState({
    assigneeId: '',
    team: '',
    dueDate: '',
    priority: '',
    note: '',
  });

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchStatus = selectedStatus ? issue.status === selectedStatus : true;
      const q = searchTerm.trim().toLowerCase();
      const matchQuery =
        q.length === 0 ||
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.area.toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [issues, selectedStatus, searchTerm]);

  const selectedIssue = useMemo(() => {
    return issues.find((issue) => issue.id === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    // Placeholder: integrate API call in your next step.
    console.log('Assign payload:', {
      issueId: selectedIssue.id,
      ...assignForm,
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content assign-page">
        <CommonHeader title="Assign Issues" />

        <section className="assign-layout">
          <div className="queue-panel card">
            <div className="panel-header">
              <h3>Issue Queue</h3>
              <p>Pick an issue and assign it to a worker or team.</p>
            </div>

            <div className="queue-filters">
              <input
                type="text"
                placeholder="Search by id, title, or area"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="queue-list">
              {filteredIssues.length === 0 && <p className="empty-state">No issues match current filters.</p>}

              {filteredIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  className={`queue-item ${selectedIssueId === issue.id ? 'active' : ''}`}
                  onClick={() => setSelectedIssueId(issue.id)}
                >
                  <div className="queue-top">
                    <span className="issue-id">{issue.id}</span>
                    <span className={`status-pill status-${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {issue.status}
                    </span>
                  </div>
                  <h4>{issue.title}</h4>
                  <p>{issue.area}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="assign-panel card">
            <div className="panel-header">
              <h3>Assignment Details</h3>
              <p>Review selected issue and fill assignment info.</p>
            </div>

            {!selectedIssue && <p className="empty-state">Select an issue from the queue.</p>}

            {selectedIssue && (
              <>
                <div className="issue-summary">
                  <div>
                    <span>Issue ID</span>
                    <p>{selectedIssue.id}</p>
                  </div>
                  <div>
                    <span>Category</span>
                    <p>{selectedIssue.category}</p>
                  </div>
                  <div>
                    <span>Reported By</span>
                    <p>{selectedIssue.reportedBy}</p>
                  </div>
                  <div>
                    <span>Priority</span>
                    <p>{selectedIssue.priority}</p>
                  </div>
                  <div className="summary-full">
                    <span>Description</span>
                    <p>{selectedIssue.description}</p>
                  </div>
                </div>

                <form className="assign-form" onSubmit={handleAssignSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="assigneeId">Assignee ID</label>
                      <input
                        id="assigneeId"
                        name="assigneeId"
                        type="text"
                        placeholder="e.g., WRK-102"
                        value={assignForm.assigneeId}
                        onChange={handleAssignChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="team">Team</label>
                      <input
                        id="team"
                        name="team"
                        type="text"
                        placeholder="e.g., Zone-A Ops"
                        value={assignForm.team}
                        onChange={handleAssignChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dueDate">Due Date</label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={assignForm.dueDate}
                        onChange={handleAssignChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="priority">Set Priority</label>
                      <select
                        id="priority"
                        name="priority"
                        value={assignForm.priority}
                        onChange={handleAssignChange}
                      >
                        <option value="">Keep original</option>
                        {priorityOptions.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="note">Assignment Note</label>
                      <textarea
                        id="note"
                        name="note"
                        rows={4}
                        placeholder="Instructions for assigned worker/team"
                        value={assignForm.note}
                        onChange={handleAssignChange}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="assign-btn">
                      Assign Issue
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Assignissue;
