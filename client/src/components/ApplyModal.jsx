import { useState } from 'react';
import { submitApplication } from '../api/applications';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    candidateName: user?.name || '',
    candidateEmail: user?.email || '',
  });
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv) {
      setError('Vui lòng chọn file CV');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', job._id);
    formData.append('candidateName', form.candidateName);
    formData.append('candidateEmail', form.candidateEmail);
    formData.append('cv', cv);

    setLoading(true);
    setError('');
    try {
      const res = await submitApplication(formData);
      onSuccess?.(res.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Ứng tuyển thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="modal-header">
          <h2>Ứng tuyển: {job.title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <Alert message={error} />
          {!isAuthenticated && (
            <p className="text-muted">Bạn có thể ứng tuyển không cần đăng nhập. Đăng nhập để theo dõi trạng thái.</p>
          )}
          <label>
            Họ và tên
            <input
              value={form.candidateName}
              onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.candidateEmail}
              onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })}
              required
            />
          </label>
          <label>
            Tải CV (PDF, DOC, DOCX)
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files[0])} required />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Xác nhận ứng tuyển'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
