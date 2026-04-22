import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navigation from './Navigation';
import AuthService from '../services/auth';

interface ProfileProps {
  language: 'en' | 'am';
}

const Profile: React.FC<ProfileProps> = ({ language }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const userData = AuthService.getUser();
    if (userData) {
      setUser(userData);
      setFormData({
        fullName: userData.fullName || userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      navigate(`/${language}/login`);
    }
  }, [language, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error(language === 'am' ? 'የይለፍ ቃሎች አይዛመዱም' : 'Passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error(language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(language === 'am' ? 'መገለጫ ተዘምኗል!' : 'Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsEditing(false);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || (language === 'am' ? 'ማዘመን አልተሳካም' : 'Update failed'));
      }
    } catch (error) {
      toast.error(language === 'am' ? 'ማዘመን አልተሳካም' : 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  if (!user) return null;

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'am' ? 'amharic' : ''}`}>
      <Navigation language={language} />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2.5rem', fontWeight: '700', color: '#1e3a5f', border: '4px solid #fff' }}>
              {getInitials(formData.fullName)}
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              {formData.fullName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>{formData.email}</p>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem' }}>
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                  </label>
                  <p style={{ color: '#1e3a5f', fontSize: '1.1rem', fontWeight: '500' }}>{formData.fullName}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {language === 'am' ? 'ኢሜል' : 'Email'}
                  </label>
                  <p style={{ color: '#1e3a5f', fontSize: '1.1rem', fontWeight: '500' }}>{formData.email}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
                  </label>
                  <p style={{ color: '#1e3a5f', fontSize: '1.1rem', fontWeight: '500' }}>{formData.phone}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
                  </label>
                  <p style={{ color: '#1e3a5f', fontSize: '1.1rem', fontWeight: '500' }}>••••••••</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)', color: '#1e3a5f', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
                >
                  {language === 'am' ? 'መገለጫ አርትዕ' : 'Edit Profile'}
                </button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                      {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                      {language === 'am' ? 'ኢሜል' : 'Email'} ({language === 'am' ? 'ሊቀየር አይችልም' : 'cannot be changed'})
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }}
                      disabled
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                      {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      required
                    />
                  </div>

                  <div style={{ borderTop: '1px solid #e5e7eb', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                    <h3 style={{ color: '#1e3a5f', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                      {language === 'am' ? 'የይለፍ ቃል ቀይር (አማራጭ)' : 'Change Password (Optional)'}
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                        {language === 'am' ? 'የአሁኑ የይለፍ ቃል' : 'Current Password'}
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                        {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#1e3a5f', fontSize: '0.9rem' }}>
                        {language === 'am' ? 'አዲስ የይለፍ ቃል ያረጋግጡ' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#c9a227'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{ flex: 1, padding: '14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      {language === 'am' ? 'ሰርዝ' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{ flex: 1, padding: '14px', background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {isLoading ? (language === 'am' ? 'እየተቀመጠ...' : 'Saving...') : (language === 'am' ? 'አስቀምጥ' : 'Save Changes')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
