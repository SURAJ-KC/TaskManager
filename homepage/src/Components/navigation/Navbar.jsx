import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, CalendarCheck2, Menu, X, Layout } from 'lucide-react';
import Dropdown_more from './MoreOption';
import Dropdown_product from './ProductOption';
import GlobalSearchModal from '../../features/boards/compontents/GlobalSearchModel';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="flex bg-blue-50 justify-between items-center px-4 md:px-8 py-4 text-xs relative shadow-sm">
        
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-center hover:opacity-90 transition-opacity">
          <h1 className="text-green-500"><CalendarCheck2 /></h1>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Task Manager</h1>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <Link className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition" to="/dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition" to="/boards">
              <Layout size={14} /> Workspace Boards
            </Link>
          </li>
          <li><Dropdown_product /></li>
          <li><Dropdown_more /></li>
        </ul>

        {/* Desktop Action Icons / Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-blue-100 transition flex items-center gap-1"
            title="Global Search"
          >
            <Search size={18} />
          </button>
          <Link className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition" to="/login">
            Login
          </Link>
          <Link className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-medium transition" to="/register">
            Register
          </Link>
        </div>

        {/* Mobile Action Icons & Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="p-1.5 text-slate-700 hover:bg-blue-100 rounded-lg transition"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-slate-700 focus:outline-none p-1 rounded-lg hover:bg-blue-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-50 flex flex-col gap-4 p-6 border-t border-blue-200 md:hidden z-50 shadow-lg">
            <ul className="flex flex-col gap-3">
              <li>
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className="bg-blue-500 text-white py-2 rounded-lg block text-center font-medium" 
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className="bg-blue-500 text-white py-2 rounded-lg block text-center font-medium" 
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  onClick={() => setIsOpen(false)} 
                  className="bg-indigo-600 text-white py-2 rounded-lg text-center font-medium flex items-center justify-center gap-1.5" 
                  to="/boards"
                >
                  <Layout size={14} /> Workspace Boards
                </Link>
              </li>
              <li><Dropdown_product /></li>
              <li><Dropdown_more /></li>
            </ul>

            <div className="flex flex-col gap-2 pt-3 border-t border-blue-200">
              <Link 
                onClick={() => setIsOpen(false)} 
                className="bg-blue-500 text-white py-2 rounded-lg text-center font-medium" 
                to="/login"
              >
                Login
              </Link>
              <Link 
                onClick={() => setIsOpen(false)} 
                className="bg-emerald-600 text-white py-2 rounded-lg text-center font-medium" 
                to="/register"
              >
                Register
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Global Search Overlay Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;