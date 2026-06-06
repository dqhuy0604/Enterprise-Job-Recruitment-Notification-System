import { useEffect, useState } from 'react';
import { deleteApplication, getApplications, updateApplicationStatus } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'interviewing', label: 'Phỏng vấn' },
  { value: 'passed', label: 'Đạt' },
  { value: 'rejected', label: 'Từ chối' },
];

export default function DashboardApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getApplications()
      .then((res) => setApplications(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải hồ sơ'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa hồ sơ này?')) return;
    try {
      await deleteApplication(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Chỉ Admin mới được xóa hồ sơ');
    }
  };

  return (
    <div>
      <h2>Quản lý hồ sơ ứng tuyển</h2>
      <Alert message={error} />

      {loading ? (
        <Loading />
      ) : applications.length === 0 ? (
        <p className="empty-state">Chưa có hồ sơ nào.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Email</th>
                <th>Vị trí</th>
                <th>CV</th>
                <th>Trạng thái</th>
                {user.role === 'admin' && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.candidateName}</td>
                  <td>{app.candidateEmail}</td>
                  <td>{app.jobId?.title || '—'}</td>
                  <td>
                    <a href={app.cvUrl} target="_blank" rel="noreferrer">Tải CV</a>
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  {user.role === 'admin' && (
                    <td>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(app._id)}>
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
