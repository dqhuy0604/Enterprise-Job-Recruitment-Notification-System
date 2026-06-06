import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, updateJobStatus } from '../../api/jobs';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getJobs({ status: 'all', mine: 'true', limit: 50 })
      .then((res) => setJobs(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id, status) => {
    const next = status === 'active' ? 'closed' : 'active';
    try {
      await updateJobStatus(id, next);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div>
      <h2>Quản lý tin tuyển dụng</h2>
      <Alert message={error} />
      {loading ? <Loading /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Tiêu đề</th><th>Địa điểm</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td><span className={`badge ${job.status === 'active' ? 'badge-active' : 'badge-closed'}`}>{job.status === 'active' ? 'Đang hiển thị' : 'Đã tắt'}</span></td>
                  <td className="table-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(job._id, job.status)}>
                      {job.status === 'active' ? 'Tắt tin' : 'Bật tin'}
                    </button>
                    <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-outline btn-sm">✎ Sửa</Link>
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
