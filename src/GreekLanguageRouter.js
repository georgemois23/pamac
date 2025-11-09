import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import App from './App';

const GreekLanguageRouter = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
  // Force a single language, e.g., English
  if (i18n.language !== 'en') {
    i18n.changeLanguage('en');
    localStorage.setItem('i18nextLng', 'en');
  }
}, [i18n.language]);
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('i18nextLng');
//     let desiredLanguage;

// if (location.pathname.includes('/el')) {
//   desiredLanguage = 'el';
//   localStorage.setItem('i18nextLng', 'el');
// } else if (location.pathname.includes('/en')) {
//   desiredLanguage = 'en';
//   localStorage.setItem('i18nextLng', 'en');
// } else {
//   // Default to what's saved
//   desiredLanguage = localStorage.getItem('i18nextLng') || 'en';
// } // Default to English if not Greek
  
//     console.log('Detected path:', location.pathname);
//     console.log('Detected desired language:', desiredLanguage);
//     console.log('Current i18n.language:', i18n.language);
  
//     // Only switch if necessary
//     if (i18n.language !== desiredLanguage) {
//       console.log(`Switching to ${desiredLanguage}`);
//       i18n.changeLanguage(desiredLanguage);
//       localStorage.setItem('i18nextLng', desiredLanguage);
//     }
//   }, [location.pathname, i18n.language]); 

  // if (!languageReady) return <div>Loading language...</div>; // δείξε loading ή null

  return <App key={i18n.language} />;
};

export default GreekLanguageRouter;
