import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PublicView from './pages/PublicView';
import PublicViewAll from './pages/PublicViewAll';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
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
    </Router>
  );
}

export default App;
