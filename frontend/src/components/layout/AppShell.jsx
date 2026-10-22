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
    <div className="min-h-screen bg-[#0B0F17] text-[#F9FAFB] flex flex-col lg:flex-row">
      {/* Desktop Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-[#111827] border-r border-[#1E293B] z-30">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-[#1E293B]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">FitVerse</span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#10B981]/15 text-[#10B981]'
                      : 'text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          {user && (
            <div className="mb-3 px-2">
              <p className="text-xs font-semibold text-[#F9FAFB] truncate">{user.name}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-medium text-[#9CA3AF] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (< 1024px) */}
      <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#111827] border-b border-[#1E293B] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981] text-[#0B0F17]">
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-bold text-base">FitVerse</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log Out"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#EF4444] cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen pb-20 lg:pb-0">
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        <footer className="border-t border-[#1E293B] bg-[#111827]/40 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1280px] mx-auto text-center text-xs text-[#9CA3AF]">
            FitVerse provides general fitness information and is not medical advice. Consult a
            physician before starting a new exercise program.
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Tab Bar (< 1024px) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#111827] border-t border-[#1E293B] z-30">
        <div className="grid grid-cols-6 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-[#10B981]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="truncate max-w-full px-1">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
