import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PublicView from './pages/PublicView';
import PublicViewAll from './pages/PublicViewAll';
import InstallPrompt from './components/InstallPrompt';

const AppContent = () => {
  const location = useLocation();
  const isPublicView = location.pathname.startsWith('/view');

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {!isPublicView && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view/:id" element={<PublicView />} />
          <Route path="/view-all" element={<PublicViewAll />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
      <InstallPrompt />
      
      {/* African pattern footer decoration */}
      <div className="h-2 bg-pattern w-full mt-auto" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
