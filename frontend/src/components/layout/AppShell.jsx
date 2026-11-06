import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  Dumbbell,
  ClipboardList,
  TrendingUp,
  UserCircle,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth.js';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/plans', label: 'Plans', icon: CalendarRange },
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/logs', label: 'Workouts', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div
      className="min-h-screen text-[#F9FAFB] flex flex-col lg:flex-row"
      style={{
        background: 'linear-gradient(135deg, #0a0d14 0%, #0d1117 30%, #0f1623 60%, #0a0e1a 100%)',
      }}
    >
      {/* ── Desktop Sidebar (≥ 1024px) ── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30 border-r border-white/5"
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0d1117 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-md shadow-[#10B981]/30">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#F9FAFB]">FitVerse</span>
            <div className="text-[10px] text-[#10B981]/70 font-semibold tracking-widest uppercase -mt-0.5">
              Pro Fitness
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 shadow-sm'
                      : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        isActive ? 'bg-[#10B981]/20' : 'bg-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5">
          {user && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] text-white text-xs font-bold shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F9FAFB] truncate">{user.name}</p>
                  <p className="text-[11px] text-[#9CA3AF] truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-medium text-[#9CA3AF] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors cursor-pointer border border-transparent hover:border-[#EF4444]/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header (< 1024px) ── */}
      <header
        className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-30 border-b border-white/5"
        style={{
          background: 'linear-gradient(90deg, #111827 0%, #0d1117 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-sm shadow-[#10B981]/30">
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-bold text-base text-[#F9FAFB]">FitVerse</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log Out"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-[#EF4444] cursor-pointer transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* ── Main Content Wrapper ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        <footer className="border-t border-white/5 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1280px] mx-auto text-center text-xs text-[#9CA3AF]/60">
            FitVerse provides general fitness information and is not medical advice. Consult a
            physician before starting a new exercise program.
          </div>
        </footer>
      </div>

      {/* ── Mobile Bottom Tab Bar (< 1024px) ── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-white/5"
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0d1117 100%)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="grid grid-cols-6 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all duration-200 relative ${
                    isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]/70 hover:text-[#F9FAFB]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute top-0 inset-x-0 h-0.5 rounded-b bg-[#10B981]" />
                    )}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                        isActive ? 'bg-[#10B981]/15' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate max-w-full px-0.5 leading-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
