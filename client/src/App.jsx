import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import BusinessLandingPage from './pages/business/BusinessLandingPage';
import CompanyRegisterPage from './pages/business/CompanyRegisterPage';
import HrRegisterPage from './pages/business/HrRegisterPage';
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import RecruiterHome from './pages/recruiter/RecruiterHome';
import RecruiterPostJob from './pages/recruiter/RecruiterPostJob';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterEditJob from './pages/recruiter/RecruiterEditJob';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';
import RecruiterStats from './pages/recruiter/RecruiterStats';
import RecruiterCompany from './pages/recruiter/RecruiterCompany';
import RecruiterEmployees from './pages/recruiter/RecruiterEmployees';
import StudentLayout from './pages/student/StudentLayout';
import StudentHome from './pages/student/StudentHome';
import StudentSaved from './pages/student/StudentSaved';
import StudentApplications from './pages/student/StudentApplications';
import StudentAi from './pages/student/StudentAi';
import StudentAiHistory from './pages/student/StudentAiHistory';
import StudentStats from './pages/student/StudentStats';
import StudentSettings from './pages/student/StudentSettings';
import AdminCompanies from './pages/admin/AdminCompanies';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register/student" element={<StudentRegisterPage />} />
            <Route path="business" element={<BusinessLandingPage />} />
            <Route path="business/register-company" element={<CompanyRegisterPage />} />
            <Route path="business/register-hr" element={<HrRegisterPage />} />

            <Route path="recruiter" element={<ProtectedRoute roles={['hr', 'admin']}><RecruiterLayout /></ProtectedRoute>}>
              <Route index element={<RecruiterHome />} />
              <Route path="post-job" element={<RecruiterPostJob />} />
              <Route path="jobs" element={<RecruiterJobs />} />
              <Route path="jobs/:id/edit" element={<RecruiterEditJob />} />
              <Route path="applications" element={<RecruiterApplications />} />
              <Route path="stats" element={<RecruiterStats />} />
              <Route path="company" element={<RecruiterCompany />} />
              <Route path="employees" element={<RecruiterEmployees />} />
            </Route>

            <Route path="student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<StudentHome />} />
              <Route path="saved" element={<StudentSaved />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="ai" element={<StudentAi />} />
              <Route path="ai-history" element={<StudentAiHistory />} />
              <Route path="stats" element={<StudentStats />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminCompanies /></ProtectedRoute>} />
            <Route path="403" element={<ForbiddenPage />} />
            <Route path="dashboard/*" element={<Navigate to="/recruiter" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
