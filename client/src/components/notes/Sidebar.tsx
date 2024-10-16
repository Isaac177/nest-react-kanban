import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package2, Home, FileText, Archive, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from "../../contexts/LanguageContext.tsx";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: t('sidebar.dashboard'), icon: Home, href: '/dashboard' },
    { name: t('sidebar.notes'), icon: FileText, href: '/notes' },
    { name: t('sidebar.archived'), icon: Archive, href: '/archived' },
    { name: t('sidebar.settings'), icon: Settings, href: '/settings' },
  ];

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate(`/${language}/login`);
  };

  return (
    <nav className="flex flex-col items-center gap-4 px-2 py-5 border-r h-screen">
      <a
        href={`/${language}/dashboard`}
        className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
      >
        <Package2 className="h-6 w-6 transition-all group-hover:scale-110" />
        <span className="sr-only">{t('sidebar.appName')}</span>
      </a>
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <a
              href={`/${language}${item.href}`}
              className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:text-foreground ${
                currentPath === `/${language}${item.href}`
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.name}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">{item.name}</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="mt-auto flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:text-foreground text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            <span className="sr-only">{t('sidebar.logout')}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{t('sidebar.logout')}</TooltipContent>
      </Tooltip>
    </nav>
  );
};

export default Sidebar;
