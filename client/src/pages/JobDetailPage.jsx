import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getJobById } from '../api/jobs';
import { checkSavedJob, toggleSaveJob } from '../api/students';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const TYPE_LABELS = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getJobById(id)
      .then((res) => {
        setJob(res.data);
        if (res.meta && !res.meta.canApply) {
          setError('Tin tuyển dụng đã đóng hoặc quá hạn nộp hồ sơ');
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Không tìm thấy tin'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      checkSavedJob(id).then((res) => setSaved(res.saved)).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const handleSave = async () => {
    if (!isAuthenticated || user?.role !== 'student') {
      setError('Vui lòng đăng nhập tài khoản sinh viên để lưu việc làm');
      return;
    }
    try {
      const res = await toggleSaveJob(id);
      setSaved(res.saved);
      setToast(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu việc làm');
    }
  };

  if (loading) return <Loading />;
  if (error && !job) return <div className="container section"><Alert message={error} /></div>;
  if (!job) return null;

  const company = job.companyId;
  const canApply = job.status === 'active' && (!job.deadline || new Date(job.deadline) >= new Date());

  return (
    <div className="container section">
      <Link to="/jobs" className="back-link">← Quay lại danh sách</Link>
      <Alert type="success" message={toast} />
      <Alert message={error && job ? error : ''} />

      <div className="job-detail">
        <header className="job-detail-header">
          <div className="job-detail-company">
            {company?.logo ? (
              <img src={company.logo} alt="" className="company-logo" />
            ) : (
              <div className="company-logo placeholder">{company?.name?.[0] || 'C'}</div>
            )}
            <div>
              <h1>{job.title}</h1>
              <p className="company-name-lg">{company?.name || 'Doanh nghiệp'}</p>
              <div className="job-meta">
                <span>{job.location}</span>
                <span>{job.industry}</span>
                <span>{TYPE_LABELS[job.type]}</span>
                <span>{job.salary}</span>
                {job.deadline && <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>}
              </div>
            </div>
          </div>
          <div className="job-detail-actions">
            <button type="button" className={`btn ${saved ? 'btn-primary' : 'btn-outline'}`} onClick={handleSave}>
              {saved ? '★ Đã lưu' : '☆ Lưu việc làm'}
            </button>
            {canApply ? (
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setShowApply(true)}>
                Nộp CV / Ứng tuyển
              </button>
            ) : (
              <button type="button" className="btn btn-disabled btn-lg" disabled>Đã ngừng nhận hồ sơ</button>
            )}
          </div>
        </header>

        <section className="detail-block">
          <h2>Mô tả công việc</h2>
          <p className="pre-wrap">{job.description}</p>
        </section>
        <section className="detail-block">
          <h2>Yêu cầu ứng viên</h2>
          <p className="pre-wrap">{job.requirements}</p>
        </section>
        {job.benefits && (
          <section className="detail-block">
            <h2>Quyền lợi & Phúc lợi</h2>
            <p className="pre-wrap">{job.benefits}</p>
          </section>
        )}
        <section className="detail-block">
          <h2>Thông tin liên hệ</h2>
          <p>Email: {job.contactEmail || company?.email || '—'}</p>
          <p>Điện thoại: {job.contactPhone || company?.contactPhone || '—'}</p>
          <p>Địa chỉ: {company?.address || '—'}</p>
        </section>
      </div>

      {showApply && (
        <ApplyModal
          job={job}
          onClose={() => setShowApply(false)}
          onSuccess={(msg) => setToast(msg)}
        />
      )}
    </div>
  );
}
