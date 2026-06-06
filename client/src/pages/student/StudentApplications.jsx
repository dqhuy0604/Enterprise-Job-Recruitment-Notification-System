import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/students';
import { STATUS_LABELS } from '../../constants/filters';
import Loading from '../../components/Loading';

export default function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then((res) => setApps(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Quản lý ứng tuyển</h2>
      {loading ? <Loading /> : apps.length === 0 ? (
        <p className="empty-state">Chưa nộp hồ sơ nào. <Link to="/jobs">Tìm việc ngay</Link></p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Công việc</th><th>Công ty</th><th>Ngày nộp</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app._id}>
                  <td>{app.jobId?.title}</td>
                  <td>{app.jobId?.companyId?.name || '—'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>{STATUS_LABELS[app.status] || app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
