import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarCheck2, Menu, X, Layout } from 'lucide-react';
import Dropdown_more from './MoreOption';
import Dropdown_product from './ProductOption';
import GlobalSearchModal from '../../features/boards/compontents/GlobalSearchModel';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-blue-50/95 backdrop-blur-md border-b border-blue-100 px-4 md:px-8 py-3.5 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          
          {/* Logo */}
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="flex gap-2.5 items-center hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="text-emerald-600 bg-emerald-100 p-1.5 rounded-lg">
              <CalendarCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
              Task Manager
            </span>
          </Link>

          {/* Desktop Navigation Links (Visible on lg screens and up) */}
          <ul className="hidden lg:flex gap-3 items-center">
            <li>
              <Link 
                className="hover:bg-blue-100 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-colors" 
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                className="hover:bg-blue-100 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium transition-colors" 
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
           
            <li className="relative"><Dropdown_product /></li>
            <li className="relative"><Dropdown_more /></li>
          </ul>

          {/* Desktop Action Icons / Buttons */}
          <div className="hidden lg:flex gap-3 items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="px-3 py-1.5 rounded-lg text-slate-500 bg-white/80 border border-slate-200 hover:border-slate-300 hover:text-slate-800 transition flex items-center gap-2 shadow-2xs"
              title="Global Search"
            >
              <Search size={16} />
              <span className="text-xs text-slate-400">Search...</span>
              <kbd className="hidden xl:inline-block bg-slate-100 text-slate-500 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200">
                ⌘K
              </kbd>
            </button>

            <Link 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg font-medium transition shadow-xs" 
              to="/login"
            >
              Login
            </Link>
            <Link 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg font-medium transition shadow-xs" 
              to="/register"
            >
              Register
            </Link>
          </div>

          {/* Mobile Action Icons & Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="p-2 text-slate-700 hover:bg-blue-100 rounded-lg transition-colors"
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-slate-700 focus:outline-none rounded-lg hover:bg-blue-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-blue-50/98 backdrop-blur-xl flex flex-col gap-4 p-5 border-b border-blue-200 shadow-xl max-h-[calc(100vh-65px)] overflow-y-auto z-50">
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link 
                  onClick={closeMobileMenu} 
                  className="bg-blue-500 text-white py-2.5 rounded-xl block text-center font-medium shadow-xs" 
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  onClick={closeMobileMenu} 
                  className="bg-blue-500 text-white py-2.5 rounded-xl block text-center font-medium shadow-xs" 
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  onClick={closeMobileMenu} 
                  className="bg-indigo-600 text-white py-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-2 shadow-xs" 
                  to="/boards"
                >
                  <Layout size={16} /> Workspace Boards
                </Link>
              </li>
              <li onClick={closeMobileMenu} className="w-full">
                <Dropdown_product />
              </li>
              <li onClick={closeMobileMenu} className="w-full">
                <Dropdown_more />
              </li>
            </ul>

            <div className="flex flex-col gap-2 pt-3 border-t border-blue-200/80">
              <Link 
                onClick={closeMobileMenu} 
                className="bg-blue-600 text-white py-2.5 rounded-xl text-center font-medium shadow-xs" 
                to="/login"
              >
                Login
              </Link>
              <Link 
                onClick={closeMobileMenu} 
                className="bg-emerald-600 text-white py-2.5 rounded-xl text-center font-medium shadow-xs" 
                to="/register"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Overlay Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;