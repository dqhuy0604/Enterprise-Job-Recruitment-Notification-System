import { useEffect, useState } from 'react';
import { getMyCompany, updateMyCompany } from '../../api/companies';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function RecruiterCompany() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getMyCompany().then((res) => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMyCompany(form);
      setSuccess(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (!form) return <Loading />;

  return (
    <div>
      <h2>Thông tin công ty</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <Alert type="success" message={success} />
        <label>Tên công ty<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Địa chỉ<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label>Logo URL<input value={form.logo || ''} onChange={(e) => setForm({ ...form, logo: e.target.value })} /></label>
        <label>Điện thoại<input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></label>
        <label>Giới thiệu<textarea rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary">Sửa thông tin công ty</button>
      </form>
    </div>
  );
}
