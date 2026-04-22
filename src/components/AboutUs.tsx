import React from 'react';
import Navigation from './Navigation';
import { getTranslation } from '../translations';

interface AboutUsProps {
  language: 'en' | 'am';
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'am' ? 'amharic' : ''}`}>
      <Navigation language={language} />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            {t('aboutTitle')}
          </h1>
          <p style={{ color: '#6b7280' }}>{t('aboutDescription')}</p>
        </div>

        {/* Mission and Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--orthodox-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', textAlign: 'center' }}>
              {t('mission')}
            </h2>
            <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {t('missionText')}
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--orthodox-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👁️</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', textAlign: 'center' }}>
              {t('vision')}
            </h2>
            <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {t('visionText')}
            </p>
          </div>
        </div>

        {/* Church History */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
            {language === 'am' ? 'የቤተ ክርስቲያናችን ታሪክ' : 'Our Church History'}
          </h2>
          <div style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {language === 'am' ? (
              <>
                <p style={{ marginBottom: '0.75rem' }}>
                  የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ከ1,600 ዓመታት በላይ የሚዘልቅ ሀብታም ታሪክ አላት። 
                  ቤተ ክርስቲያናችን በአፍሪካ ውስጥ ካሉት ጥንታዊ የክርስቲያን ቤተ ክርስቲያኖች አንዷ ነች።
                </p>
                <p>
                  ተማሪዎች በቤተ ክርስቲያናችን የተለያዩ የሃይማኖት ትምህርቶችን፣ የአማርኛ ቋንቋ፣ የቤተ ክርስቲያን ታሪክ፣ 
                  እና የመንፈሳዊ ሙዚቃ ትምህርቶችን ይማራሉ።
                </p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '0.75rem' }}>
                  The Ethiopian Orthodox Tewahedo Church has a rich history spanning over 1,600 years. 
                  Our church is one of the oldest Christian churches in Africa.
                </p>
                <p>
                  Students learn various religious subjects including church history, 
                  Amharic language, liturgical music, and spiritual teachings.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Programs Offered */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
            {language === 'am' ? 'የምንሰጣቸው ትምህርቶች' : 'Programs We Offer'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📖</div>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                {language === 'am' ? 'የሃይማኖት ትምህርት' : 'Religious Studies'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                {language === 'am' ? 'የቤተ ክርስቲያን ታሪክ እና መጽሐፍ ቅዱስ' : 'Church history & Bible studies'}
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎵</div>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                {language === 'am' ? 'የቤተ ክርስቲያን ሙዚቃ' : 'Liturgical Music'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                {language === 'am' ? 'መዝሙሮች እና መንፈሳዊ ሙዚቃ' : 'Hymns & spiritual music'}
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✍️</div>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                {language === 'am' ? 'የአማርኛ ቋንቋ' : 'Amharic Language'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                {language === 'am' ? 'ማንበብ፣ መጻፍ እና ሰዋሰው' : 'Reading, writing & grammar'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
