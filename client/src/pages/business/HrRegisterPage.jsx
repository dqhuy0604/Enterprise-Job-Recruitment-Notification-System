import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerHr } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

export default function HrRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', companyCode: '', phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerHr(form);
      login(res.token, res.data);
      navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <Link to="/business" className="back-link">← Dành cho Doanh nghiệp</Link>
      <h1 className="page-title">Đăng ký tài khoản nhân viên</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <label>Họ và tên<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email cá nhân<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Mật khẩu<input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Mã công ty (bắt buộc)<input required placeholder="COMP-XXXXXX" value={form.companyCode} onChange={(e) => setForm({ ...form, companyCode: e.target.value })} /></label>
        <label>Số điện thoại<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}
