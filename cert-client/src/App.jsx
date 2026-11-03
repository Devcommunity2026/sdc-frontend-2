import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Verify from './pages/Verify.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import { CheckBadgeIcon, ExternalLinkIcon, LockClosedIcon } from './components/Icons.jsx';

// "Find My Certificates" Search Portal
const CertificateSearchPortal = () => {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/verify/${encodeURIComponent(certId.trim())}`);
    }
  };

  return (
    <div className="bg-grid-pattern min-h-screen flex flex-col justify-between text-slate-900">
      {/* Sleek Top Header with Logo & Admin Access */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Developers' Community"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Official Credential Registry</span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-colors"
            >
              <LockClosedIcon className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main "Find My Certificates" Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl mx-auto text-center space-y-8 bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xs">
            <CheckBadgeIcon className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-blue-600 bg-blue-50 uppercase tracking-widest mb-3">
              SOFTWARE DEVELOPERS' COMMUNITY
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Find My Certificates
            </h1>
            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Enter your unique Certificate ID to verify its authenticity, inspect official verification credentials, and view or download the verified PDF certificate.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                required
                placeholder="e.g. SDC-PART-2026-X8K9 or CERT-TEST-001"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Find & Verify &rarr;
              </button>
            </div>
          </form>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Powered by SDC Credential Protocol</span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-300">•</span>
              <Link
                to="/verify/CERT-TEST-001"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                View Sample Certificate <ExternalLinkIcon className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Software Developers' Community &bull; Verifiable Credential Protocol
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Verification Route - Scanned from QR Code or Searched */}
          <Route path="/verify/:id" element={<Verify />} />

          {/* Certificate Admin Login */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected Admin Console for Generating & Publishing Certificates */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root Certificate Verification Lookup / "Find My Certificates" */}
          <Route path="/" element={<CertificateSearchPortal />} />
          <Route path="/find" element={<CertificateSearchPortal />} />
          <Route path="/search" element={<CertificateSearchPortal />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
