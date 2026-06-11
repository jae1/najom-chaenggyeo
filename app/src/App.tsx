import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Today from './pages/Today';
import History from './pages/History';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="px-4 pb-20">
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
