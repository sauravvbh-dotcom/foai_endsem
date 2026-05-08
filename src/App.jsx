import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Chatbot from './chatbot/Chatbot';

function App() {
  const { theme } = useStore();

  useEffect(() => {
    // Apply theme on initial load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
        <Chatbot />
      </DashboardLayout>
    </Router>
  );
}

export default App;
