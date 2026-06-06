import { useState } from 'react';
import { changePassword, updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';

export default function StudentSettings() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profile);
      const token = localStorage.getItem('token');
      login(token, res.data);
      setSuccess(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(passwords);
      setSuccess(res.message);
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div>
      <h2>Cài đặt tài khoản</h2>
      <Alert message={error} />
      <Alert type="success" message={success} />
      <form className="form-card" onSubmit={saveProfile}>
        <h3>Thông tin cá nhân</h3>
        <label>Họ tên<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
        <label>Số điện thoại<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary btn-sm">Lưu thông tin</button>
      </form>
      <form className="form-card" onSubmit={savePassword}>
        <h3>Đổi mật khẩu</h3>
        <label>Mật khẩu hiện tại<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label>
        <label>Mật khẩu mới<input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label>
        <button type="submit" className="btn btn-outline btn-sm">Đổi mật khẩu</button>
      </form>
    </div>
  );
}
