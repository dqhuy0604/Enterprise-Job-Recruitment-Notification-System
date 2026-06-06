import { NavLink, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="container section">
      <h1 className="page-title">Dashboard HR</h1>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <NavLink to="/dashboard" end> Tổng quan</NavLink>
          <NavLink to="/dashboard/jobs"> Quản lý tin tuyển dụng</NavLink>
          <NavLink to="/dashboard/applications"> Quản lý hồ sơ</NavLink>
        </aside>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
