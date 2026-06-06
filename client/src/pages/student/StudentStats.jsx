import { useEffect, useState } from 'react';
import { getApplicationStats } from '../../api/students';
import Loading from '../../components/Loading';

export default function StudentStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicationStats().then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Thống kê ứng tuyển</h2>
      <div className="stat-tile" style={{ maxWidth: 200 }}>
        <strong>{stats?.total || 0}</strong>
        <span>Tổng hồ sơ đã nộp</span>
      </div>
      <h3>Theo tháng</h3>
      <div className="chart-bars">
        {(stats?.byMonth || []).map((item) => (
          <div key={item.month} className="chart-bar-item">
            <div className="chart-bar" style={{ height: `${Math.max(item.count * 20, 8)}px` }} />
            <span>{item.month}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
