import { Link } from 'react-router-dom';
import { Package, FileSpreadsheet, FileText } from 'lucide-react';
import { exportService } from '../services/api';

const Navbar = () => {
  return (
    <nav className="bg-pattern text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="bg-white p-1 rounded-lg">
            <img src="/logo.png" alt="SJ Express Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SJ EXPRESS</h1>
            <p className="text-xs text-brand-blue-200">Export Management System</p>
          </div>
        </Link>
        
        <div className="flex space-x-4">
          <a 
            href={exportService.downloadExcel()}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all border border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </a>
          <a 
            href={exportService.downloadPdf()}
            className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-primary font-semibold px-4 py-2 rounded-lg transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Invoice</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
