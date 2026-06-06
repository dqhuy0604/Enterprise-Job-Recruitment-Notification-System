import { useEffect, useState } from 'react';
import { approveCompany, getPendingCompanies, rejectCompany } from '../../api/companies';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    getPendingCompanies().then((res) => setCompanies(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    const res = await approveCompany(id);
    setMessage(res.message);
    load();
  };

  const handleReject = async (id) => {
    await rejectCompany(id);
    load();
  };

  return (
    <div className="container section">
      <h1 className="page-title">Admin — Phê duyệt công ty</h1>
      <Alert type="success" message={message} />
      {loading ? <Loading /> : companies.length === 0 ? (
        <p className="empty-state">Không có công ty chờ duyệt.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Công ty</th><th>Email</th><th>Địa chỉ</th><th>Thao tác</th></tr></thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.address}</td>
                  <td className="table-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleApprove(c._id)}>Duyệt</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleReject(c._id)}>Từ chối</button>
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
