import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import AuthService from '../services/auth';

interface VerifyEmailProps {
  language: 'en' | 'am';
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ language }) => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.verify(email, code);
      toast.success(language === 'am' ? 'ኢሜል ተረጋግጧል!' : 'Email verified successfully!');
      navigate(`/${language}/login`);
    } catch (error: any) {
      toast.error(error.message || (language === 'am' ? 'ማረጋገጥ አልተሳካም' : 'Verification failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await AuthService.resendCode(email);
      toast.success(language === 'am' ? 'አዲስ ኮድ ተልኳል' : 'New code sent to your email');
    } catch (error: any) {
      toast.error(error.message || (language === 'am' ? 'ኮድ መላክ አልተሳካም' : 'Failed to resend code'));
    } finally {
      setIsResending(false);
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
          </div>

          {/* Verify Card */}
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✉️</div>
              <h2 style={{ color: '#1e3a5f', fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>
                {language === 'am' ? 'ኢሜልዎን ያረጋግጡ' : 'Verify Your Email'}
              </h2>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#0369a1', fontSize: '0.9rem', margin: 0 }}>
                  {language === 'am' 
                    ? `የማረጋገጫ ኮድ ወደ ተልኳል:`
                    : `A verification code has been sent to:`}
                </p>
                <p style={{ color: '#1e3a5f', fontWeight: '700', fontSize: '1rem', marginTop: '0.5rem' }}>{email}</p>
              </div>

              <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e3a5f', textAlign: 'center', fontSize: '0.95rem' }}>
                    {language === 'am' ? 'የ6 አሃዝ ኮድ ያስገቡ' : 'Enter 6-digit code'}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{ width: '100%', padding: '16px', fontSize: '2rem', textAlign: 'center', letterSpacing: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontWeight: '700', color: '#1e3a5f', boxSizing: 'border-box', transition: 'all 0.3s' }}
                    placeholder="000000"
                    maxLength={6}
                    onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  style={{ width: '100%', padding: '14px', background: (isLoading || code.length !== 6) ? '#9ca3af' : 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1.1rem', cursor: (isLoading || code.length !== 6) ? 'not-allowed' : 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)' }}
                >
                  {isLoading ? (language === 'am' ? 'እየተረጋገጠ ነው...' : 'Verifying...') : (language === 'am' ? 'አረጋግጥ' : 'Verify Email')}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {language === 'am' ? 'ኮድ አልደረሰዎትም?' : "Didn't receive the code?"}
                </p>
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  style={{ background: 'none', border: 'none', color: '#c9a227', cursor: isResending ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '1rem', textDecoration: 'underline' }}
                >
                  {isResending 
                    ? (language === 'am' ? 'እየተላከ ነው...' : 'Sending...') 
                    : (language === 'am' ? 'እንደገና ላክ' : 'Resend Code')}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '2rem' }}>
            {language === 'am' ? 'ኮዱ በ10 ደቂቃ ውስጥ ያበቃል' : 'Code expires in 10 minutes'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
