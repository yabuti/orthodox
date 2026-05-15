import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import AuthService from '../services/auth';

interface LoginProps {
  language: 'en' | 'am';
}

const Login: React.FC<LoginProps> = ({ language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.login(email, password);
      toast.success(language === 'am' ? 'በተሳካ ሁኔታ ገብተዋል!' : 'Login successful!');
      navigate(`/${language}/register`);
    } catch (error: any) {
      toast.error(error.message || (language === 'am' ? 'መግባት አልተሳካም' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${language === 'am' ? 'amharic' : ''}`} style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)' }}>
      <Navigation language={language} minimal={true} />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/logo.webp" alt="EOTC Logo" style={{ height: '80px', margin: '0 auto 1rem' }} />
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              {language === 'am' ? 'አስኮ ደብረ መድኃኒት መድኃኔዓለም እና ቅዱስ ጊዮርስ ቤተክርስቲያን መሠረተ ሕይወት ሰንበት ትምህርት ቤት' : 'ASCO Debre Medhanit Medhanealhem and Kidus Giyorgis Betekristiyan Meserete Hiywot Senbet Timhirt Bet'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              {language === 'am' ? 'የተማሪ ምዝገባ ስርዓት' : 'Student Registration System'}
            </p>
          </div>

          {/* Login Card */}
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', padding: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ color: '#1e3a5f', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                {language === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome Back'}
              </h2>
              <p style={{ color: '#1e3a5f', opacity: 0.8, marginTop: '0.25rem', fontSize: '0.9rem' }}>
                {language === 'am' ? 'ወደ መለያዎ ይግቡ' : 'Sign in to your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.95rem' }}>
                  {language === 'am' ? 'ኢሜል አድራሻ' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '14px 14px 14px 45px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }}
                    placeholder={language === 'am' ? 'ኢሜልዎን ያስገቡ' : 'Enter your email'}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.95rem' }}>
                  {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '14px 45px 14px 45px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box' }}
                    placeholder={language === 'am' ? 'የይለፍ ቃልዎን ያስገቡ' : 'Enter your password'}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', padding: '14px', background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1.1rem', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)' }}
              >
                {isLoading ? (language === 'am' ? 'እየገባ ነው...' : 'Signing in...') : (language === 'am' ? 'ግባ' : 'Sign In')}
              </button>
            </form>

            <div style={{ padding: '0 2rem 2rem', textAlign: 'center' }}>
              <div style={{ height: '1px', background: '#e5e7eb', margin: '0 0 1.5rem' }}></div>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                {language === 'am' ? 'መለያ የለዎትም?' : "Don't have an account?"}{' '}
                <Link to={`/${language}/signup`} style={{ color: '#c9a227', fontWeight: '700', textDecoration: 'none' }}>
                  {language === 'am' ? 'ይመዝገቡ' : 'Sign Up'}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '2rem' }}>
            © 2024 {language === 'am' ? 'ኢ.ኦ.ተ.ቤ.ክ' : 'EOTC'} - {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው' : 'All Rights Reserved'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
