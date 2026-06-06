import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/student', end: true, label: 'Tổng quan' },
  { to: '/student/saved', label: 'Việc làm đã lưu' },
  { to: '/student/applications', label: 'Quản lý ứng tuyển' },
  { to: '/student/ai', label: 'Gợi ý việc làm AI' },
  { to: '/student/ai-history', label: 'Lịch sử gợi ý' },
  { to: '/student/stats', label: 'Thống kê ứng tuyển' },
  { to: '/student/settings', label: 'Cài đặt tài khoản' },
];

export default function StudentLayout() {
  return (
    <div className="container section">
      <h1 className="page-title">Không gian Sinh viên</h1>
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
