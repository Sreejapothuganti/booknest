import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Building2, 
  Bookmark, 
  BookOpen, 
  MessageSquare, 
  Settings,
  Search,
  X
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, onLogout }: MobileMenuProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  if (!isOpen) return null;
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="mr-3 h-5 w-5" /> },
    { path: "/housing", label: "Housing", icon: <Building2 className="mr-3 h-5 w-5" /> },
    { path: "/saved", label: "Saved", icon: <Bookmark className="mr-3 h-5 w-5" /> },
    { path: "/book-clubs", label: "Book Clubs", icon: <BookOpen className="mr-3 h-5 w-5" /> },
    { path: "/messages", label: "Messages", icon: <MessageSquare className="mr-3 h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 lg:hidden bg-slate-800 bg-opacity-75 z-50 flex">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
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
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <div className="px-4 mb-4">
            <div className="flex items-center bg-slate-100 rounded-full py-1 px-2">
              <Search className="ml-1 mr-2 h-4 w-4 text-slate-500" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm flex-1 h-7 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a 
                  className={`flex items-center px-4 py-2 text-sm rounded-md font-medium ${
                    location === item.path 
                      ? "bg-indigo-50 text-primary" 
                      : "text-slate-700 hover:bg-indigo-50 hover:text-primary"
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || "Guest"}</p>
              <Button 
                variant="ghost" 
                className="text-xs text-red-500 hover:text-red-700 p-0 h-auto"
                onClick={onLogout}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Close menu when clicking outside */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}

export default MobileMenu;
