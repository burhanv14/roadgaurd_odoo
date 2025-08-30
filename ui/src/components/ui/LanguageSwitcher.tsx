import React from 'react';
import i18n from 'i18next';

const LanguageSwitcher: React.FC = () => {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('hi')} style={{ marginLeft: '10px' }}>हिंदी</button>
    </div>
  );
};

export default LanguageSwitcher;
