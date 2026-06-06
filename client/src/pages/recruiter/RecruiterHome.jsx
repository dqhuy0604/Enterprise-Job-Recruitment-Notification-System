import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyStats } from '../../api/companies';
import Loading from '../../components/Loading';

export default function RecruiterHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Tổng quan</h2>
      <div className="stats-grid">
        <div className="stat-tile"><strong>{stats?.totalJobs || 0}</strong><span>Tin tuyển dụng</span></div>
        <div className="stat-tile"><strong>{stats?.totalApplications || 0}</strong><span>CV nhận được</span></div>
        <div className="stat-tile"><strong>{stats?.byStatus?.pending || 0}</strong><span>Chờ duyệt</span></div>
      </div>
      <div className="quick-actions">
        <Link to="/recruiter/post-job" className="btn btn-primary">Đăng tin mới</Link>
        <Link to="/recruiter/applications" className="btn btn-outline">Xem ứng viên</Link>
      </div>
    </div>
  );
}
