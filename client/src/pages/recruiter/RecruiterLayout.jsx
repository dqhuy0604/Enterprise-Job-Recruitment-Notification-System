import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/recruiter', end: true, label: 'Tổng quan' },
  { to: '/recruiter/post-job', label: 'Đăng tin tuyển dụng' },
  { to: '/recruiter/jobs', label: 'Quản lý tin tuyển dụng' },
  { to: '/recruiter/applications', label: 'Danh sách ứng viên' },
  { to: '/recruiter/stats', label: 'Thống kê' },
  { to: '/recruiter/company', label: 'Thông tin công ty' },
  { to: '/recruiter/employees', label: 'Quản lý nhân viên' },
];

export default function RecruiterLayout() {
  return (
    <div className="container section">
      <h1 className="page-title">Dashboard Doanh nghiệp</h1>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </aside>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
