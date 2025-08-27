  // src/components/Navbar.jsx - Enhanced versions

  import React, { useState, useEffect } from 'react';
  import { Link, NavLink, useNavigate } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import ThemeToggle from './ThemeToggle';

  const Navbar = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Function to check and update auth state
    const checkAuthState = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    useEffect(() => {
      // Initial check
      checkAuthState();

      // Listen for storage changes (when localStorage is updated)
      const handleStorageChange = (e) => {
        if (e.key === 'token' || e.key === 'user') {
          checkAuthState();
        }
      };

      // Listen for custom auth events (we'll dispatch these from login/logout)
      const handleAuthChange = () => {
        checkAuthState();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('authStateChanged', handleAuthChange);

      // Cleanup listeners
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authStateChanged', handleAuthChange);
      };
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authStateChanged'));
      
      toast.info('You have been logged out.');
      navigate('/login');
      setIsOpen(false);
    };

    // OPTION 1: More transparent with better contrast for galaxy background
    const linkClassName = ({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-blue-600/80 text-white shadow-lg backdrop-blur-sm'
          : 'text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-white/10' 
      }`;
      
    const mobileLinkClassName = ({ isActive }) =>
      `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600/80 text-white shadow-lg backdrop-blur-sm' 
          : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`;

    return (
      // OPTION 1: More transparent navbar perfect for galaxy background
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand Name */}
            <div className="flex-shrink-0">
              <Link 
                to={isLoggedIn ? "/dashboard" : "/"} 
                className="text-white font-bold text-xl drop-shadow-2xl hover:text-blue-200 transition-colors duration-300"
              >
                TaskMaster
              </Link>
            </div>

            {/* Desktop Menu Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                  <ThemeToggle />
                </div>
                {isLoggedIn && user ? (
                  <>
                    <span className="text-white/80 text-sm drop-shadow-lg bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      Welcome, {user?.firstName}!
                    </span>
                    <NavLink to="/dashboard" className={linkClassName}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/tasks" className={linkClassName}>
                      All Tasks
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="text-white/90 hover:bg-red-500/20 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-red-400/30"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={linkClassName}>
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700/90 hover:to-indigo-700/90 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:bg-white/10 focus:outline-none backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (collapsible) */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/30 backdrop-blur-xl border-t border-white/10">
            {isLoggedIn ? (
              <>
                <NavLink to="/dashboard" className={mobileLinkClassName} onClick={() => setIsOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/tasks" className={mobileLinkClassName} onClick={() => setIsOpen(false)}>
                  All Tasks
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-red-500/20 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileLinkClassName} onClick={() => setIsOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={mobileLinkClassName} onClick={() => setIsOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
            <div className="border-t border-white/20 mt-3 pt-3">
              <div className="flex items-center justify-between px-3">
                <span className="font-medium text-white/90 drop-shadow-lg">Switch Theme</span>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // ALTERNATIVE OPTION 2: If you want to keep more of your original styling but enhance it
  const NavbarOption2 = () => {
    // ... same logic as above ...
    
    return (
      <nav className="sticky top-0 z-50 bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl shadow-2xl border-b border-white/20 dark:border-gray-400/20">
        {/* Same content but with enhanced transparency */}
      </nav>
    );
  };

  // ALTERNATIVE OPTION 3: Completely transparent navbar (for homepage only)
  const TransparentNavbar = () => {
    // ... same logic as above ...
    
    return (
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        {/* Completely transparent for landing page */}
      </nav>
    );
  };

  export default Navbar;