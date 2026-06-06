import { useEffect, useState } from 'react';
import { getAiHistory } from '../../api/students';
import Loading from '../../components/Loading';

export default function StudentAiHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAiHistory().then((res) => setHistory(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Lịch sử gợi ý AI</h2>
      {loading ? <Loading /> : history.length === 0 ? (
        <p className="empty-state">Chưa có lịch sử phân tích.</p>
      ) : (
        history.map((item) => (
          <div key={item._id} className="history-card">
            <p><strong>{new Date(item.createdAt).toLocaleString('vi-VN')}</strong></p>
            <p className="text-muted">{item.cvText?.slice(0, 120)}...</p>
            <ul>
              {item.suggestedJobs?.map((job) => (
                <li key={job._id}>{job.title} — {job.salary}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
