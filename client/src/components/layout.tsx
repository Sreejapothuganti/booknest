import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import MobileMenu from "./mobile-menu";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop only */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header - Mobile only */}
        <div className="lg:hidden bg-white border-b border-slate-200 flex items-center justify-between p-4">
          <Link href="/">
            <a className="text-xl font-bold text-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              BookNest
            </a>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Content area */}
        <main className="flex-1 p-5 lg:p-8 bg-slate-50">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} BookNest. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy">
                <a className="text-slate-600 hover:text-primary text-sm">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-slate-600 hover:text-primary text-sm">
                  Terms of Service
                </a>
              </Link>
              <Link href="/accessibility">
                <a className="text-slate-600 hover:text-primary text-sm">
                  Accessibility
                </a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default Layout;
