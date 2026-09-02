import React, { useState } from 'react';
import { Menu, X, SlidersHorizontal, LogIn, LogOut, Building2, Plus, User, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user,
  onOpenAuth,
  onLogout,
  openGoalDrawer,
  onOpenAboutSwiftKlix,
  onOpenUserProfile,
  pendingOrgsCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isPlatformAdmin = user && (
    user.email?.toLowerCase().includes('swiftklix') || 
    user.email?.toLowerCase() === 'swiftklix1@gmail.com' || 
    user.role === 'admin' || 
    user.accountType === 'admin'
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & What is SwiftKlix Breakdown Trigger */}
          <div className="flex items-center gap-8">
            <button 
              onClick={onOpenAboutSwiftKlix}
              title="Click to learn What is SwiftKlix"
              className="text-left focus:outline-none group flex items-center gap-2 cursor-pointer"
            >
              <Logo />
              <span className="hidden lg:inline text-[10px] font-bold text-slate-500 group-hover:text-blue-700 bg-slate-100 group-hover:bg-blue-50 px-2 py-0.5 rounded-full transition-colors">
                What is SwiftKlix?
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setCurrentTab('explore')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'explore'
                    ? 'text-slate-900 font-bold bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Organizations
              </button>

              <button
                onClick={() => setCurrentTab('opportunities')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'opportunities'
                    ? 'text-slate-900 font-bold bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Start a Branch
              </button>

              <button
                onClick={() => setCurrentTab('positions')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'positions'
                    ? 'text-slate-900 font-bold bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Positions
              </button>

              <button
                onClick={() => setCurrentTab('my_applications')}
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  currentTab === 'my_applications' || currentTab === 'my_dashboard'
                    ? 'text-slate-900 font-bold bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Dashboard
              </button>

              {isPlatformAdmin && (
                <button
                  onClick={() => setCurrentTab('admin_review')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                    currentTab === 'admin_review'
                      ? 'text-blue-900 font-bold bg-blue-100'
                      : 'text-blue-700 hover:bg-blue-50 font-semibold'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>HQ Review</span>
                  {pendingOrgsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black text-[10px] animate-pulse">
                      {pendingOrgsCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Right-Side Settings & Profile Menu */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer"
                >
                  <span>{user.name ? user.name.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'Account')}</span>
                  <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-xs text-slate-700 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 truncate">{user.name || 'Community Member'}</p>
                        {isPlatformAdmin && (
                          <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">HQ Admin</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">{user.email || 'user@example.org'}</p>
                    </div>

                    {isPlatformAdmin && (
                      <button
                        onClick={() => { setCurrentTab('admin_review'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 font-bold flex items-center justify-between text-blue-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Platform Review Portal</span>
                        </div>
                        {pendingOrgsCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                            {pendingOrgsCount}
                          </span>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => { onOpenUserProfile && onOpenUserProfile(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-900 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>My Profile (Profile Showcase)</span>
                    </button>

                    <button
                      onClick={() => { setCurrentTab('my_org'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Organization Dashboard</span>
                    </button>

                    <button
                      onClick={() => { setCurrentTab('my_applications'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      <span>My Applications & Drafts</span>
                    </button>

                    <button
                      onClick={() => { openGoalDrawer(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-700"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                      <span>Preferences & Settings</span>
                    </button>

                    <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                      <button
                        onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAboutSwiftKlix}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>What is SwiftKlix?</span>
                </button>

                <button
                  onClick={openGoalDrawer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 text-sm font-medium">
          <button
            onClick={() => { onOpenAboutSwiftKlix(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-blue-800 bg-blue-50/70 font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>What is SwiftKlix?</span>
          </button>
          <button
            onClick={() => { setCurrentTab('explore'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${currentTab === 'explore' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Organizations
          </button>
          <button
            onClick={() => { setCurrentTab('opportunities'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${currentTab === 'opportunities' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Start a Branch
          </button>
          <button
            onClick={() => { setCurrentTab('positions'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${currentTab === 'positions' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Positions
          </button>
          <button
            onClick={() => { setCurrentTab('my_applications'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${currentTab === 'my_applications' || currentTab === 'my_dashboard' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
          >
            My Dashboard
          </button>
          <button
            onClick={() => { setCurrentTab('my_org'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg ${currentTab === 'my_org' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
          >
            My Organization Hub
          </button>
          {isPlatformAdmin && (
            <button
              onClick={() => { setCurrentTab('admin_review'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${currentTab === 'admin_review' ? 'bg-blue-100 font-bold text-blue-900' : 'bg-blue-50 text-blue-800'}`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>HQ Organization Review</span>
              </div>
              {pendingOrgsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                  {pendingOrgsCount}
                </span>
              )}
            </button>
          )}
          {user && (
            <button
              onClick={() => { onOpenUserProfile(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>My Changemaker Profile</span>
            </button>
          )}
          <button
            onClick={() => { openGoalDrawer(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Preferences & Settings</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                <span>Signed in as <strong>{user.name || user.email || 'Member'}</strong></span>
                <button onClick={onLogout} className="text-red-600 font-bold">Log out</button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold text-center"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

