import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [shop, setShop] = useState('mystore.myshopify.com');
  const [alerts, setAlerts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://far-storehealth.vercel.app/api/monitoring/dashboard?shop=${shop}`
      );
      const data = await response.json();
      setDashboard(data.data);
    } catch (err) {
      setError('Failed to fetch dashboard: ' + err.message);
    }
    setLoading(false);
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://far-storehealth.vercel.app/api/monitoring/alerts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shopDomain: shop,
            storeData: {
              trackingIds: { ga4: 'G-123', meta: '123' },
              topPages: [{ url: 'https://demo.com/products/shirt', ranking: 1 }],
              currentConversion: { rate: 2.1, daily_revenue: 8000 },
              recentImages: [{ size_mb: 3.5 }],
              pageCount: 247,
              monthlyAdSpend: 4200,
              sslInfo: { expires_in_days: 45, expires_date: '2026-07-29' }
            }
          })
        }
      );
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (err) {
      setError('Failed to fetch alerts: ' + err.message);
    }
    setLoading(false);
  };

  // Auto-fetch on load
  useEffect(() => {
    fetchDashboard();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '🚨';
      case 'HIGH':
        return '⚠️';
      case 'MEDIUM':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>24/7 Automated QA Team</h1>
        <p style={{ margin: '0', color: '#aaa', fontSize: '16px' }}>Real-time Store Health Monitoring</p>
      </div>

      {/* Shop Input */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="Enter shop domain"
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={fetchDashboard}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Load Dashboard
          </button>
          <button
            onClick={fetchAlerts}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Get Alerts
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', color: '#004085', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          ⏳ Loading...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {/* Dashboard Stats */}
      {dashboard && (
        <>
          {/* Current Status Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {/* Uptime */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>UPTIME</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
                {dashboard.current_status.uptime}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>99%+ is healthy</div>
            </div>

            {/* Response Time */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>AVG RESPONSE TIME</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                {dashboard.current_status.avg_response_time}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>Lower is better</div>
            </div>

            {/* Conversion Rate */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>CONVERSION RATE</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8' }}>
                {dashboard.current_status.conversion_rate}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>Target: 2.5%+</div>
            </div>

            {/* Critical Issues */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>CRITICAL ISSUES</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>
                {dashboard.current_status.critical_issues}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>Needs immediate action</div>
            </div>
          </div>

          {/* Today's Metrics */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>📊 Today's Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ borderLeft: '4px solid #007bff', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>SCANS COMPLETED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.scans_completed}</div>
              </div>
              <div style={{ borderLeft: '4px solid #ffc107', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>ISSUES DETECTED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.issues_detected}</div>
              </div>
              <div style={{ borderLeft: '4px solid #28a745', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>ISSUES FIXED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.issues_auto_fixed}</div>
              </div>
              <div style={{ borderLeft: '4px solid #17a2b8', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>REVENUE PROTECTED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${dashboard.today_metrics.revenue_protected}</div>
              </div>
            </div>
          </div>

          {/* This Hour Metrics */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>⏰ This Hour</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ borderLeft: '4px solid #28a745', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>UPTIME</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{dashboard.this_hour_metrics.uptime}</div>
              </div>
              <div style={{ borderLeft: '4px solid #ffc107', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>BROKEN LINKS</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.this_hour_metrics.broken_links_detected}</div>
              </div>
              <div style={{ borderLeft: '4px solid #17a2b8', paddingLeft: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>LOSSES PREVENTED</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${dashboard.this_hour_metrics.estimated_losses_prevented}</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '10px', marginBottom: '30px' }}>
            💡 <strong>Recommendation:</strong> {dashboard.recommendation}
          </div>
        </>
      )}

      {/* Alerts Section */}
      {Object.keys(alerts).length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>🚨 Real-Time Alerts</h2>

          {/* Critical Alerts */}
          {alerts.critical && alerts.critical.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc3545', marginBottom: '15px' }}>
                🚨 CRITICAL ({alerts.critical.length})
              </h3>
              {alerts.critical.map((alert, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '15px', borderRadius: '5px', marginBottom: '10px', borderLeft: '4px solid #dc3545' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#721c24', marginBottom: '8px' }}>
                    🚨 {alert.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#721c24', marginBottom: '8px' }}>
                    {alert.message}
                  </div>
                  {alert.revenue_impact && (
                    <div style={{ fontSize: '13px', color: '#721c24', fontWeight: 'bold', marginBottom: '8px' }}>
                      💰 Revenue Impact: ${alert.revenue_impact}/hour
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#721c24' }}>
                    <strong>Action:</strong> {alert.action}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* High Alerts */}
          {alerts.high && alerts.high.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b', marginBottom: '15px' }}>
                ⚠️ HIGH ({alerts.high.length})
              </h3>
              {alerts.high.map((alert, idx) => (
                <div key={idx} style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '5px', marginBottom: '10px', borderLeft: '4px solid #ffc107' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404', marginBottom: '8px' }}>
                    ⚠️ {alert.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#856404', marginBottom: '8px' }}>
                    {alert.message}
                  </div>
                  {alert.revenue_impact && (
                    <div style={{ fontSize: '13px', color: '#856404', fontWeight: 'bold', marginBottom: '8px' }}>
                      💰 Revenue Impact: ${alert.revenue_impact}/hour
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Medium Alerts */}
          {alerts.medium && alerts.medium.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffc107', marginBottom: '15px' }}>
                ⚡ MEDIUM ({alerts.medium.length})
              </h3>
              {alerts.medium.map((alert, idx) => (
                <div key={idx} style={{ backgroundColor: '#e2e3e5', border: '1px solid #d6d8db', padding: '15px', borderRadius: '5px', marginBottom: '10px', borderLeft: '4px solid #6c757d' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#383d41', marginBottom: '8px' }}>
                    ⚡ {alert.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#383d41' }}>
                    {alert.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <p>24/7 Automated QA Team • Real-time Monitoring • Auto-fixes • Revenue Protection</p>
        <p>Last Updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
