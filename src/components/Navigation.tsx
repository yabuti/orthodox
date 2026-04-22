import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';
import AuthService from '../services/auth';

interface NavigationProps {
  language: 'en' | 'am';
  minimal?: boolean; // For auth pages - show only logo and language
}

const Navigation: React.FC<NavigationProps> = ({ language, minimal = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = (key: string) => getTranslation(language, key);
  const isLoggedIn = AuthService.isLoggedIn();
  const user = AuthService.getUser();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'am' : 'en';
    const currentPath = location.pathname.replace(`/${language}`, '');
    window.location.href = `/${newLanguage}${currentPath}`;
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate(`/${language}/login`);
    window.location.reload();
  };

  const navItems = [
    { key: 'home', path: `/${language}` },
    { key: 'about', path: `/${language}/about` },
    { key: 'register', path: `/${language}/register` },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          {/* Logo */}
          <Link to={isLoggedIn ? `/${language}` : `/${language}/login`} className="navbar-brand">
            <img src="/logo.webp" alt="EOTC Logo" style={{ height: '45px', width: 'auto' }} />
            <div className={language === 'am' ? 'amharic' : ''}>
              <h1 className="text-xl font-bold text-gray-800">
                {language === 'am' ? 'ኢ.ኦ.ተ.ቤ.ክ' : 'EOTC'}
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {/* Show nav items only if not minimal */}
            {!minimal && navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`${location.pathname === item.path ? 'active' : ''} ${language === 'am' ? 'amharic' : ''}`}
              >
                {t(item.key)}
              </Link>
            ))}
            
            {/* Auth Buttons - only show if not minimal */}
            {!minimal && isLoggedIn && (
              <>
                <button onClick={handleLogout} className="btn btn-gray" style={{ padding: '0.5rem 1rem' }}>
                  {language === 'am' ? 'ውጣ' : 'Logout'}
                </button>
                <Link to={`/${language}/profile`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', color: '#1e3a5f', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', border: '2px solid #1e3a5f' }}>
                  {getInitials(user?.fullName || user?.full_name || '')}
                </Link>
              </>
            )}
            
            {/* Language Toggle - always show (only one) */}
            <button onClick={toggleLanguage} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }}>
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
          </div>

          {/* Mobile Menu Button - hide if minimal */}
          {!minimal && (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Navigation - hide if minimal */}
        {!minimal && (
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <Link key={item.key} to={item.path} onClick={() => setIsMenuOpen(false)}
                className={`${location.pathname === item.path ? 'active' : ''} ${language === 'am' ? 'amharic' : ''}`}>
                {t(item.key)}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                <Link to={`/${language}/profile`} onClick={() => setIsMenuOpen(false)} className="btn btn-primary mt-2">
                  {language === 'am' ? 'መገለጫ' : 'Profile'}
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn btn-gray mt-2">
                  {language === 'am' ? 'ውጣ' : 'Logout'}
                </button>
              </>
            )}
            
            <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="btn btn-secondary mt-2">
              {language === 'en' ? 'አማርኛ' : 'English'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
