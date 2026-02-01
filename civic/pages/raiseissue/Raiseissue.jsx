import React, { useState, useEffect } from 'react';
import './Raiseissue.css';
import Sidebar from '../../components/Sidebar';
import toast, { Toaster } from 'react-hot-toast';

function Raiseissue() {
  const [formData, setFormData] = useState({
    issueTitle: '',
    issueCategory: '',
    description: '',
    location: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // This will run when the component mounts and whenever formData changes
    // It can be used to update the "Review Your Report" section dynamically
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.issueTitle || !formData.issueCategory || !formData.description || !formData.location) {
      toast.error('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Issue submitted successfully!');
  };

  return (
    <>
      <div className="dashboard-container">
        <Toaster />
        <Sidebar />
        <main className="main-content">
          <div className="form-container">
            <header className="form-header">
              <h2>Report a New Civic Issue</h2>
              <p>Your detailed report helps us assign and resolve issues faster.</p>
            </header>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label htmlFor="issue-title">Issue Title <span className="required-star">*</span></label>
                <input
                  type="text"
                  id="issue-title"
                  name="issueTitle"
                  placeholder="e.g., Broken streetlight on Main St"
                  required
                  onChange={handleChange}
                  value={formData.issueTitle}
                />
              </div>

              <div className="form-group">
                <label htmlFor="issue-category">Issue Category <span className="required-star">*</span></label>
                <select
                  id="issue-category"
                  name="issueCategory"
                  required
                  onChange={handleChange}
                  value={formData.issueCategory}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Street Light">Street Light</option>
                  <option value="Water Leakage">Water Leakage</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description <span className="required-star">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Provide as much detail as possible."
                  required
                  onChange={handleChange}
                  value={formData.description}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location / Address <span className="required-star">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter address or cross-streets"
                  required
                  onChange={handleChange}
                  value={formData.location}
                />
              </div>

              <div className="form-group">
                <label htmlFor="image-upload">Upload Image</label>
                <div className="upload-area">
                  <span>📤</span>
                  <p>Click or drag image to upload</p>
                </div>
                <div className="image-preview">Preview</div>
              </div>

              <div className="confirmation-box">
                <h3>Review Your Report</h3>
                <p><strong>Title:</strong> {formData.issueTitle || '[Dynamic Title]'}</p>
                <p><strong>Category:</strong> {formData.issueCategory || '[Dynamic Category]'}</p>
                <p><strong>Description:</strong> {formData.description || '[Dynamic Description]'}</p>
                <p><strong>Location:</strong> {formData.location || '[Dynamic Location]'}</p>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Issue</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default Raiseissue;
