import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardProfile from './pages/DashboardProfile';
import PrivateRoute from './routes/PrivateRoute';

import ForgotPassword from './pages/auth/ForgotPassword';
import ResetCode from './pages/auth/ResetCode';
import NewPassword from './pages/auth/NewPassword';

import DashboardStudy from './pages/DashboardStudy';
import NewStudyRouteForm from './pages/NewStudyRouteForm';
import DashboardStudyDetail from './pages/DashboardStudyDetail';
import DashboardEventDetail from './pages/DashboardEventDetail';
import NewEvent from '@/pages/NewEvent';

import DashboardTasks from './pages/DashboardTasks';
import NewTask from './pages/NewTask';
import KanBanTasks from './pages/KanbanTasks';

import DashboardFinance from './pages/DashboardFinance';
import TaskListDetails from '@/pages/TaskListDetails';
import EditTaskList from '@/pages/EditTaskList';
import TaskDetails from '@/pages/TaskDetails';
import EditTask from '@/pages/EditTask';

import SettingsPage from '@/pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import Partnerships from './pages/Partnerships.jsx';
import Solution from '@/pages/Solution';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';

import DashboardChatbot from './pages/DashboardChatbot';
import NewChatSessionForm from './pages/NewChatSessionForm';
import Chatbot from './pages/Chatbot';

import NewGoal from '@/pages/NewGoal';
import NewTransaction from '@/pages/NewTransaction';
import VidaScoreDetails from '@/pages/VidaScoreDetails';
import EditGoal from '@/pages/EditGoal';
import EditTransaction from '@/pages/EditTransaction';
import GoalsPage from '@/pages/GoalsPage';
import GoalDetails from '@/pages/GoalDetails';
import TransactionDetails from '@/pages/TransactionDetails';
import DashboardCommunity from './pages/community/DashboardCommunity';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import Health from './pages/Health.jsx';
import DashboardHealthScore from './pages/DashboardHealthScore.jsx';
import DashboardCheckin from './pages/DashboardCheckin.jsx';
import DashboardWellnessHabit from './pages/DashboardWellnessHabit.jsx';

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ NOVO: Rotas de recuperação de senha */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/new-password" element={<NewPassword />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Route>

      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />

          {/* Estudos */}
          <Route path="/dashboard/study" element={<DashboardStudy />} />
          <Route path="/dashboard/study/new" element={<NewStudyRouteForm />} />
          <Route path="/dashboard/study/:id" element={<DashboardStudyDetail />} />

          {/* Eventos */}
          <Route path="/dashboard/events/new" element={<NewEvent />} />
          <Route path="/dashboard/events/:id" element={<DashboardEventDetail />} />

          {/* Tarefas */}
          <Route path="/dashboard/tasks" element={<DashboardTasks />} />
          <Route path="/dashboard/newtask" element={<NewTask />} />
          <Route path="/dashboard/kanban" element={<KanBanTasks />} />
          <Route path="/dashboard/task-list/:id" element={<TaskListDetails />} />
          <Route path="/dashboard/task-list/edit/:id" element={<EditTaskList />} />
          <Route path="/dashboard/task/:id" element={<TaskDetails />} />
          <Route path="/dashboard/task/edit/:id" element={<EditTask />} />

          {/* Finanças */}
          <Route path="/dashboard/finance" element={<DashboardFinance />} />
          <Route path="/dashboard/finance/new-goal" element={<NewGoal />} />
          <Route path="/dashboard/finance/new-transaction" element={<NewTransaction />} />
          <Route path="/dashboard/finance/vida-score" element={<VidaScoreDetails />} />
          <Route path="/dashboard/finance/goals" element={<GoalsPage />} />
          <Route path="/dashboard/finance/edit-goal/:id" element={<EditGoal />} />
          <Route path="/dashboard/finance/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/dashboard/finance/goal/:id" element={<GoalDetails />} />
          <Route path="/dashboard/finance/transaction/:id" element={<TransactionDetails />} />
          <Route path="/dashboard/finance/incomes" element={<IncomePage />} />
          <Route path="/dashboard/finance/expenses" element={<ExpensePage />} />

          {/* Configurações */}
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Chatbot */}
          <Route path="/dashboard/chatbot" element={<DashboardChatbot />} />
          <Route path="/dashboard/chatbot/new" element={<NewChatSessionForm />} />
          <Route path="/dashboard/chatbot/:id" element={<Chatbot />} />

          {/* Comunidade */}
          <Route path="/dashboard/community" element={<DashboardCommunity />} />

          {/* Saúde - Página geral */}
          <Route path="/dashboard/health" element={<Health />} />

          {/* Dashboards de Saúde - todas dentro do prefixo /dashboard/health */}
          <Route path="/dashboard/health/score" element={<DashboardHealthScore />} />
          <Route path="/dashboard/health/checkin" element={<DashboardCheckin />} />
          <Route path="/dashboard/health/habits" element={<DashboardWellnessHabit />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;