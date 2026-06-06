import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') === 'hr' ? 'hr' : 'student';
  const [userType, setUserType] = useState(defaultType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (role === 'student') navigate('/student');
    else if (role === 'admin') navigate('/admin');
    else navigate('/recruiter');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      if (userType === 'student' && res.data.role !== 'student') {
        setError('Tài khoản này không phải sinh viên');
        return;
      }
      if (userType === 'hr' && !['hr', 'admin'].includes(res.data.role)) {
        setError('Tài khoản này không phải nhân viên doanh nghiệp');
        return;
      }
      login(res.token, res.data);
      redirectByRole(res.data.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <div className="form-card auth-card">
        <h1>Đăng nhập</h1>
        <div className="tab-row">
          <button type="button" className={userType === 'student' ? 'tab active' : 'tab'} onClick={() => setUserType('student')}>
            Sinh viên
          </button>
          <button type="button" className={userType === 'hr' ? 'tab active' : 'tab'} onClick={() => setUserType('hr')}>
            Doanh nghiệp
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Alert message={error} />
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Mật khẩu<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-muted">
          Chưa có tài khoản?{' '}
          {userType === 'student' ? (
            <Link to="/register/student">Đăng ký sinh viên</Link>
          ) : (
            <Link to="/business">Đăng ký doanh nghiệp</Link>
          )}
        </p>
      </div>
    </div>
  );
}
