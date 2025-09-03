import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Activity, Settings, BarChart3, AlertTriangle, Info, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import ProfileModal from "./ProfileModal";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  // Don't show navigation on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  // Redirect to auth if not authenticated (except on landing page)
  if (!loading && !user && location.pathname !== '/') {
    return <Navigate to="/auth" replace />;
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Activity },
    { name: "Control Panel", path: "/control", icon: Settings },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Manual Override", path: "/override", icon: AlertTriangle },
    { name: "About", path: "/about", icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-elegant group-hover:shadow-glow transition-shadow duration-300">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SmartSignal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-muted",
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground shadow-elegant" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle, Auth & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg hover:bg-muted"
            >
              {theme === "dark" ? 
                <Sun className="h-5 w-5 text-warning" /> : 
                <Moon className="h-5 w-5 text-primary" />
              }
            </Button>
            
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <ProfileModal />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-destructive rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:ml-2 lg:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              location.pathname === '/' && (
                <Link to="/auth">
                  <Button variant="secondary" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg hover:bg-muted"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-elegant"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                  );
                })}
                
                {/* Mobile Auth */}
                {user ? (
                  <div className="border-t border-border pt-2 space-y-2">
                    <div className="px-3 py-2 space-y-2">
                      <ProfileModal />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={signOut}
                        className="w-full justify-start text-muted-foreground hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  location.pathname === '/' && (
                    <div className="border-t border-border pt-2">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="secondary" size="sm" className="w-full mx-3">
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </nav>
  );
};

export default Navigation;