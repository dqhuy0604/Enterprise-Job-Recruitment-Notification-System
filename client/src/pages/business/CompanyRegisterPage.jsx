import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerCompany } from '../../api/companies';
import Alert from '../../components/Alert';

export default function CompanyRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', address: '', logo: '', description: '', contactPhone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerCompany(form);
      setSuccess(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <Link to="/business" className="back-link">← Dành cho Doanh nghiệp</Link>
      <h1 className="page-title">Đăng ký thông tin công ty</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <Alert type="success" message={success} />
        <label>Tên công ty<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email công ty<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Địa chỉ<input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label>URL Logo<input placeholder="https://..." value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} /></label>
        <label>Số điện thoại<input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></label>
        <label>Giới thiệu doanh nghiệp<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
        </button>
      </form>
    </div>
  );
}
