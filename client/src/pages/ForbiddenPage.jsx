import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="container section narrow error-page">
      <h1>403 — Không có quyền truy cập</h1>
      <p className="text-muted">Bạn không được phép xem trang này với vai trò hiện tại.</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
}
