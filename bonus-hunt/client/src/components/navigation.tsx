import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Dice6, Trophy, Settings, Eye, Key, LogOut } from "lucide-react";
import { useStats } from "@/hooks/use-hunts";
import { useAdmin } from "@/hooks/use-admin";
import { AdminLoginModal } from "@/components/admin-login-modal";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: stats } = useStats();
  const { isAdmin, logout } = useAdmin();

  // Only show admin-only routes to authenticated admins
  const navItems = [
    { path: "/", label: "Hunts", icon: Trophy },
    ...(isAdmin ? [
      { path: "/obs", label: "OBS Overlay", icon: Eye },
    ] : []),
  ];

  return (
    <header className="bg-dark-purple/80 backdrop-blur-sm border-b border-purple-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Dice6 className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BonusHunter Pro
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} href={path}>
                  <button
                    className={`text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10 ${
                      location === path ? "bg-primary/20 text-primary" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              <span>{stats?.totalHunts || 0}</span> Hunts Created
            </div>
            
            {isAdmin ? (
              <>
                <Link href="/admin">
                  <button 
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                    data-testid="button-new-hunt"
                  >
                    <Trophy className="w-4 h-4 mr-2 inline" />
                    New Hunt
                  </button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="text-primary hover:text-primary/90 border-primary/20 hover:border-primary/30"
                data-testid="button-admin-login"
              >
                <Key className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AdminLoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />
    </header>
  );
}
