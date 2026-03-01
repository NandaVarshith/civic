import React, { useMemo, useState } from 'react';
import './Raiseissue.css';
import Sidebar from '../../components/Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import CommonHeader from '../../components/CommonHeader';
import axios from 'axios';



function Raiseissue() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    remarks: '',
    images: [],
  });

  const summaryText = useMemo(
    () => ({
      title: formData.title || 'Not provided',
      category: formData.category || 'Not selected',
      priority: formData.priority || 'Not selected',
      address: formData.address || 'Not provided',
      description: formData.description || 'Not provided',
      images: formData.images.length,
    }),
    [formData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.priority || !formData.description || !formData.address) {
      toast.error('Please fill out all required fields.');
      return;
    }

    let base64Images = [];
    if (formData.images.length > 0) {
      try {
        base64Images = await Promise.all(formData.images.map((file) => fileToBase64(file)));
      } catch (conversionError) {
        console.error('Image conversion failed:', conversionError);
        toast.error('Failed to process selected images.');
        return;
      }
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      description: formData.description,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      remarks: formData.remarks,
      images: base64Images,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/issues`, payload, { withCredentials: true });
      console.log(response);
      toast.success('Issue submitted successfully!');
    }
    catch (error){
      console.error('Error submitting issue:', error);
      toast.error('An error occurred while submitting the issue. Please try again.');
    }
    
  };

  return (
    <>
      <div className="dashboard-container">
        <Toaster />
        <Sidebar />
        <main className="main-content raiseissue-content">
          <CommonHeader title="Raise Issue" />

          <section className="raiseissue-layout">
            <form onSubmit={handleSubmit} className="form-container">
              <header className="form-header">
                <h3>Report Civic Issue</h3>
                <p>Provide clear details so your issue can be prioritized and assigned quickly.</p>
              </header>

              <div className="form-section">
                <h4>Issue Details</h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="title">Title <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="e.g., Streetlight not working near Pine St"
                      required
                      maxLength={120}
                      onChange={handleChange}
                      value={formData.title}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category <span className="required-star">*</span></label>
                    <select id="category" name="category" required onChange={handleChange} value={formData.category}>
                      <option value="" disabled>Select a category</option>
                      <option value="Road Damage">Road Damage</option>
                      <option value="Street Light">Street Light</option>
                      <option value="Water Leakage">Water Leakage</option>
                      <option value="Drainage">Drainage</option>
                      <option value="Garbage">Garbage</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority <span className="required-star">*</span></label>
                    <select id="priority" name="priority" required onChange={handleChange} value={formData.priority}>
                      <option value="" disabled>Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Description <span className="required-star">*</span></label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the issue, impact, and nearby landmarks."
                      required
                      rows={5}
                      maxLength={500}
                      onChange={handleChange}
                      value={formData.description}
                    />
                    <span className="helper-text">{formData.description.length}/500</span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Location</h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Address <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="House no, street, area, city"
                      required
                      onChange={handleChange}
                      value={formData.address}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="latitude"
                      placeholder="e.g., 40.7128"
                      onChange={handleChange}
                      value={formData.latitude}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="longitude"
                      placeholder="e.g., -74.0060"
                      onChange={handleChange}
                      value={formData.longitude}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Attachments and Remarks</h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="image-upload">Images</label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <span className="helper-text">
                      {formData.images.length > 0 ? `${formData.images.length} image(s) selected` : 'PNG, JPG, JPEG up to 5 files'}
                    </span>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="remarks">Additional Remarks</label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      placeholder="Add any optional notes for the assigned team."
                      rows={3}
                      onChange={handleChange}
                      value={formData.remarks}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Issue</button>
              </div>
            </form>

            <aside className="review-panel">
              <h4>Submission Preview</h4>
              <div className="review-item">
                <span>Title</span>
                <p>{summaryText.title}</p>
              </div>
              <div className="review-item">
                <span>Category</span>
                <p>{summaryText.category}</p>
              </div>
              <div className="review-item">
                <span>Priority</span>
                <p>{summaryText.priority}</p>
              </div>
              <div className="review-item">
                <span>Address</span>
                <p>{summaryText.address}</p>
              </div>
              <div className="review-item">
                <span>Description</span>
                <p>{summaryText.description}</p>
              </div>
              <div className="review-item">
                <span>Images</span>
                <p>{summaryText.images}</p>
              </div>
              <div className="note-box">
                <p>System-managed fields like status, assignment, and timestamps are added after submission.</p>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
}

export default Raiseissue;
