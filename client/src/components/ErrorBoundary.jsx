import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SwiftKlix UI Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('SwiftKlix_diagnostic');
      localStorage.removeItem('swiftklix_diagnostic');
    } catch (e) {}
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="clean-card p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">SwiftKlix Interface Sync</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              We encountered a temporary interface sync state. Click below to refresh smoothly.
            </p>
            {this.state.error && (
              <p className="text-[10px] text-slate-400 font-mono bg-slate-50 p-2 rounded-xl border border-slate-200 text-left truncate">
                {String(this.state.error.message || this.state.error)}
              </p>
            )}
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleHardReset}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
