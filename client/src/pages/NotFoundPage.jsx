import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container section narrow error-page">
      <h1>404 — Không tìm thấy trang</h1>
      <p className="text-muted">Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
}
