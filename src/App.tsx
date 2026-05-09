import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Icon from "@/components/ui/icon";
import HomePage from "@/pages/Index";
import GamesPage from "@/pages/GamesPage";
import ProfilePage from "@/pages/ProfilePage";
import ShopPage from "@/pages/ShopPage";
import AchievementsPage from "@/pages/AchievementsPage";
import CommunityPage from "@/pages/CommunityPage";
import CreativePage from "@/pages/CreativePage";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

type Page = "home" | "games" | "creative" | "profile" | "community" | "shop" | "achievements" | "settings";

const NAV_ITEMS: { id: Page; label: string; icon: string; color: string }[] = [
  { id: "home",         label: "Главная",    icon: "Gamepad2",    color: "var(--neon-green)" },
  { id: "games",        label: "Игры",       icon: "Joystick",    color: "var(--neon-blue)" },
  { id: "creative",     label: "Творчество", icon: "Palette",     color: "var(--neon-purple)" },
  { id: "community",    label: "Сообщество", icon: "Users",       color: "var(--neon-pink)" },
  { id: "shop",         label: "Магазин",    icon: "ShoppingBag", color: "var(--neon-orange)" },
  { id: "achievements", label: "Достижения", icon: "Trophy",      color: "#ffd700" },
  { id: "profile",      label: "Профиль",    icon: "User",        color: "var(--neon-green)" },
  { id: "settings",     label: "Настройки",  icon: "Settings",    color: "#6b7280" },
];

function AppInner() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "home":         return <HomePage onNavigate={setPage} />;
      case "games":        return <GamesPage />;
      case "creative":     return <CreativePage />;
      case "community":    return <CommunityPage />;
      case "shop":         return <ShopPage />;
      case "achievements": return <AchievementsPage />;
      case "profile":      return <ProfilePage />;
      case "settings":     return <SettingsPage />;
      default:             return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark-bg)' }}>

      {/* TOP BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(10,13,20,0.97)', borderColor: 'var(--dark-border)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-4 h-14">

          {/* Logo */}
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--neon-green)', color: 'var(--dark-bg)' }}>
              <span className="font-pixel" style={{ fontSize: '10px' }}>▶</span>
            </div>
            <span className="font-orbitron font-black tracking-widest" style={{ color: 'var(--neon-green)', fontSize: '18px' }}>
              PIXELVERSE
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-200"
                style={{
                  color: page === item.id ? item.color : '#8892a4',
                  borderBottom: page === item.id ? `2px solid ${item.color}` : '2px solid transparent',
                  textShadow: page === item.id ? `0 0 10px ${item.color}` : 'none',
                  fontFamily: 'Rubik, sans-serif',
                }}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <div className="font-pixel" style={{ color: 'var(--neon-orange)', fontSize: '8px' }}>LVL 42</div>
              <div className="w-20 h-2 xp-bar">
                <div className="xp-bar-fill" style={{ width: '68%' }} />
              </div>
              <div style={{ color: '#6b7280', fontSize: '10px' }}>68%</div>
            </div>

            <button
              onClick={() => setPage("profile")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold relative"
              style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))', color: 'white' }}
            >
              Д
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: 'var(--dark-bg)', background: 'var(--neon-green)' }} />
            </button>

            <button
              className="lg:hidden p-1"
              style={{ color: '#8892a4' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ background: 'var(--dark-card)', borderColor: 'var(--dark-border)' }}>
            <div className="grid grid-cols-4 gap-0">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setPage(item.id); setMobileMenuOpen(false); }}
                  className="flex flex-col items-center gap-1 p-3 transition-all"
                  style={{
                    color: page === item.id ? item.color : '#8892a4',
                    background: page === item.id ? 'rgba(0,255,179,0.05)' : 'transparent',
                  }}
                >
                  <Icon name={item.icon} size={18} />
                  <span style={{ fontSize: '9px', fontFamily: 'Rubik, sans-serif' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Ticker */}
      <div className="fixed top-14 left-0 right-0 z-40 overflow-hidden" style={{ background: 'var(--neon-green)', height: '22px' }}>
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="font-pixel px-8" style={{ color: 'var(--dark-bg)', fontSize: '8px', lineHeight: '22px' }}>
              ★ ДОБРО ПОЖАЛОВАТЬ В PIXELVERSE ★&nbsp;&nbsp; 🎮 НОВАЯ ИГРА: GALACTIC WARRIORS ★&nbsp;&nbsp; 🏆 ТОПТИГР занял 1-е место ★&nbsp;&nbsp; 💎 МАГАЗИН: СКИДКИ ДО 50% ★&nbsp;&nbsp; 🎨 КОНКУРС ТВОРЧЕСТВА — ПРИЗЫ ★&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Page content */}
      <main className="pt-14">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppInner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}