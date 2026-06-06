import { useEffect, useState } from 'react';
import { getCompanyStats } from '../../api/companies';
import Loading from '../../components/Loading';

export default function RecruiterStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyStats().then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Thống kê doanh nghiệp</h2>
      <div className="stats-grid">
        <div className="stat-tile"><strong>{stats?.totalApplications || 0}</strong><span>Tổng CV</span></div>
        <div className="stat-tile"><strong>{stats?.byStatus?.passed || 0}</strong><span>Đã chấp nhận</span></div>
        <div className="stat-tile"><strong>{stats?.byStatus?.rejected || 0}</strong><span>Đã từ chối</span></div>
      </div>
      <h3>CV theo tháng</h3>
      <div className="chart-bars">
        {(stats?.byMonth || []).map((item) => (
          <div key={item.month} className="chart-bar-item">
            <div className="chart-bar" style={{ height: `${Math.max(item.count * 20, 8)}px` }} />
            <span>{item.month}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
        {(!stats?.byMonth || stats.byMonth.length === 0) && <p className="text-muted">Chưa có dữ liệu</p>}
      </div>
    </div>
  );
}
