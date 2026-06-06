import { Link } from 'react-router-dom';

export default function StudentHome() {
  return (
    <div>
      <h2>Chào mừng bạn!</h2>
      <p className="text-muted">Tìm việc, lưu tin yêu thích, ứng tuyển và theo dõi trạng thái hồ sơ.</p>
      <div className="quick-actions">
        <Link to="/jobs" className="btn btn-primary">Tìm việc làm</Link>
        <Link to="/student/ai" className="btn btn-outline">Gợi ý việc làm bằng AI</Link>
        <Link to="/student/applications" className="btn btn-ghost">Xem hồ sơ đã nộp</Link>
      </div>
    </div>
  );
}
