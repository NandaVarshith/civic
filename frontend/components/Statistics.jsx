import React from 'react'

function Statistics() {
  return (
    <>
                <section className="summary-cards">
                <div className="card">
                    <div className="card-border-left blue"></div>
                    <div className="card-content">
                        <p className="card-title">Total Issues</p>
                        <p className="card-number">1,250</p>
                        <p className="card-subtitle">All time</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left gray"></div>
                    <div className="card-content">
                        <p className="card-title">Pending Issues</p>
                        <p className="card-number">50</p>
                        <p className="card-subtitle">Awaiting action</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left orange"></div>
                    <div className="card-content">
                        <p className="card-title">In Progress</p>
                        <p className="card-number">12</p>
                        <p className="card-subtitle">Currently being worked on</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left green"></div>
                    <div className="card-content">
                        <p className="card-title">Resolved</p>
                        <p className="card-number">1,188</p>
                        <p className="card-subtitle">Completed and closed</p>
                    </div>
                </div>
            </section>
      
    </>
  )
}

export default Statistics
