import { Home, BarChart3, TrendingUp, Settings, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Start" },
  { path: "/portfel", icon: Wallet, label: "Portfel" },
  { path: "/kursy", icon: BarChart3, label: "Kursy" },
  { path: "/rankingi", icon: TrendingUp, label: "Rankingi" },
  { path: "/ustawienia", icon: Settings, label: "Ustawienia" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}