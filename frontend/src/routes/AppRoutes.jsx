import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import Login from '../pages/Login.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import Projects from '../pages/Projects.jsx';
import Profile from '../pages/Profile.jsx';
import Reports from '../pages/Reports.jsx';
import Settings from '../pages/Settings.jsx';
import Team from '../pages/Team.jsx';
import Tasks from '../pages/Tasks.jsx';

function ProtectedLayout() {
  const user = localStorage.getItem('taskflow_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
