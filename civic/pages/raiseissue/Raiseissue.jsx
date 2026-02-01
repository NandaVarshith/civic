import React from 'react'
import './Raiseissue.css'
import { Link } from 'react-router-dom'
import Sidebar from '../../componenets/Sidebar'

function Raiseissue() {
  return (
    <>
        <div className="dashboard-container">
        
        <Sidebar /> 

        
        <main className="main-content">
            <div id="multiStepForm" className="form-container">
                <div className="form-header">
                    <h2>Report a New Civic Issue</h2>
                    <p>Your detailed report helps us assign and resolve issues faster.</p>
                </div>

                <div className="progress-bar">
                    <div className="progress-line"></div>
                    <div className="progress-step active" data-step="1">
                        <div className="step-icon">1</div>
                        <div className="step-label">Details</div>
                    </div>
                    <div className="progress-step" data-step="2">
                        <div className="step-icon">2</div>
                        <div className="step-label">Location & Image</div>
                    </div>
                    <div className="progress-step" data-step="3">
                        <div className="step-icon">3</div>
                        <div className="step-label">Confirmation</div>
                    </div>
                </div>
                
                <form action="#" method="POST" className="issue-form">
                    
                    <div className="form-step active" data-step="1">
                        <div className="form-group" style={{marginBottom: '20px'}}>
                            <label htmlFor="issue-title">Issue Title <span className="required-star">*</span></label>
                            <input type="text" id="issue-title" name="issue-title" placeholder="e.g., Broken streetlight on Main St" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="issue-category">Issue Category <span className="required-star">*</span></label>
                                <select id="issue-category" name="issue-category" required>
                                    <option value="" disabled selected>Select a category</option>
                                    <option value="garbage">Garbage</option>
                                    <option value="road-damage">Road Damage</option>
                                    <option value="street-light">Street Light</option>
                                    <option value="water-leakage">Water Leakage</option>
                                    <option value="drainage">Drainage</option>
                                    <option value="public-safety">Public Safety</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group" style={{marginBottom: '20px'}}>
                            <label htmlFor="description">Description <span className="required-star">*</span></label>
                            <textarea id="description" name="description" placeholder="Provide as much detail as possible." required></textarea>
                        </div>
                    </div>

                   
                    <div className="form-step" data-step="2">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="location">Location / Address <span className="required-star">*</span></label>
                                <input type="text" id="location" name="location" placeholder="Enter address or cross-streets" required />
                            </div>
                        </div>

                        <div className="form-row">
                             <div className="form-group">
                                <label htmlFor="image-upload">Upload Image</label>
                                <div className="upload-area">
                                    <span>📤</span>
                                    <p>Click or drag image to upload</p>
                                </div>
                                <div className="image-preview">Preview</div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="form-step" data-step="3">
                        <div className="confirmation">
                            <h3>Review Your Report</h3>
                            <p><strong>Title:</strong> <span id="confirm-title"></span></p>
                            <p><strong>Category:</strong> <span id="confirm-category"></span></p>
                            <p><strong>Description:</strong> <span id="confirm-description"></span></p>
                            <p><strong>Location:</strong> <span id="confirm-location"></span></p>
                            <div className="form-group">
                                <label htmlFor="contact-phone">Contact Phone</label>
                                <input type="tel" id="contact-phone" name="contact-phone" placeholder="Optional: For follow-up questions"/>
                            </div>
                        </div>
                    </div>


                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary prev-step">Previous</button>
                        <button type="button" className="btn btn-primary next-step">Next</button>
                        <button type="submit" className="btn btn-primary submit-btn" style={{display: 'none'}}>Submit Issue</button>
                    </div>
                </form>
            </div>
        </main>
    </div>
    </>
  )
}

export default Raiseissue
