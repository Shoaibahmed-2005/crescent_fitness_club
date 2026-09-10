import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Founders from './pages/Founders';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="events/:id/register" element={<Registration />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="founders" element={<Founders />} />
            <Route path="*" element={<Home />} /> {/* Fallback route for missing about/contact pages in demo */}
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
