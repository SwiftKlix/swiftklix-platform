import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, Check, Settings, Key, AlertCircle } from 'lucide-react';
import Logo from './Logo';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('changemaker'); // 'changemaker' or 'org_admin'
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(
    localStorage.getItem('swiftklix_google_client_id') || ''
  );
  const googleBtnRef = useRef(null);

  // Parse JWT token from Google Identity Services
  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse Google JWT payload', e);
      return null;
    }
  };

  const handleGoogleCredentialResponse = (response) => {
    if (!response || !response.credential) {
      setError('Google Sign-In did not return a valid credential token.');
      return;
    }

    const payload = parseGoogleJwt(response.credential);
    if (!payload || !payload.email) {
      setError('Unable to parse verified profile from Google.');
      return;
    }

    const verifiedUser = {
      name: payload.name || payload.given_name || 'Google User',
      email: payload.email,
      avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || payload.email)}&background=2563EB&color=fff`,
      role: 'user',
      accountType: 'Verified Google Changemaker',
      provider: 'google',
      googleId: payload.sub
    };

    // Save in registered users list
    try {
      const existing = JSON.parse(localStorage.getItem('swiftklix_registered_users') || '[]');
      if (!existing.some(u => u.email.toLowerCase() === verifiedUser.email.toLowerCase())) {
        existing.push(verifiedUser);
        localStorage.setItem('swiftklix_registered_users', JSON.stringify(existing));
      }
    } catch (e) {}

    onLogin(verifiedUser);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        try {
          const effectiveClientId = googleClientId.trim() || '715367623912-demo.apps.googleusercontent.com';
          window.google.accounts.id.initialize({
            client_id: effectiveClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false
          });

          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 360
          });
        } catch (err) {
          console.warn('Google GSI button initialization notice:', err);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  const handleManualGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      try {
        const effectiveClientId = googleClientId.trim() || '715367623912-demo.apps.googleusercontent.com';
        window.google.accounts.id.initialize({
          client_id: effectiveClientId,
          callback: handleGoogleCredentialResponse
        });
        window.google.accounts.id.prompt();
      } catch (e) {
        console.error(e);
      }
    } else {
      setError('Google Identity Service script is loading. Please check your internet connection or try again.');
    }
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    localStorage.setItem('swiftklix_google_client_id', googleClientId.trim());
    setShowConfig(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('swiftklix_registered_users') || '[]');

    if (authMode === 'signup') {
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      const userName = name.trim() || cleanEmail.split('@')[0];
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userName,
        email: cleanEmail,
        password: password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563EB&color=fff`,
        role: userRole === 'org_admin' ? 'admin' : 'user',
        accountType: userRole === 'org_admin' ? 'Organization Founder / Admin' : 'Student Changemaker & Volunteer',
        provider: 'email',
        createdAt: new Date().toISOString()
      };

      registeredUsers.push(newUser);
      localStorage.setItem('swiftklix_registered_users', JSON.stringify(registeredUsers));

      onLogin(newUser);
      onClose();
    } else {
      // Sign in mode
      const userMatch = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (userMatch && userMatch.password && userMatch.password !== password) {
        setError('Incorrect password. Please verify and try again.');
        return;
      }

      const userName = userMatch?.name || cleanEmail.split('@')[0];
      const loggedUser = {
        id: userMatch?.id || `usr-${Date.now()}`,
        name: userName,
        email: cleanEmail,
        avatar: userMatch?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563EB&color=fff`,
        role: userMatch?.role || (cleanEmail.includes('admin') || cleanEmail.includes('founder') ? 'admin' : 'user'),
        accountType: userMatch?.accountType || 'Changemaker & Volunteer',
        provider: 'email'
      };

      if (!userMatch) {
        registeredUsers.push({ ...loggedUser, password });
        localStorage.setItem('swiftklix_registered_users', JSON.stringify(registeredUsers));
      }

      onLogin(loggedUser);
      onClose();
    }
  };

  const handleDemoLogin = (roleType) => {
    if (roleType === 'org_admin') {
      onLogin({
        name: 'Jordan Rivera',
        email: 'jordan@ecoroots.org',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'admin',
        accountType: 'National Director (EcoRoots)',
        provider: 'demo'
      });
    } else {
      onLogin({
        name: 'Alex Morgan',
        email: 'alex.morgan@university.edu',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        role: 'user',
        accountType: 'Student Changemaker & Chapter Founder',
        provider: 'demo'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden text-xs max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors ${showConfig ? 'bg-slate-100 text-slate-800' : ''}`}
              title="Google OAuth Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 pt-4 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            {authMode === 'signin' ? "Welcome Back to SwiftKlix" : "Create Your SwiftKlix Account"}
          </h2>
          <p className="text-slate-500 text-[11px] mt-1 mb-5">
            {authMode === 'signin' 
              ? "Sign in with your verified Google account or registered credentials to access your dashboard."
              : "Create an account to track your chapter memberships, leadership roles, and applications."}
          </p>

          {/* Google OAuth Custom Client ID Config Drawer */}
          {showConfig && (
            <form onSubmit={handleSaveClientId} className="mb-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 text-[11px] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Custom Google OAuth Client ID</span>
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">Google Cloud</span>
              </div>
              <p className="text-[10px] text-blue-800 leading-relaxed">
                Paste your Google OAuth Client ID from Google Cloud Console (`console.cloud.google.com`) for production authentication.
              </p>
              <input
                type="text"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                className="w-full p-2 text-[11px] rounded-xl border border-blue-200 bg-white font-mono text-slate-800 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                >
                  Save Client ID
                </button>
              </div>
            </form>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-4 font-semibold text-xs">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-medium text-[11px] mb-3 text-left flex items-start gap-1.5 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Real Google Identity Services Sign-In Container */}
          <div className="space-y-2">
            <div id="googleSignInContainer" ref={googleBtnRef} className="flex justify-center min-h-[42px]"></div>

            {/* Fallback Direct Google One-Tap Trigger */}
            <button
              type="button"
              onClick={handleManualGooglePrompt}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center gap-2.5 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google One-Tap</span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-2 text-[10px] text-slate-400 uppercase font-bold">or with email</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {authMode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white font-medium focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div className="pt-1">
                <label className="block font-semibold text-slate-700 mb-1">Account Intent</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserRole('changemaker')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between ${
                      userRole === 'changemaker' ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-bold' : 'border-slate-200 text-slate-600 font-medium'
                    }`}
                  >
                    <span className="text-[11px]">Changemaker / Volunteer</span>
                    <span className="text-[9px] text-slate-400 font-normal mt-0.5">Found chapters or apply to roles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole('org_admin')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between ${
                      userRole === 'org_admin' ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-bold' : 'border-slate-200 text-slate-600 font-medium'
                    }`}
                  >
                    <span className="text-[11px]">Organization Leader</span>
                    <span className="text-[9px] text-slate-400 font-normal mt-0.5">Manage branches & candidates</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-2xs mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{authMode === 'signin' ? "Sign In" : "Create SwiftKlix Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-left">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
              Instant Demo Access:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDemoLogin('changemaker')}
                className="flex-1 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold text-center transition-colors"
              >
                Alex (Changemaker)
              </button>
              <button
                onClick={() => handleDemoLogin('org_admin')}
                className="flex-1 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-[11px] font-semibold text-center transition-colors"
              >
                Jordan (Org Admin)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
