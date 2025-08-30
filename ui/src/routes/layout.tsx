import { type ReactNode } from 'react';
import { RAHeader } from '../components/header';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <RAHeader />}
      <main className={showHeader ? "pt-16 md:pt-20" : ""}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
