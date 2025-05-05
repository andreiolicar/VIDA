import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardProfile from './pages/DashboardProfile';
import PrivateRoute from './routes/PrivateRoute';
import DashboardStudy from './pages/DashboardStudy';
import NewStudyRouteForm from './pages/NewStudyRouteForm';
import DashboardStudyDetail from './pages/DashboardStudyDetail';
import DashboardEventDetail from './pages/DashboardEventDetail';
import NewEvent from '@/pages/NewEvent';
import DashboardTasks from './pages/DashboardTasks';
import DashboardFinance from './pages/DashboardFinance';

function App() {
  return (
    <Routes>
      {/*Público*/}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404</h1>}></Route>
        <Route path="/register" element={<Register />} />
      </Route>

      {/*Privado*/}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/tasks" element={<DashboardTasks />} />
          <Route path="/dashboard/finance" element={<DashboardFinance />} />

          {/* Novas rotas para Trilhas de Estudos */}
          <Route path="/dashboard/study" element={<DashboardStudy />} />
          <Route path="/dashboard/study/new" element={<NewStudyRouteForm />} />
          <Route path="/dashboard/study/:id" element={<DashboardStudyDetail />} />
          <Route path="/dashboard/events/new" element={<NewEvent />} />
          <Route path="/dashboard/events/:id" element={<DashboardEventDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
