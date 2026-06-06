import { useEffect, useState } from 'react';
import { getApplications, updateApplicationStatus } from '../../api/applications';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function RecruiterApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    getApplications()
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div>
      <h2>Danh sách ứng viên</h2>
      <Alert message={error} />
      {loading ? <Loading /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Ứng viên</th><th>Vị trí</th><th>CV</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app._id}>
                  <td><div>{app.candidateName}</div><small>{app.candidateEmail}</small></td>
                  <td>{app.jobId?.title}</td>
                  <td><a href={app.cvUrl} target="_blank" rel="noreferrer">Xem CV</a></td>
                  <td>{app.status}</td>
                  <td className="table-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(app._id, 'passed')}>Phê duyệt</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setStatus(app._id, 'rejected')}>Từ chối</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
