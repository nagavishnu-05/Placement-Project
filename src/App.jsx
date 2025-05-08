import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
