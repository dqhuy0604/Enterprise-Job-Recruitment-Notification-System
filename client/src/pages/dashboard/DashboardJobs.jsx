import { useEffect, useState } from 'react';
import { createJob, deleteJob, getJobs, updateJobStatus } from '../../api/jobs';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

const EMPTY_FORM = {
  title: '',
  description: '',
  requirements: '',
  benefits: '',
  salary: 'Thỏa thuận',
  location: 'Hà Nội',
  type: 'full-time',
};

export default function DashboardJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const loadJobs = () => {
    setLoading(true);
    getJobs({ status: 'all', limit: 50 })
      .then((res) => setJobs(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createJob(form);
      setSuccess('Tạo tin tuyển dụng thành công!');
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo tin thất bại');
    }
  };

  const toggleStatus = async (id, current) => {
    const status = current === 'active' ? 'closed' : 'active';
    try {
      await updateJobStatus(id, status);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa tin tuyển dụng này?')) return;
    try {
      await deleteJob(id);
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Chỉ Admin mới được xóa tin');
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Quản lý tin tuyển dụng</h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng form' : '+ Tạo tin mới'}
        </button>
      </div>

      <Alert message={error} />
      <Alert type="success" message={success} />

      {showForm && (
        <form className="form-card" onSubmit={handleCreate}>
          <label>Tiêu đề<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Mô tả<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} /></label>
          <label>Yêu cầu<textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} required rows={3} /></label>
          <label>Quyền lợi<textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={2} /></label>
          <div className="form-row">
            <label>Lương<input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></label>
            <label>Địa điểm<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label>
              Hình thức
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="full-time">Toàn thời gian</option>
                <option value="part-time">Bán thời gian</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Tạo tin</button>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>
                    <span className={`badge ${job.status === 'active' ? 'badge-active' : 'badge-closed'}`}>
                      {job.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleStatus(job._id, job.status)}>
                      {job.status === 'active' ? 'Đóng tin' : 'Mở lại'}
                    </button>
                    {user.role === 'admin' && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>
                        Xóa
                      </button>
                    )}
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
