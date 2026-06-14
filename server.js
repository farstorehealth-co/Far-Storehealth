const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const auditRoutes = require('./routes/audit');
const authRoutes = require('./routes/auth');
const monitoringRoutes = require('./routes/monitoring');

app.use('/api/audits', auditRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Dashboard route with real data
app.get('/dashboard', (req, res) => {
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>24/7 QA Team Dashboard</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const Dashboard = () => {
      const [shop, setShop] = React.useState('mystore.myshopify.com');
      const [alerts, setAlerts] = React.useState({});
      const [dashboard, setDashboard] = React.useState(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState(null);

      const apiBase = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://far-storehealth.vercel.app';

      const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            apiBase + '/api/monitoring/dashboard?shop=' + encodeURIComponent(shop)
          );
          const data = await response.json();
          setDashboard(data.data);
        } catch (err) {
          setError('Failed to fetch dashboard: ' + err.message);
        }
        setLoading(false);
      };

      const fetchAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            apiBase + '/api/monitoring/alerts',
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
          setAlerts(data.alerts || {});
        } catch (err) {
          setError('Failed to fetch alerts: ' + err.message);
        }
        setLoading(false);
      };

      React.useEffect(() => {
        if (shop) {
          fetchDashboard();
        }
      }, [shop]);

      return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
          <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>🚀 24/7 Automated QA Team</h1>
            <p style={{ margin: '0', color: '#aaa', fontSize: '16px' }}>Real-time Store Health Monitoring Dashboard</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                placeholder="Enter shop domain"
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
              <button onClick={() => fetchDashboard()} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Reload</button>
              <button onClick={() => fetchAlerts()} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Get Alerts</button>
            </div>
          </div>

          {loading && <div style={{ backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', color: '#004085', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>Loading...</div>}
          {error && <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>Error: {error}</div>}

          {dashboard && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>UPTIME</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{dashboard.current_status.uptime}</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>RESPONSE TIME</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>{dashboard.current_status.avg_response_time}</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>CONVERSION RATE</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8' }}>{dashboard.current_status.conversion_rate}</div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>CRITICAL ISSUES</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>{dashboard.current_status.critical_issues}</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Today's Metrics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  <div style={{ borderLeft: '4px solid #007bff', paddingLeft: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>SCANS</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.scans_completed}</div>
                  </div>
                  <div style={{ borderLeft: '4px solid #ffc107', paddingLeft: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>ISSUES</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.issues_detected}</div>
                  </div>
                  <div style={{ borderLeft: '4px solid #28a745', paddingLeft: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>FIXED</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboard.today_metrics.issues_auto_fixed}</div>
                  </div>
                  <div style={{ borderLeft: '4px solid #17a2b8', paddingLeft: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>REVENUE PROTECTED</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{'$' + dashboard.today_metrics.revenue_protected}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            <p>24/7 Automated QA Team Dashboard</p>
          </div>
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Dashboard />);
  </script>
</body>
</html>
  `;
  res.send(dashboardHTML);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    message: 'Store Health Audit API is running'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    app: 'Store Health Audit - 24/7 QA Team',
    version: '1.0.0',
    dashboard: '/dashboard'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Store Health Audit API running on port ' + PORT);
  console.log('Dashboard: http://localhost:' + PORT + '/dashboard');
});

module.exports = app;
