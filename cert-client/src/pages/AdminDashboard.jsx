import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CloudArrowUpIcon,
  CheckBadgeIcon,
  CopyIcon,
  CheckIcon,
  DownloadIcon,
  ExternalLinkIcon,
  SpinnerIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from '../components/Icons.jsx';

export const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'single' | 'bulk' | 'custom'
  const [activeTab, setActiveTab] = useState('single');

  // Single Generation Form State
  const [holderName, setHolderName] = useState('');
  const [courseOrTitle, setCourseOrTitle] = useState('');
  const [certificateType, setCertificateType] = useState('participation');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [certificateId, setCertificateId] = useState('');

  // Bulk Generation State
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const bulkFileInputRef = useRef(null);

  // Custom PDF Upload State (Legacy)
  const [customFile, setCustomFile] = useState(null);
  const customFileInputRef = useRef(null);

  // UI & Feedback State
  const [clientErrors, setClientErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Success State for Single Generation
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ================= 1. SINGLE GENERATION SUBMIT =================
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errors = {};

    if (!holderName.trim()) {
      errors.holderName = 'Recipient / Holder name is required.';
    }
    if (!courseOrTitle.trim()) {
      errors.courseOrTitle = 'Course or event title is required.';
    }
    if (!issueDate) {
      errors.issueDate = 'Issue date is required.';
    }
    if (certificateId.trim() && !/^[a-zA-Z0-9_-]+$/.test(certificateId.trim())) {
      errors.certificateId =
        'Custom ID can only contain alphanumeric characters, hyphens, and underscores.';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const response = await axiosClient.post('/certificates/generate-single', {
        holderName: holderName.trim(),
        courseOrTitle: courseOrTitle.trim(),
        certificateType,
        issueDate,
        certificateId: certificateId.trim() || undefined,
      });

      setUploadProgress(100);
      setCreatedResult(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to generate certificate. Please verify inputs.';
      setApiError(message);
    } finally {
      setIsUploading(false);
    }
  };

  // ================= 2. BULK GENERATION SUBMIT =================
  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    setBulkError('');
    if (!file) {
      setBulkFile(null);
      return;
    }

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isExtensionValid) {
      setBulkError('Please select a valid Excel spreadsheet (.xlsx, .xls) or CSV (.csv) file.');
      setBulkFile(null);
      return;
    }

    setBulkFile(file);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      setBulkError('Please select an Excel file to upload.');
      return;
    }

    setBulkError('');
    setIsBulkLoading(true);
    setBulkResult(null);

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const response = await axiosClient.post('/certificates/generate-bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBulkResult(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Bulk certificate generation failed. Check spreadsheet format.';
      setBulkError(message);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axiosClient.get('/certificates/template/excel', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'sdc_certificate_bulk_template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to download Excel template. Please try again.');
    }
  };

  // ================= 3. CUSTOM PDF UPLOAD SUBMIT =================
  const handleCustomFileChange = (e) => {
    const file = e.target.files[0];
    setClientErrors((prev) => ({ ...prev, file: '' }));

    if (!file) {
      setCustomFile(null);
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setClientErrors((prev) => ({ ...prev, file: 'Selected file must be a PDF document.' }));
      setCustomFile(null);
      return;
    }

    setCustomFile(file);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errors = {};

    if (!holderName.trim()) errors.holderName = 'Recipient name is required.';
    if (!courseOrTitle.trim()) errors.courseOrTitle = 'Course or event title is required.';
    if (!issueDate) errors.issueDate = 'Issue date is required.';
    if (!customFile) errors.file = 'Please select a certificate PDF file to upload.';

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('holderName', holderName.trim());
    formData.append('courseOrTitle', courseOrTitle.trim());
    formData.append('issueDate', issueDate);
    formData.append('certificateType', certificateType);
    if (certificateId.trim()) formData.append('certificateId', certificateId.trim());
    formData.append('file', customFile);

    try {
      const response = await axiosClient.post('/certificates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      setCreatedResult(response.data.data);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to upload certificate.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (createdResult?.verifyUrl) {
      navigator.clipboard.writeText(createdResult.verifyUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleResetForm = () => {
    setCreatedResult(null);
    setHolderName('');
    setCourseOrTitle('');
    setCertificateId('');
    setCustomFile(null);
    setApiError('');
    setClientErrors({});
    if (customFileInputRef.current) customFileInputRef.current.value = '';
  };

  return (
    <div className="bg-grid-pattern min-h-screen flex flex-col justify-between text-slate-900">
      {/* Top Header */}
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
            <Link
              to="/"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              &larr; Public Search
            </Link>

            <span className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>{admin?.email || 'Admin Console'}</span>
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold text-blue-600 bg-blue-50 uppercase tracking-widest mb-1.5">
              PUBLISHING WORKSPACE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Certificate Publishing & Generation
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Generate verifiable PDF certificates with embedded QR codes, upload to Cloudinary, and register credentials.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => {
                setActiveTab('single');
                setCreatedResult(null);
                setBulkResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Generation
            </button>
            <button
              onClick={() => {
                setActiveTab('bulk');
                setCreatedResult(null);
                setBulkResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bulk'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulk Excel Generation
            </button>
            <button
              onClick={() => {
                setActiveTab('custom');
                setCreatedResult(null);
                setBulkResult(null);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Upload PDF (Custom)
            </button>
          </div>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold">Publication Error</p>
              <p className="mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: SINGLE GENERATION */}
        {/* ======================================================== */}
        {activeTab === 'single' && (
          <div>
            {!createdResult ? (
              <form onSubmit={handleSingleSubmit} className="space-y-6">
                <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  {/* Step 1: Certificate Type Selector (3 Types) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      1. Select Certificate Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Participation */}
                      <button
                        type="button"
                        onClick={() => setCertificateType('participation')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          certificateType === 'participation'
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">🏅</span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              certificateType === 'participation'
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-slate-300'
                            }`}
                          >
                            {certificateType === 'participation' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            )}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-slate-900">Participation</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bootcamps, workshops, event attendees
                        </p>
                      </button>

                      {/* Merit */}
                      <button
                        type="button"
                        onClick={() => setCertificateType('merit')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          certificateType === 'merit'
                            ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">🏆</span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              certificateType === 'merit'
                                ? 'border-amber-600 bg-amber-600'
                                : 'border-slate-300'
                            }`}
                          >
                            {certificateType === 'merit' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            )}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-slate-900">Excellence / Merit</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hackathon winners, top rankers, awards
                        </p>
                      </button>

                      {/* Appreciation */}
                      <button
                        type="button"
                        onClick={() => setCertificateType('appreciation')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          certificateType === 'appreciation'
                            ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">🌟</span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              certificateType === 'appreciation'
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-slate-300'
                            }`}
                          >
                            {certificateType === 'appreciation' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            )}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-slate-900">Appreciation</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Guest speakers, mentors, core committee
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Recipient & Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Recipient Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                          clientErrors.holderName ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {clientErrors.holderName && (
                        <p className="text-[11px] text-red-600 mt-1">{clientErrors.holderName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Course or Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Full-Stack Web Development Bootcamp"
                        value={courseOrTitle}
                        onChange={(e) => setCourseOrTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                          clientErrors.courseOrTitle ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {clientErrors.courseOrTitle && (
                        <p className="text-[11px] text-red-600 mt-1">{clientErrors.courseOrTitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Dates & Custom ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Issue Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Custom Certificate ID <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty to auto-generate (recommended)"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Auto-format: SDC-{certificateType.toUpperCase().slice(0, 4)}-{new Date().getFullYear()}-XXXX
                      </p>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap gap-4 text-xs text-slate-600">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Embedded Verification QR Code</span>
                    </span>
                    <span className="flex items-center space-x-1.5 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Automated Cloudinary PDF Storage</span>
                    </span>
                    <span className="flex items-center space-x-1.5 font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Real-Time Database Registration</span>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating PDF, QR Code & Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-5 h-5" />
                        <span>Generate & Publish Certificate &rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Card */
              <div className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                      <CheckIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Certificate Published Successfully!
                      </h2>
                      <p className="text-xs text-slate-500">
                        The PDF was generated with an embedded verification QR code and registered in the registry.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    + Issue Another Certificate
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* QR Code Preview */}
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <img
                      src={createdResult.qrCodeDataUrl}
                      alt="Verification QR Code"
                      className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-xs"
                    />
                    <p className="text-[11px] font-semibold text-slate-700">Official Verification QR</p>
                    <p className="text-[10px] text-slate-400">Embedded in the generated certificate</p>
                  </div>

                  {/* Certificate Summary */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Recipient Name
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {createdResult.certificate.holderName}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Certificate ID
                        </span>
                        <span className="font-mono font-bold text-blue-600 text-sm">
                          {createdResult.certificate.certificateId}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Course / Title
                        </span>
                        <span className="font-semibold text-slate-800">
                          {createdResult.certificate.courseOrTitle}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Certificate Type
                        </span>
                        <span className="capitalize font-semibold text-emerald-700">
                          {createdResult.certificate.certificateType || 'Participation'}
                        </span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <a
                        href={createdResult.certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs inline-flex items-center space-x-1.5"
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>View Cloudinary PDF</span>
                        <ExternalLinkIcon className="w-3.5 h-3.5 ml-1" />
                      </a>

                      <Link
                        to={`/verify/${createdResult.certificate.certificateId}`}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200 inline-flex items-center space-x-1.5"
                      >
                        <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
                        <span>Public Verification Page</span>
                      </Link>

                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200 inline-flex items-center space-x-1.5 cursor-pointer"
                      >
                        <CopyIcon className="w-4 h-4" />
                        <span>{copiedUrl ? 'Copied Link!' : 'Copy Verify URL'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BULK EXCEL GENERATION */}
        {/* ======================================================== */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Bulk Certificate Issuance via Spreadsheet
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Upload an Excel spreadsheet (.xlsx, .xls) or CSV. The server will generate official PDF certificates for each row with embedded QR codes, upload them to Cloudinary, and register each record in MongoDB.
                </p>
              </div>

              {/* Step 1: Download Template */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-blue-900">Step 1: Download Standard Template</p>
                  <p className="text-xs text-blue-700">
                    Pre-configured columns for Recipient Name, Event Title, Type (participation, merit, appreciation), and Date.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0 inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download Excel Template</span>
                </button>
              </div>

              {/* Step 2: Upload File */}
              <form onSubmit={handleBulkSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Step 2: Upload Filled Spreadsheet (.xlsx, .xls, .csv)
                  </label>
                  <div
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <input
                      ref={bulkFileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                      onChange={handleBulkFileChange}
                      className="hidden"
                    />

                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                      <CloudArrowUpIcon className="w-6 h-6" />
                    </div>

                    {bulkFile ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900">{bulkFile.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(bulkFile.size / 1024).toFixed(1)} KB &bull; Ready to process
                        </p>
                        <span className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline">
                          Click to select a different file
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Click to browse or drag and drop your spreadsheet here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supported formats: .xlsx, .xls, .csv (Up to 300 certificates per batch)
                        </p>
                      </div>
                    )}
                  </div>

                  {bulkError && <p className="text-xs text-red-600 mt-2 font-medium">{bulkError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={!bulkFile || isBulkLoading}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isBulkLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Batch & Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span>Start Bulk Generation &rarr;</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bulk Results Table */}
            {bulkResult && (
              <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Bulk Generation Summary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Finished processing spreadsheet rows.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {bulkResult.successCount} Succeeded
                    </span>
                    {bulkResult.errorCount > 0 && (
                      <span className="px-3 py-1 rounded-full font-bold bg-red-50 text-red-700 border border-red-200">
                        {bulkResult.errorCount} Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Table of Issued Certificates */}
                {bulkResult.certificates && bulkResult.certificates.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Recipient</th>
                          <th className="py-2.5 px-3">Course / Event</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Certificate ID</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkResult.certificates.map((cert, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-3 px-3 font-bold text-slate-800">{cert.holderName}</td>
                            <td className="py-3 px-3 text-slate-600">{cert.courseOrTitle}</td>
                            <td className="py-3 px-3">
                              <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {cert.certificateType}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                              {cert.certificateId}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <a
                                href={cert.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                              >
                                PDF <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
                              </a>
                              <Link
                                to={`/verify/${cert.certificateId}`}
                                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
                              >
                                Verify
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Error Rows List */}
                {bulkResult.errors && bulkResult.errors.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Failed Rows ({bulkResult.errors.length})
                    </p>
                    <div className="space-y-1.5">
                      {bulkResult.errors.map((errItem, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex justify-between"
                        >
                          <span>
                            <strong>Row {errItem.rowNumber}:</strong> {errItem.holderName || 'Unnamed'}
                          </span>
                          <span className="font-semibold">{errItem.error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CUSTOM PDF UPLOAD (LEGACY OPTION) */}
        {/* ======================================================== */}
        {activeTab === 'custom' && (
          <div>
            {!createdResult ? (
              <form onSubmit={handleCustomSubmit} className="space-y-6">
                <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Upload Custom Pre-Made PDF Certificate
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      If you already designed an external PDF certificate, upload the document directly here.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Recipient Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Course or Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={courseOrTitle}
                        onChange={(e) => setCourseOrTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Issue Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Custom Certificate ID <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Certificate PDF File <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => customFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                    >
                      <input
                        ref={customFileInputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleCustomFileChange}
                        className="hidden"
                      />

                      <DocumentTextIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      {customFile ? (
                        <p className="text-sm font-bold text-slate-900">{customFile.name}</p>
                      ) : (
                        <p className="text-xs text-slate-500">Click to select PDF certificate (Max 5 MB)</p>
                      )}
                    </div>
                    {clientErrors.file && (
                      <p className="text-[11px] text-red-600 mt-1">{clientErrors.file}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                  >
                    {isUploading ? 'Uploading & Registering...' : 'Upload & Register PDF'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-white rounded-3xl border border-emerald-200 text-center space-y-4">
                <p className="text-emerald-600 font-bold">Certificate Uploaded Successfully!</p>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Upload Another
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Software Developers' Community &bull; Verifiable Credential Protocol
      </footer>
    </div>
  );
};

export default AdminDashboard;
