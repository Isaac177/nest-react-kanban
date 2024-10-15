import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
    const newPath = location.pathname.replace(/^\/[^/]+/, `/${value}`);
    navigate(newPath);
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'ru': return 'Русский';
      case 'kk': return 'Қазақша';
      default: return code;
    }
  };

  return (
    <Select onValueChange={changeLanguage} value={i18n.language}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{getLanguageName(i18n.language)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="kk">Қазақша</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageToggle;
