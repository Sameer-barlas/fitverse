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
        background: 'linear-gradient(135deg, #060814 0%, #0a0d1a 40%, #080c18 70%, #060812 100%)',
      }}
    >
      {/* ── Desktop Sidebar (≥ 1024px) ── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30"
        style={{
          background: 'linear-gradient(180deg, #0d1025 0%, #090d1e 50%, #07091a 100%)',
          borderRight: '1px solid rgba(99,102,241,0.12)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 h-16"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}
          >
            <Dumbbell className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">FitVerse</span>
            <div
              className="text-[10px] font-bold tracking-widest uppercase -mt-0.5"
              style={{ color: 'rgba(167,139,250,0.7)' }}
            >
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/4'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.12) 100%)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        boxShadow: '0 2px 12px rgba(99,102,241,0.15)',
                      }
                    : { border: '1px solid transparent' }
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                      style={
                        isActive
                          ? { background: 'rgba(99,102,241,0.25)' }
                          : {}
                      }
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 transition-all"
                        style={{ color: isActive ? '#a78bfa' : undefined }}
                      />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {user && (
            <div
              className="mb-3 px-3 py-2.5 rounded-xl"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.12)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90 truncate">{user.name}</p>
                  <p className="text-[11px] text-white/35 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.border = '1px solid transparent';
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header (< 1024px) ── */}
      <header
        className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-30"
        style={{
          background: 'rgba(9,13,30,0.95)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
            }}
          >
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-bold text-base text-white">FitVerse</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log Out"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* ── Main Content Wrapper ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <Outlet />
        </main>

        <footer
          className="py-4 px-4 sm:px-6 lg:px-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-[1280px] mx-auto text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            FitVerse provides general fitness information and is not medical advice. Consult a
            physician before starting a new exercise program.
          </div>
        </footer>
      </div>

      {/* ── Mobile Bottom Tab Bar (< 1024px) ── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30"
        style={{
          background: 'rgba(9,13,30,0.97)',
          borderTop: '1px solid rgba(99,102,241,0.12)',
          backdropFilter: 'blur(20px)',
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
                    isActive ? 'text-violet-400' : 'text-white/30 hover:text-white/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div
                        className="absolute top-0 inset-x-2 h-0.5 rounded-b"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                      />
                    )}
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
                      style={isActive ? { background: 'rgba(99,102,241,0.15)' } : {}}
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
