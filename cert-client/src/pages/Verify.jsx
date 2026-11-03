import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import VerificationSkeleton from '../components/Skeleton.jsx';
import {
  CheckBadgeIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DownloadIcon,
  SpinnerIcon,
  CopyIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from '../components/Icons.jsx';

export const Verify = () => {
  const { id } = useParams();

  // State machine: 'loading' | 'found' | 'not_found' | 'network_error'
  const [viewState, setViewState] = useState('loading');
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch certificate details
  const fetchCertificate = useCallback(async () => {
    if (!id) {
      setViewState('not_found');
      setErrorMessage('No certificate ID was provided in the verification URL.');
      return;
    }

    setViewState('loading');
    setErrorMessage('');

    try {
      const response = await axiosClient.get(`/certificates/${encodeURIComponent(id.trim())}`);
      if (response.data && response.data.data) {
        setCertificate(response.data.data);
        setViewState('found');
      } else {
        setViewState('not_found');
        setErrorMessage('Certificate not found; it may be invalid or the ID might be incorrect.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      if (err.response && err.response.status === 404) {
        setViewState('not_found');
        setErrorMessage('Certificate not found; it may be invalid or the ID might be incorrect.');
      } else {
        // Network error, CORS, 500 or timeout
        setViewState('network_error');
        setErrorMessage(
          err.response?.data?.message ||
            'Unable to communicate with the verification server. Please check your internet connection.'
        );
      }
    }
  }, [id]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  // Formatted date helper: e.g. "12 March 2026"
  const formattedDate = certificate?.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Copy Certificate ID to clipboard
  const handleCopyId = async () => {
    if (!certificate?.certificateId) return;
    try {
      await navigator.clipboard.writeText(certificate.certificateId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (e) {
      console.error('Failed to copy ID:', e);
    }
  };

  // Safe Blob-based PDF download with cross-origin fallback
  const handleDownloadPdf = async () => {
    if (!certificate?.fileUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(certificate.fileUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Download request failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const cleanHolderName = certificate.holderName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanHolderName}-${certificate.certificateId}.pdf`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      console.warn('Direct blob download failed, falling back to opening in a new tab:', error);
      window.open(certificate.fileUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-grid-pattern min-h-screen flex flex-col text-slate-900">
      {/* Self-contained Standalone Top Header for the Verification View */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Developers' Community"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Official Credential Registry</span>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-6xl mx-auto w-full">
        {/* 1. Loading State */}
        {viewState === 'loading' && <VerificationSkeleton />}

        {/* 2. Not Found State */}
        {viewState === 'not_found' && (
          <div className="w-full max-w-xl mx-auto text-center bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <ExclamationTriangleIcon className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-amber-700 bg-amber-50 uppercase tracking-widest mb-2">
                Developers' Community Registry
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Certificate Not Found
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                {errorMessage || 'Certificate not found; it may be invalid or the ID might be incorrect.'}
              </p>
              {id && (
                <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-lg font-mono text-xs text-slate-700">
                  Queried ID: {id}
                </div>
              )}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={fetchCertificate}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Check Again
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-xs"
              >
                Search Another Certificate
              </Link>
            </div>
          </div>
        )}

        {/* 3. Network Error State */}
        {viewState === 'network_error' && (
          <div className="w-full max-w-xl mx-auto text-center bg-white rounded-2xl border border-red-200 shadow-xs p-8 sm:p-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <XCircleIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Verification Unavailable
              </h1>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                {errorMessage}
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={fetchCertificate}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Retry Verification
              </button>
            </div>
          </div>
        )}

        {/* 4. Found State (Valid or Revoked) */}
        {viewState === 'found' && certificate && (
          <div>
            {/* Status Header Banner */}
            <div className="mb-8" aria-live="polite">
              {certificate.status === 'revoked' ? (
                <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-6 sm:p-8 flex items-start sm:items-center space-x-4 shadow-xs">
                  <div className="p-3 bg-red-600 text-white rounded-xl shrink-0 shadow-sm">
                    <XCircleIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-200 text-red-900 mb-1">
                      Revoked Credential
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-red-950">
                      This Certificate Has Been Officially Revoked
                    </h1>
                    <p className="text-sm text-red-800 mt-1">
                      Notice: The issuing authority at Developers' Community has permanently revoked this certificate. It is no longer recognized.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-blue-200/90 p-6 sm:p-7 flex items-start sm:items-center space-x-4 shadow-xs">
                  <div className="p-3 bg-blue-600 text-white rounded-xl shrink-0 shadow-sm shadow-blue-500/20">
                    <CheckBadgeIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 mb-1">
                      Verified Credential
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Official Credential Verified
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      This digital record confirms the authenticity of the certificate issued by Developers' Community.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Certificate Details Card */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                  {/* Recipient / Holder */}
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Certificate Recipient
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {certificate.holderName}
                    </div>
                  </div>

                  {/* Course / Credential Title */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Program / Credential Title
                    </span>
                    <div className="text-lg font-bold text-slate-800 mt-1">
                      {certificate.courseOrTitle}
                    </div>
                  </div>

                  {/* Issue Date & Status */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Issue Date
                      </span>
                      <div className="text-sm font-semibold text-slate-800 mt-1">
                        {formattedDate}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Registry Status
                      </span>
                      <div className="mt-1 flex items-center space-x-1.5">
                        {certificate.status === 'revoked' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            Valid & Active
                          </span>
                        )}
                        {certificate.certificateType && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {certificate.certificateType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Certificate ID with Copy Action */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Unique Certificate ID
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 focus:outline-none"
                        aria-label="Copy Certificate ID to clipboard"
                      >
                        {copiedId ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-blue-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 tracking-wide select-all">
                      {certificate.certificateId}
                    </div>
                  </div>

                  {/* Desktop Download Button */}
                  <div className="hidden md:block pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs"
                    >
                      {isDownloading ? (
                        <>
                          <SpinnerIcon className="w-5 h-5 mr-2" />
                          Fetching PDF Document...
                        </>
                      ) : (
                        <>
                          <DownloadIcon className="w-5 h-5 mr-2" />
                          Download Soft Copy (PDF)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Medium & Large Screen PDF Viewer */}
              <div className="hidden md:block md:col-span-7">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <DocumentTextIcon className="w-4 h-4 text-slate-400" />
                      <span>Document Preview</span>
                    </div>
                    <a
                      href={certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Open in Full Window &rarr;
                    </a>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-[640px]">
                    <iframe
                      src={`${certificate.fileUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-full border-none"
                      title={`Certificate Preview for ${certificate.holderName}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-20 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 transition-all shadow-xs"
              >
                {isDownloading ? (
                  <>
                    <SpinnerIcon className="w-5 h-5 mr-2" />
                    Downloading PDF...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Soft Copy (PDF)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Verification Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Developers' Community &bull; Verifiable Credential Protocol
      </footer>
    </div>
  );
};

export default Verify;
