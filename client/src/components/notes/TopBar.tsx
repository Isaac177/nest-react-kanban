import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Search, CircleUser, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateNoteModal from "./CreateNoteModal";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext.tsx";

const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const getCurrentTabTitle = () => {
    return t('topBar.dashboard');
  };

  const getSearchPlaceholder = () => {
    return t('topBar.searchPlaceholder');
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Searching...");
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate(`/${language}/login`);
  };

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
        <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
          <div className="mr-auto text-3xl font-semibold">
            {getCurrentTabTitle()}
          </div>
          <Button className="hidden sm:flex" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t('topBar.newNote')}
          </Button>
          <form className="flex-1 sm:flex-initial" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={getSearchPlaceholder()}
                className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[250px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">{t('topBar.toggleUserMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('topBar.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${language}/settings`)}>
                {t('topBar.settings')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/${language}/support`)}>
                {t('topBar.support')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {t('topBar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
