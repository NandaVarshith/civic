import React, { useState ,useEffect } from 'react'
import axios from 'axios'


function Statistics() {

    const [statistics, setStatistics] = useState({
        totalIssues: 0,
        pendingIssues: 0,
        inProgressIssues: 0,
        resolvedIssues: 0
    });

    const getStatistics= async ()=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/issues/statistics`);
            setStatistics(response.data);

        }
        catch(error){
            console.log("error to get statistics data",error.message);
        }
    };

    useEffect(()=>{
        getStatistics();
    },[]);

  return (
    <>
                <section className="summary-cards">
                <div className="card">
                    <div className="card-border-left blue"></div>
                    <div className="card-content">
                        <p className="card-title">Total Issues</p>
                        <p className="card-number">{statistics.totalIssues}</p>
                        <p className="card-subtitle">All time</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left gray"></div>
                    <div className="card-content">
                        <p className="card-title">Pending Issues</p>
                        <p className="card-number">{statistics.pendingIssues}</p>
                        <p className="card-subtitle">Awaiting action</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left orange"></div>
                    <div className="card-content">
                        <p className="card-title">In Progress</p>
                        <p className="card-number">{statistics.inProgressIssues}</p>
                        <p className="card-subtitle">Currently being worked on</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left green"></div>
                    <div className="card-content">
                        <p className="card-title">Resolved</p>
                        <p className="card-number">{statistics.resolvedIssues}</p>
                        <p className="card-subtitle">Completed and closed</p>
                    </div>
                </div>
            </section>
      
    </>
  )
}

export default Statistics
