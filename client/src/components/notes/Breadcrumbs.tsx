import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from "../../contexts/LanguageContext.tsx";

interface BreadcrumbsProps {
  currentPath: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const paths = currentPath.split('/').filter(path => path);

  return (
    <nav aria-label="Breadcrumb" className="px-6 py-2 bg-background">
      <ol className="flex items-center space-x-2">
        <li>
          <a href={`/${language}/dashboard`} className="text-muted-foreground hover:text-foreground">
            {t('breadcrumbs.dashboard')}
          </a>
        </li>
        {paths.slice(1).map((path, index) => (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <a
                href={`/${language}/dashboard/${paths.slice(1, index + 2).join('/')}`}
                className={index === paths.length - 2 ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {t(`breadcrumbs.${path.toLowerCase()}`)}
              </a>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
