import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

function LanguageSwitcher() {
  const { t,i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'el' : 'en'; // Toggle between 'en' and 'el'
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage); // Persist the language in localStorage
  };

  return (
    <div title={t(i18n.language==='en'? "switch_language_el" : "switch_language_en")} onClick={toggleLanguage}>
      <LanguageIcon  style={{ backgroundColor: 'transparent' }}  />
      <div style={{width:'15ch',fontSize:'15px'}}>{t(i18n.language==='en'? "switch_to_greek" : "switch_to_english")}</div>
      </div>
  );
}

export default LanguageSwitcher;