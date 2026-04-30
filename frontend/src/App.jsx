import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <Dashboard />
      </main>
      <Toaster position="bottom-right" />
      
      {/* African pattern footer decoration */}
      <div className="h-2 bg-pattern w-full mt-auto" />
    </div>
  );
}

export default App;
