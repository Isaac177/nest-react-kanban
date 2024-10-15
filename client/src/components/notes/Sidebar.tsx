import React from 'react';
import { Package2, Home, FileText, Archive, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Notes', icon: FileText, href: '/notes' },
    { name: 'Archived', icon: Archive, href: '/archived' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="flex flex-col items-center gap-4 px-2 py-5 border-r h-screen">
      <a
        href="/dashboard"
        className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
      >
        <Package2 className="h-6 w-6 transition-all group-hover:scale-110" />
        <span className="sr-only">Kanban Notes</span>
      </a>
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <a
              href={item.href}
              className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:text-foreground ${
                currentPath === item.href
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
            <span className="sr-only">Logout</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>
    </nav>
  );
};

export default Sidebar;
