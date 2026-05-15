import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import AuthService from '../services/auth';

interface SignupProps {
  language: 'en' | 'am';
}

const Signup: React.FC<SignupProps> = ({ language }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(language === 'am' ? 'የይለፍ ቃሎች አይዛመዱም' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error(language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.register(fullName, email, phone, password);
      toast.success(language === 'am' ? 'ምዝገባ ተሳክቷል! ይግቡ' : 'Registration successful! You can now log in.');
      navigate(`/${language}/login`);
    } catch (error: any) {
      toast.error(error.message || (language === 'am' ? 'ምዝገባ አልተሳካም' : 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 42px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.95rem',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  return (
    <div className={`min-h-screen ${language === 'am' ? 'amharic' : ''}`} style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)' }}>
      <Navigation language={language} minimal={true} />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src="/logo.webp" alt="EOTC Logo" style={{ height: '70px', margin: '0 auto 0.75rem' }} />
            <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {language === 'am' ? 'አስኮ ደብረ መድኃኒት መድኃኔዓለም እና ቅዱስ ጊዮርስ ቤተክርስቲያን መሠረተ ሕይወት ሰንበት ትምህርት ቤት' : 'ASCO Debre Medhanit Medhanealhem and Kidus Giyorgis Betekristiyan Meserete Hiywot Senbet Timhirt Bet'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {language === 'am' ? 'የተማሪ ምዝገባ ስርዓት' : 'Student Registration System'}
            </p>
          </div>

          {/* Signup Card */}
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', padding: '1.25rem', textAlign: 'center' }}>
              <h2 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>
                {language === 'am' ? 'አዲስ መለያ ይፍጠሩ' : 'Create Account'}
              </h2>
              <p style={{ color: '#1e3a5f', opacity: 0.8, marginTop: '0.25rem', fontSize: '0.85rem' }}>
                {language === 'am' ? 'መረጃዎን ያስገቡ' : 'Fill in your details'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }} autoComplete="off">
              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                  {language === 'am' ? 'ሙሉ ስም' : 'Full Name'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>👤</span>
                  <input
                    type="text"
                    name="fullname_field"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                  {language === 'am' ? 'ኢሜል አድራሻ' : 'Email Address'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    placeholder={language === 'am' ? 'ኢሜልዎን ያስገቡ' : 'Enter your email'}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                  {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>📱</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle}
                    placeholder="+251 9XX XXX XXX"
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                  {language === 'am' ? 'የይለፍ ቃል' : 'Password'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                  {language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔐</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', padding: '14px', background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1.05rem', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)' }}
              >
                {isLoading ? (language === 'am' ? 'እየተመዘገበ ነው...' : 'Creating Account...') : (language === 'am' ? 'ይመዝገቡ' : 'Create Account')}
              </button>
            </form>

            <div style={{ padding: '0 1.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ height: '1px', background: '#e5e7eb', margin: '0 0 1rem' }}></div>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {language === 'am' ? 'መለያ አለዎት?' : 'Already have an account?'}{' '}
                <Link to={`/${language}/login`} style={{ color: '#c9a227', fontWeight: '700', textDecoration: 'none' }}>
                  {language === 'am' ? 'ይግቡ' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            © 2024 {language === 'am' ? 'ኢ.ኦ.ተ.ቤ.ክ' : 'EOTC'} - {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው' : 'All Rights Reserved'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
