import { Search, Bell, User, Moon, Sun, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function TopNavigation() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [layout, setLayout] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    const savedLayout = localStorage.getItem('layout') as 'mobile' | 'desktop' || 'mobile';
    setTheme(savedTheme);
    setLayout(savedLayout);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleLayout = () => {
    const newLayout = layout === 'mobile' ? 'desktop' : 'mobile';
    setLayout(newLayout);
    localStorage.setItem('layout', newLayout);
    document.body.className = newLayout === 'desktop' ? 'layout-desktop' : 'layout-mobile';
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <h1 className="text-xl font-bold">Loombard</h1>
        </div>

        {/* Search - hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Szukaj walut, kursów..." 
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {getThemeIcon()}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleLayout}>
            {layout === 'mobile' ? <Monitor size={18} /> : <Smartphone size={18} />}
          </Button>

          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Bell size={18} />
          </Button>

          <Button variant="ghost" size="sm">
            <User size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}