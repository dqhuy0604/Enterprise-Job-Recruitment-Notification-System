import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob } from '../../api/jobs';
import { CITIES, INDUSTRIES } from '../../constants/filters';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function RecruiterEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJobById(id).then((res) => {
      const j = res.data;
      setForm({
        title: j.title, description: j.description, requirements: j.requirements,
        benefits: j.benefits || '', salary: j.salary, location: j.location,
        industry: j.industry || 'CNTT', type: j.type,
        deadline: j.deadline ? j.deadline.slice(0, 10) : '',
        contactEmail: j.contactEmail || '', contactPhone: j.contactPhone || '',
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateJob(id, form);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <Loading />;

  return (
    <div>
      <Link to="/recruiter/jobs" className="back-link">← Quay lại</Link>
      <h2>Chỉnh sửa tin tuyển dụng</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <label>Tên công việc<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Mô tả<textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Yêu cầu<textarea required rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
        <label>Quyền lợi<textarea rows={2} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} /></label>
        <div className="form-row">
          <label>Lương<input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></label>
          <label>Địa điểm<select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Ngành<select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </form>
    </div>
  );
}
