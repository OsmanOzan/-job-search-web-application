import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import JobSearch from './JobSearch';
import JobDetail from './JobDetail';
import Header from './Header';
import Profile from './Profile';
import CompanyPanel from './CompanyPanel';
import AdminPanel from './AdminPanel';
import AIAgentChat from './AIAgentChat';
import { SnackbarProvider, useSnackbar } from './SnackbarContext';
import { setApiSnackbar } from './api';

function App() {
  const showSnackbar = useSnackbar();
  useEffect(() => {
    setApiSnackbar(showSnackbar);
  }, [showSnackbar]);

  return (
    <SnackbarProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/company" element={<CompanyPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/ai-agent" element={<AIAgentChat />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
