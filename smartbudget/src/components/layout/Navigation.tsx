import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Menu, X } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: List },
];

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === '/' && location.pathname === '/dashboard')
    );
  };

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (isMenuOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen, isMobile]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between md:justify-start h-16">
          {/* Hamburger Menu Button (Mobile) */}
          {isMobile && (
            <button
              onClick={toggleMenu}
              className="p-3 text-gray-700 hover:bg-gray-100 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Mobile: Slide-out Menu */}
          {isMobile && (
            <>
              {/* Backdrop */}
              {isMenuOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={closeMenu}
                />
              )}

              {/* Mobile Menu */}
              <div
                id="mobile-menu"
                ref={menuRef}
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                  isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={closeMenu}
                    className="p-2 text-gray-600 hover:text-gray-900"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                <ul className="flex flex-col">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={closeMenu}
                          className={`flex items-center gap-3 px-6 py-4 min-h-[44px] transition-colors ${
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          {/* Desktop: Horizontal Nav */}
          {!isMobile && (
            <ul className="flex flex-row gap-4 md:gap-4 lg:gap-6">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t ${
                        isActive(item.path)
                          ? 'border-blue-600 text-blue-600 font-semibold'
                          : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
