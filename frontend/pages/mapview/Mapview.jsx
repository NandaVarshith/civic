import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapview.css';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';

const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;
const statusStyles = {
  Pending: { fillColor: '#f59e0b', color: '#ffffff' },
  Assigned: { fillColor: '#2563eb', color: '#ffffff' },
  'In Progress': { fillColor: '#ea580c', color: '#ffffff' },
  Resolved: { fillColor: '#16a34a', color: '#ffffff' },
  Closed: { fillColor: '#334155', color: '#ffffff' },
};

function Mapview() {
  const [issues, setIssues] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/issues`, {
          withCredentials: true,
        });
        const payload = Array.isArray(response.data) ? response.data : [];
        setIssues(payload);
      } catch (error) {
        console.error('Error loading map issues:', error);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const validMapIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const lat = Number(issue?.location?.latitude);
        const lng = Number(issue?.location?.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng);
      }),
    [issues]
  );

  const categories = useMemo(() => {
    const all = validMapIssues.map((issue) => issue.category).filter(Boolean);
    return ['All', ...new Set(all)];
  }, [validMapIssues]);

  const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  const filteredIssues = useMemo(
    () =>
      validMapIssues.filter((issue) => {
        const statusMatch = selectedStatus === 'All' || issue.status === selectedStatus;
        const categoryMatch = selectedCategory === 'All' || issue.category === selectedCategory;
        return statusMatch && categoryMatch;
      }),
    [validMapIssues, selectedStatus, selectedCategory]
  );

  const center = useMemo(() => {
    if (filteredIssues.length > 0) {
      const first = filteredIssues[0];
      return [Number(first.location.latitude), Number(first.location.longitude)];
    }
    if (validMapIssues.length > 0) {
      const first = validMapIssues[0];
      return [Number(first.location.latitude), Number(first.location.longitude)];
    }
    return DEFAULT_CENTER;
  }, [filteredIssues, validMapIssues]);

  const legendItems = [
    { label: 'Pending', color: '#f59e0b' },
    { label: 'Assigned', color: '#2563eb' },
    { label: 'In Progress', color: '#ea580c' },
    { label: 'Resolved', color: '#16a34a' },
    { label: 'Closed', color: '#334155' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <CommonHeader title="Map View" />
        <section className="map-view-container">
          <div className="map-card">
            <div className="map-filters">
              <div className="filter-group">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="category-filter">Category</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="map-wrapper">
              {loading ? (
                <div className="map-empty">Loading map data...</div>
              ) : (
                <MapContainer
                  center={center}
                  zoom={DEFAULT_ZOOM}
                  scrollWheelZoom
                  wheelDebounceTime={120}
                  wheelPxPerZoomLevel={180}
                  className="leaflet-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredIssues.map((issue) => {
                    const markerStyle = statusStyles[issue.status] || { fillColor: '#475569', color: '#ffffff' };
                    return (
                    <CircleMarker
                      key={issue._id}
                      center={[Number(issue.location.latitude), Number(issue.location.longitude)]}
                      radius={6}
                      pathOptions={{
                        color: markerStyle.color,
                        fillColor: markerStyle.fillColor,
                        fillOpacity: 0.9,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <strong>{issue.title}</strong>
                        <br />
                        Status: {issue.status}
                        <br />
                        Category: {issue.category}
                        <br />
                        Address: {issue.location?.address || 'N/A'}
                      </Popup>
                    </CircleMarker>
                  )})}
                </MapContainer>
              )}
            </div>

            <div className="map-legend">
              <h4>Legend</h4>
              <ul>
                {legendItems.map((item) => (
                  <li key={item.label}>
                    <span className="map-legend-dot" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="map-count">Showing {filteredIssues.length} mapped issues</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Mapview;
