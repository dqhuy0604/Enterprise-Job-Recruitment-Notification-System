import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { submitApplication } from '../api/applications';
import Alert from '../components/Alert';

export default function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ candidateName: '', candidateEmail: '' });
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!cv) {
      setError('Vui lòng chọn file CV (PDF, DOC, DOCX)');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('candidateName', form.candidateName);
    formData.append('candidateEmail', form.candidateEmail);
    formData.append('cv', cv);

    setLoading(true);
    try {
      const res = await submitApplication(formData);
      setSuccess(res.message);
      setTimeout(() => navigate(`/jobs/${id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Nộp hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <Link to={`/jobs/${id}`} className="back-link">← Quay lại chi tiết tin</Link>
      <h1 className="page-title">Nộp hồ sơ ứng tuyển</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <Alert message={error} />
        <Alert type="success" message={success} />

        <label>
          Họ và tên
          <input
            name="candidateName"
            value={form.candidateName}
            onChange={handleChange}
            required
            minLength={2}
          />
        </label>

        <label>
          Email
          <input
            name="candidateEmail"
            type="email"
            value={form.candidateEmail}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          File CV (PDF, DOC, DOCX — tối đa 5MB)
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files[0])}
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi hồ sơ'}
        </button>
      </form>
    </div>
  );
}
