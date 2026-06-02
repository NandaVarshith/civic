import React, { useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Analytics.css';
import Sidebar from '../../components/Sidebar.jsx';
import CommonHeader from '../../components/CommonHeader.jsx';
import Statistics from '../../components/Statistics.jsx';

const STATUS_ORDER = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const CATEGORY_ORDER = [
  'Road Damage',
  'Street Light',
  'Water Leakage',
  'Drainage',
  'Garbage',
  'Public Safety',
  'Other',
];
const DEFAULT_CENTER = [20.5937, 78.9629];
const STATUS_COLORS = {
  Pending: '#64748b',
  Assigned: '#2563eb',
  'In Progress': '#f59e0b',
  Resolved: '#16a34a',
  Closed: '#334155',
};

const getStatusClass = (status) => status.toLowerCase().replace(/\s+/g, '-');

const formatMonth = (date) =>
  date.toLocaleDateString('en-IN', {
    month: 'short',
  });

const buildTrend = (issues) => {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentMonth);
    date.setMonth(currentMonth.getMonth() - (5 - index));
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: formatMonth(date),
      count: 0,
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));

  issues.forEach((issue) => {
    const createdAt = new Date(issue.createdAt);
    if (Number.isNaN(createdAt.getTime())) return;

    const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
    const month = monthMap.get(key);
    if (month) {
      month.count += 1;
    }
  });

  return months;
};

const buildLinePoints = (trend, width = 520, height = 190, padding = 24) => {
  const maxCount = Math.max(...trend.map((day) => day.count), 1);
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return trend.map((day, index) => {
    const x = padding + (trend.length === 1 ? usableWidth : (index / (trend.length - 1)) * usableWidth);
    const y = padding + usableHeight - (day.count / maxCount) * usableHeight;
    return { ...day, x, y };
  });
};

function Analytics({ issues = [] }) {
  const analytics = useMemo(() => {
    const safeIssues = Array.isArray(issues) ? issues : [];

    const statusCounts = STATUS_ORDER.map((status) => ({
      status,
      count: safeIssues.filter((issue) => issue.status === status).length,
    }));

    const categoryCounts = CATEGORY_ORDER.map((category) => ({
      category,
      count: safeIssues.filter((issue) => issue.category === category).length,
    })).filter((item) => item.count > 0);

    const trend = buildTrend(safeIssues);
    const trendPoints = buildLinePoints(trend);

    const mappedIssues = safeIssues.filter((issue) => {
      const lat = Number(issue?.location?.latitude);
      const lng = Number(issue?.location?.longitude);
      return Number.isFinite(lat) && Number.isFinite(lng);
    });

    const mapCenter = mappedIssues.length > 0
      ? [Number(mappedIssues[0].location.latitude), Number(mappedIssues[0].location.longitude)]
      : DEFAULT_CENTER;

    return {
      total: safeIssues.length,
      statusCounts,
      categoryCounts,
      trend,
      trendPoints,
      mappedIssues,
      mapCenter,
      maxCategory: Math.max(...categoryCounts.map((item) => item.count), 1),
    };
  }, [issues]);

  const linePath = analytics.trendPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = analytics.trendPoints.length
    ? `M ${analytics.trendPoints[0].x},190 L ${linePath} L ${analytics.trendPoints.at(-1).x},190 Z`
    : '';

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <CommonHeader title="Analytics" />

        <div className="analytics-container">
          <Statistics issues={issues} />

          <div className="analytics-grid">
            <section className="analytics-card">
              <div className="analytics-card-header">
                <h4>Issue Status Breakdown</h4>
                <span>{analytics.total} total</span>
              </div>

              <div className="status-stack" aria-label="Issue status distribution">
                {analytics.statusCounts.map((item) => {
                  const width = analytics.total ? `${(item.count / analytics.total) * 100}%` : '0%';
                  return (
                    <div
                      key={item.status}
                      className={`status-stack-segment ${getStatusClass(item.status)}`}
                      style={{ width }}
                      title={`${item.status}: ${item.count}`}
                    />
                  );
                })}
              </div>

              <div className="status-list">
                {analytics.statusCounts.map((item) => (
                  <div className="status-row" key={item.status}>
                    <span className={`status-dot ${getStatusClass(item.status)}`} />
                    <span>{item.status}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="analytics-card">
              <div className="analytics-card-header">
                <h4>Issues By Category</h4>
                <span>{analytics.categoryCounts.length} active categories</span>
              </div>

              <div className="category-bars">
                {analytics.categoryCounts.length === 0 ? (
                  <div className="empty-state">No category data available</div>
                ) : (
                  analytics.categoryCounts.map((item) => (
                    <div className="category-row" key={item.category}>
                      <div className="category-label">
                        <span>{item.category}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <div className="category-track">
                        <div
                          className="category-fill"
                          style={{ width: `${(item.count / analytics.maxCategory) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="analytics-card analytics-card-wide">
              <div className="analytics-card-header">
                <h4>Issue Trend Over Time</h4>
                <span>Last 6 months</span>
              </div>

              <div className="trend-chart">
                <svg viewBox="0 0 520 220" role="img" aria-label="Issues reported over the last six months">
                  <path className="trend-area" d={areaPath} />
                  <polyline className="trend-line" points={linePath} />
                  {analytics.trendPoints.map((point) => (
                    <g key={point.key}>
                      <circle className="trend-point" cx={point.x} cy={point.y} r="4" />
                      <text className="trend-value" x={point.x} y={point.y - 10}>
                        {point.count}
                      </text>
                      <text className="trend-label" x={point.x} y="214">
                        {point.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </section>

            <section className="analytics-card analytics-card-wide">
              <div className="analytics-card-header">
                <h4>Location Hotspots</h4>
                <span>{analytics.mappedIssues.length} mapped issues</span>
              </div>

              <div className="analytics-map">
                <MapContainer
                  center={analytics.mapCenter}
                  zoom={analytics.mappedIssues.length > 0 ? 11 : 5}
                  scrollWheelZoom
                  className="analytics-leaflet-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {analytics.mappedIssues.map((issue) => {
                    const color = STATUS_COLORS[issue.status] || '#475569';
                    return (
                      <CircleMarker
                        key={issue._id}
                        center={[Number(issue.location.latitude), Number(issue.location.longitude)]}
                        radius={8}
                        pathOptions={{
                          color: '#ffffff',
                          fillColor: color,
                          fillOpacity: 0.85,
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <strong>{issue.title}</strong>
                          <br />
                          {issue.category}
                          <br />
                          Status: {issue.status}
                          <br />
                          {issue.location?.address}
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;
