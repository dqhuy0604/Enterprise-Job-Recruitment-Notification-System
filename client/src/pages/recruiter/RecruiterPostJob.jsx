import { useState } from 'react';
import { createJob } from '../../api/jobs';
import { CITIES, INDUSTRIES } from '../../constants/filters';
import Alert from '../../components/Alert';

const EMPTY = {
  title: '', description: '', requirements: '', benefits: '',
  salary: 'Thỏa thuận', location: 'Hà Nội', industry: 'CNTT',
  type: 'full-time', deadline: '', contactEmail: '', contactPhone: '',
};

export default function RecruiterPostJob() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createJob(form);
      setSuccess(res.message);
      setForm(EMPTY);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Đăng tin tuyển dụng</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <Alert type="success" message={success} />
        <label>Tên công việc<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Mô tả<textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Yêu cầu<textarea required rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
        <label>Quyền lợi<textarea rows={2} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} /></label>
        <div className="form-row">
          <label>Lương<input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></label>
          <label>
            Địa điểm
            <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Ngành
            <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Hình thức
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="full-time">Toàn thời gian</option>
              <option value="part-time">Bán thời gian</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label>Hạn nộp<input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></label>
          <label>Email liên hệ<input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></label>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Đang đăng...' : 'Đăng tin'}
        </button>
      </form>
    </div>
  );
}
