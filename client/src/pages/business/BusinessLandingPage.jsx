import { Link } from 'react-router-dom';

export default function BusinessLandingPage() {
  return (
    <div className="container section">
      <div className="business-hero">
        <h1>Dành cho Doanh nghiệp</h1>
        <p>Đăng ký công ty, nhận mã kích hoạt và bắt đầu tuyển dụng sinh viên tài năng.</p>
        <div className="quick-actions">
          <Link to="/business/register-company" className="btn btn-primary btn-lg">
            Đăng ký thông tin công ty
          </Link>
          <Link to="/business/register-hr" className="btn btn-outline btn-lg">
            Đăng ký tài khoản nhân viên
          </Link>
          <Link to="/login?type=hr" className="btn btn-ghost btn-lg">
            Đăng nhập HR
          </Link>
        </div>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <strong>1</strong>
          <h3>Đăng ký công ty</h3>
          <p>Điền thông tin doanh nghiệp và gửi yêu cầu phê duyệt.</p>
        </div>
        <div className="step-card">
          <strong>2</strong>
          <h3>Nhận mã công ty</h3>
          <p>Admin phê duyệt và gửi mã kích hoạt qua email.</p>
        </div>
        <div className="step-card">
          <strong>3</strong>
          <h3>Đăng ký nhân viên</h3>
          <p>Nhân viên HR dùng mã công ty để tạo tài khoản và đăng tin.</p>
        </div>
      </div>
    </div>
  );
}
