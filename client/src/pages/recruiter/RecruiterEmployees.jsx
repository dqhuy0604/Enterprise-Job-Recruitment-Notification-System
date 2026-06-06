import { useEffect, useState } from 'react';
import { createEmployee, deactivateEmployee } from '../../api/auth';
import { getCompanyEmployees } from '../../api/companies';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function RecruiterEmployees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    getCompanyEmployees().then((res) => setEmployees(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createEmployee(form);
      setSuccess(res.message);
      setForm({ name: '', email: '', password: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo nhân viên thất bại');
    }
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <form className="form-card" onSubmit={handleCreate}>
        <h3>Thêm nhân viên mới</h3>
        <Alert message={error} />
        <Alert type="success" message={success} />
        <label>Họ tên<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Mật khẩu<input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary btn-sm">Thêm nhân viên</button>
      </form>
      {loading ? <Loading /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Tên</th><th>Email</th><th>Thao tác</th></tr></thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        if (!window.confirm(`Vô hiệu hóa ${e.name}?`)) return;
                        await deactivateEmployee(e._id);
                        load();
                      }}
                    >
                      Vô hiệu hóa
                    </button>
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
