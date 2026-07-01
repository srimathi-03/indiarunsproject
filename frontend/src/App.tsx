import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Toast from './components/ui/Toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RankingResults from './pages/RankingResults';
import CandidateDetail from './pages/CandidateDetail';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><RankingResults /></ProtectedRoute>} />
            <Route path="/candidate/:id" element={<ProtectedRoute><CandidateDetail /></ProtectedRoute>} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Toast />
    </div>
  );
};

export default App;
