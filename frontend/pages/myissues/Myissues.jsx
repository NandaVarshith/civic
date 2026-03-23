import React , {useState, useEffect} from 'react'
import './Myissues.css'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import CommonHeader from '../../components/CommonHeader'

function MyIssues({ issues }) {
  const location = useLocation();
  const segment = location.pathname.split('/')[1];
  const roleBase = ['user', 'admin', 'worker'].includes(segment) ? `/${segment}` : '/user';
  const [allIssues, setAllIssues] = useState(issues || []);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');


  useEffect(() => {
    setAllIssues(issues);
    setFilteredIssues(issues);
  }, [issues]);

  useEffect(() => {
      const filtered = allIssues.filter(issue => {
      const titleMatch = issue.title.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategory === '' || issue.category === selectedCategory;
      const statusMatch = selectedStatus === '' || issue.status === selectedStatus;
      return titleMatch && categoryMatch && statusMatch;
    });
    setFilteredIssues(filtered);
  },[allIssues, searchTerm, selectedCategory, selectedStatus]);
  
  const filterByCategory = (category) => {
   const filtered = filteredIssues.filter(issue => category==='' || issue.category === category);
    setFilteredIssues(filtered);
    console.log('Filtered issues by category:', category);
  };
  
  const filterByStatus = (status) => {
    const filtered = filteredIssues.filter(issue => status==='' || issue.status === status);
    setFilteredIssues(filtered);
    console.log('Filtered issues by status:', status);
  };  

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content myissues-content">
          <CommonHeader title="My Issues" />
          <header className="page-header">
            <div className="header-content">
              <p>Track the status of issues you've reported and see updates from the community.</p>
            </div>
            <div className="header-actions">
              {segment === 'user' && <Link to={`${roleBase}/raiseissue`} className="btn-primary">Report New Issue</Link>}
            </div>
          </header>

          <section className="issues-section">
            <section className="filter-controls">
              <div className="filter-group">
                <select defaultValue="" onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="" disabled>Category</option>
                  <option value='Road Damage'>Road Damage</option>
                  <option value='Street Light'>Street Light</option>
                  <option value='Garbage'>Garbage</option>
                  <option value='Water Leakage'>Water Leakage</option>
                  <option value='Drainage'>Drainage</option>
                  <option value='Public Safety'>Public Safety</option>
                  <option value='Other'>Other</option>
                </select>
                <select defaultValue="" onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="" disabled>Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <input type="text" value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issues..." className="search-input" 
              />
            </section>

            <div className="issue-cards-grid">
              {filteredIssues.length >0 &&filteredIssues.map(issue => (
                <div key={issue._id || issue.id} className={`issue-card status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                  <div className="issue-card-header">
                    <span className="issue-card-id">{issue._id || issue.id}</span>
                    <span className={`badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span>
                  </div>
                  <div className="issue-card-body">
                    <h3 className="issue-card-title">{issue.title}</h3>
                  </div>
                  <div className="issue-card-footer">
                      <span className="badge category">{issue.category}</span>
                      <span className="issue-card-date">{issue.createdAt ? new Date(issue.createdAt).toLocaleString() : ''}</span>
                      {segment === 'admin' && (
                        <Link to={`/admin/assign/${issue._id || issue.id}`} className="btn-primary">
                          Assign
                        </Link>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default MyIssues
