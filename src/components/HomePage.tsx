import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { getTranslation } from '../translations';

interface HomePageProps {
  language: 'en' | 'am';
}

const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className={`min-h-screen ${language === 'am' ? 'amharic' : ''}`} style={{ background: 'linear-gradient(to bottom right, #EFF6FF, #E0E7FF)' }}>
      <Navigation language={language} />
      
      <main className="container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('welcome')}
          </h1>
          <p className="text-xl font-semibold mb-4" style={{ color: 'var(--orthodox-blue)' }}>
            {t('subtitle')}
          </p>
          <p className="text-gray-600 mb-6" style={{ maxWidth: '40rem', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
            {t('description')}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/${language}/register`} className="btn btn-primary">
              {t('getStarted')}
            </Link>
            <Link to={`/${language}/about`} className="btn btn-secondary">
              {t('learnMore')}
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md-grid-cols-3" style={{ gap: '1.5rem', marginTop: '3rem' }}>
          <div className="card">
            <div className="card-body text-center">
              <div className="stats-icon blue" style={{ margin: '0 auto 1rem' }}>📖</div>
              <h3 className="font-bold text-gray-800 mb-2">
                {language === 'am' ? 'ሃይማኖታዊ ትምህርት' : 'Religious Education'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'am' ? 'በኢትዮጵያ ኦርቶዶክስ ወጎች ላይ የተመሰረተ ትምህርት' : 'Education rooted in Ethiopian Orthodox traditions'}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="stats-icon green" style={{ margin: '0 auto 1rem' }}>👥</div>
              <h3 className="font-bold text-gray-800 mb-2">
                {language === 'am' ? 'የማህበረሰብ ተሳትፎ' : 'Community'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'am' ? 'ተማሪዎች በቤተ ክርስቲያን እንቅስቃሴዎች ይሳተፋሉ' : 'Students participate in church activities'}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="stats-icon gold" style={{ margin: '0 auto 1rem' }}>🏆</div>
              <h3 className="font-bold text-gray-800 mb-2">
                {language === 'am' ? 'የምስክር ወረቀት' : 'Certification'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'am' ? 'ተማሪዎች የምስክር ወረቀት ያገኛሉ' : 'Students receive certificates upon completion'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
