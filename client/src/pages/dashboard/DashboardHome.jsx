import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import { getApplications } from '../../api/applications';
import Loading from '../../components/Loading';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getJobs({ status: 'all', limit: 1 }),
      getApplications(),
    ])
      .then(([jobsRes, appsRes]) => {
        setStats({
          totalJobs: jobsRes.pagination?.totalItems || 0,
          totalApplications: appsRes.count || 0,
          pending: appsRes.data?.filter((a) => a.status === 'pending').length || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Tổng quan</h2>
      <div className="stats-grid">
        <div className="stat-tile">
          <strong>{stats.totalJobs}</strong>
          <span>Tin tuyển dụng</span>
        </div>
        <div className="stat-tile">
          <strong>{stats.totalApplications}</strong>
          <span>Hồ sơ ứng tuyển</span>
        </div>
        <div className="stat-tile">
          <strong>{stats.pending}</strong>
          <span>Chờ duyệt</span>
        </div>
      </div>
      <div className="quick-actions">
        <Link to="/dashboard/jobs" className="btn btn-primary">Quản lý tin tuyển dụng</Link>
        <Link to="/dashboard/applications" className="btn btn-outline">Xem hồ sơ mới</Link>
      </div>
    </div>
  );
}
