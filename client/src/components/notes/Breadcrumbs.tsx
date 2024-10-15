import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  currentPath: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath }) => {
  const paths = currentPath.split('/').filter(path => path);

  return (
    <nav aria-label="Breadcrumb" className="px-6 py-2 bg-background">
      <ol className="flex items-center space-x-2">
        <li>
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </a>
        </li>
        {paths.slice(1).map((path, index) => (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <a
                href={`/dashboard/${paths.slice(1, index + 2).join('/')}`}
                className={index === paths.length - 2 ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </a>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
