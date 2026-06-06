import { useState } from 'react';
import { analyzeCv } from '../../api/students';
import JobCard from '../../components/JobCard';
import Alert from '../../components/Alert';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function StudentAi() {
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError('File quá lớn! Giới hạn 2MB để bảo vệ hệ thống và tiết kiệm tài nguyên xử lý.');
      e.target.value = '';
      return;
    }
    setCvFile(file);
    setError('');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!cvFile && !cvText.trim()) {
      setError('Vui lòng upload CV hoặc dán nội dung text');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await analyzeCv({ cvFile, cvText });
      setSuggestions(res.data.suggestions);
      setDetectedSkills(res.data.detectedSkills || []);
      setMeta({
        truncated: res.data.truncated,
        originalLength: res.data.originalLength,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Phân tích thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Gợi ý việc làm bằng AI</h2>
      <p className="text-muted">
        Upload CV (PDF, DOCX — tối đa 2MB) hoặc dán nội dung. Hệ thống trích xuất text và đối sánh kỹ năng với tin tuyển dụng.
      </p>
      <form className="form-card" onSubmit={handleAnalyze}>
        <Alert message={error} />
        <label>
          Upload file CV
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} />
        </label>
        {cvFile && <p className="text-muted">Đã chọn: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)</p>}
        <label>
          Hoặc dán nội dung CV
          <textarea
            rows={6}
            placeholder="Kỹ năng, kinh nghiệm, dự án..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang phân tích...' : 'Phân tích CV'}
        </button>
      </form>

      {meta?.truncated && (
        <Alert type="success" message={`Nội dung CV đã được cắt còn 8000 ký tự (gốc: ${meta.originalLength}) để tối ưu xử lý.`} />
      )}

      {detectedSkills.length > 0 && (
        <div className="skills-tags">
          <strong>Kỹ năng phát hiện:</strong>
          {detectedSkills.map((s) => (
            <span key={s} className="badge badge-active">{s}</span>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <>
          <h3>Việc làm phù hợp ({suggestions.length})</h3>
          <div className="job-grid">{suggestions.map((job) => <JobCard key={job._id} job={job} />)}</div>
        </>
      )}
    </div>
  );
}
