import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/adminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminPanel from "../../components/admin/AdminPanel";
import {
  Award,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import Button from "../../components/ui/Button";

const CertificateDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // Active Tab: 'single' | 'bulk' | 'custom' | 'list'
  const [activeTab, setActiveTab] = useState("single");

  // Single Generation Form State
  const [holderName, setHolderName] = useState("");
  const [courseOrTitle, setCourseOrTitle] = useState("");
  const [certificateType, setCertificateType] = useState("internship");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [certificateId, setCertificateId] = useState("");

  // Bulk Generation State
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const bulkFileInputRef = useRef(null);

  // Custom PDF State
  const [customFile, setCustomFile] = useState(null);
  const customFileInputRef = useRef(null);

  // Status & Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Certificate Registry List State
  const [certificatesList, setCertificatesList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchCertificatesList = async () => {
    try {
      setListLoading(true);
      const url = `${API_URL}/api/certificates?limit=50${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}${typeFilter !== "All" ? `&type=${typeFilter}` : ""}`;
      const res = await axios.get(url, { withCredentials: true });
      if (res.data && res.data.data) {
        setCertificatesList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load certificates registry:", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchCertificatesList();
    }
  }, [activeTab, typeFilter]);

  // ================= 1. SINGLE GENERATION =================
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!holderName.trim() || !courseOrTitle.trim()) {
      setApiError("Please fill in Full Name and Position.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/certificates/generate-single`,
        {
          holderName: holderName.trim(),
          courseOrTitle: courseOrTitle.trim(),
          certificateType,
          startDate,
          endDate: endDate || undefined,
          issueDate: startDate,
          certificateId: certificateId.trim() || undefined,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCreatedResult(res.data.data);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to generate certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= 2. BULK GENERATION =================
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      setBulkError("Please select an Excel file (.xlsx) to upload.");
      return;
    }

    setBulkError("");
    setIsBulkLoading(true);
    setBulkResult(null);

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const res = await axios.post(`${API_URL}/api/certificates/generate-bulk`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setBulkResult(res.data.data);
      }
    } catch (err) {
      setBulkError(err.response?.data?.message || "Bulk certificate generation failed.");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/certificates/template/excel`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "sdc_certificate_bulk_template.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      // Fallback to static template in public/
      const link = document.createElement("a");
      link.href = "/sdc_certificate_bulk_template.xlsx";
      link.download = "sdc_certificate_bulk_template.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // ================= 3. CUSTOM PDF UPLOAD =================
  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!customFile) {
      setApiError("Please select a PDF file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("holderName", holderName.trim());
    formData.append("courseOrTitle", courseOrTitle.trim());
    formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    formData.append("issueDate", startDate);
    formData.append("certificateType", certificateType);
    if (certificateId.trim()) formData.append("certificateId", certificateId.trim());
    formData.append("file", customFile);

    try {
      const res = await axios.post(`${API_URL}/api/certificates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        setCreatedResult(res.data.data);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to upload custom certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (createdResult?.verifyUrl) {
      navigator.clipboard.writeText(createdResult.verifyUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const resetSingleForm = () => {
    setCreatedResult(null);
    setHolderName("");
    setCourseOrTitle("");
    setCertificateId("");
    setEndDate("");
    setCustomFile(null);
    setApiError("");
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        <AdminPageHeader
          icon={Award}
          title="Certificate Publishing Console"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/certificates"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-xs font-semibold text-foreground dark:text-dark-foreground hover:bg-secondary transition-all shadow-xs"
              >
                <span>Public Lookup</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          }
        />

        {/* Mode Navigation Tabs */}
        <AdminPanel className="p-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "single", label: "Single Generation", icon: Plus },
              { id: "bulk", label: "Bulk Excel Generation", icon: FileSpreadsheet },
              { id: "list", label: "Issued Registry", icon: FileText },
              { id: "custom", label: "Upload Custom PDF", icon: UploadCloud },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setApiError("");
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary/60 dark:bg-dark-secondary/60 text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </AdminPanel>

        {apiError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-bold">Error Publishing Certificate</p>
              <p className="mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* ================= TAB 1: SINGLE GENERATION ================= */}
        {activeTab === "single" && (
          <AdminPanel className="p-6 sm:p-8 space-y-6">
            {!createdResult ? (
              <form onSubmit={handleSingleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground dark:text-dark-foreground">
                    Select Certificate
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {[
                      {
                        type: "internship",
                        emoji: "💼",
                        title: "Internship",
                        color: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      },
                      {
                        type: "merit",
                        emoji: "🏆",
                        title: "Excellence / Merit",
                        color: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      },
                      {
                        type: "appreciation",
                        emoji: "🌟",
                        title: "Appreciation",
                        color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setCertificateType(item.type)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          certificateType === item.type
                            ? `${item.color} ring-2 ring-primary/30`
                            : "border-border dark:border-dark-border bg-card dark:bg-dark-card hover:bg-secondary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{item.emoji}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              certificateType === item.type ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          />
                        </div>
                        <p className="font-bold text-sm text-foreground dark:text-dark-foreground mt-2">{item.title}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-border dark:border-dark-border">
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Position"
                      value={courseOrTitle}
                      onChange={(e) => setCourseOrTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      placeholder="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    placeholder="Certificate ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary shadow-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Award size={18} />
                  <span>{isLoading ? "Generating..." : "Generate Certificate"}</span>
                </Button>
              </form>
            ) : (
              /* Success View */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">
                        Certificate Published Successfully!
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                        PDF generated with embedded verification QR code and registered in MongoDB.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={resetSingleForm}
                    variant="outline"
                    className="border-border dark:border-dark-border text-xs self-start sm:self-auto"
                  >
                    + Issue Another Certificate
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="p-4 bg-secondary/40 dark:bg-dark-secondary/40 rounded-2xl border border-border dark:border-dark-border text-center space-y-2">
                    <img
                      src={createdResult.qrCodeDataUrl}
                      alt="Verification QR Code"
                      className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs"
                    />
                    <p className="text-xs font-bold text-foreground dark:text-dark-foreground">Official Verification QR</p>
                    <p className="text-[10px] text-muted-foreground dark:text-dark-muted-foreground">Embedded on the PDF</p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-secondary/30 dark:bg-dark-secondary/30 rounded-xl border border-border dark:border-dark-border">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Recipient</span>
                        <span className="font-extrabold text-foreground dark:text-dark-foreground text-sm">
                          {createdResult.certificate.holderName}
                        </span>
                      </div>
                      <div className="p-3 bg-secondary/30 dark:bg-dark-secondary/30 rounded-xl border border-border dark:border-dark-border">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Certificate ID</span>
                        <span className="font-mono font-bold text-primary dark:text-dark-primary text-sm">
                          {createdResult.certificate.certificateId}
                        </span>
                      </div>
                      <div className="p-3 bg-secondary/30 dark:bg-dark-secondary/30 rounded-xl border border-border dark:border-dark-border">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Position</span>
                        <span className="font-semibold text-foreground dark:text-dark-foreground">
                          {createdResult.certificate.courseOrTitle}
                        </span>
                      </div>
                      <div className="p-3 bg-secondary/30 dark:bg-dark-secondary/30 rounded-xl border border-border dark:border-dark-border">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Type</span>
                        <span className="capitalize font-semibold text-primary dark:text-dark-primary">
                          {createdResult.certificate.certificateType}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <a
                        href={createdResult.certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:opacity-90 transition-all"
                      >
                        <FileText size={14} />
                        <span>View Cloudinary PDF</span>
                        <ExternalLink size={12} />
                      </a>

                      <Link
                        to={`/certificates/${createdResult.certificate.certificateId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary dark:bg-dark-secondary text-foreground dark:text-dark-foreground border border-border dark:border-dark-border font-semibold text-xs hover:bg-muted transition-all"
                      >
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Public Verification Page</span>
                      </Link>

                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary dark:bg-dark-secondary text-foreground dark:text-dark-foreground border border-border dark:border-dark-border font-semibold text-xs hover:bg-muted transition-all cursor-pointer"
                      >
                        {copiedUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span>{copiedUrl ? "Copied!" : "Copy Verify URL"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AdminPanel>
        )}

        {/* ================= TAB 2: BULK EXCEL GENERATION ================= */}
        {activeTab === "bulk" && (
          <div className="space-y-6">
            <AdminPanel className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground dark:text-dark-foreground">
                  Bulk Certificate via Spreadsheet (.xlsx)
                </h3>
              </div>

              {/* Template Download */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm font-bold text-primary dark:text-dark-primary">Download Excel Template</p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Excel Template</span>
                </button>
              </div>

              {/* Upload */}
              <form onSubmit={handleBulkSubmit} className="space-y-5">
                <div>
                  <div
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="border-2 border-dashed border-border dark:border-dark-border hover:border-primary rounded-2xl p-8 text-center bg-secondary/20 dark:bg-dark-secondary/20 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <input
                      ref={bulkFileInputRef}
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => {
                        setBulkError("");
                        setBulkFile(e.target.files[0] || null);
                      }}
                      className="hidden"
                    />

                    <div className="w-12 h-12 bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary rounded-2xl mx-auto flex items-center justify-center mb-3">
                      <UploadCloud size={24} />
                    </div>

                    {bulkFile ? (
                      <div>
                        <p className="text-sm font-bold text-foreground dark:text-dark-foreground">{bulkFile.name}</p>
                        <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-0.5">
                          {(bulkFile.size / 1024).toFixed(1)} KB • Ready to process
                        </p>
                        <span className="inline-block mt-2 text-xs font-semibold text-primary dark:text-dark-primary hover:underline">
                          Click to select a different file
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                          Click to browse or drag and drop spreadsheet here (.xlsx)
                        </p>
                      </div>
                    )}
                  </div>

                  {bulkError && <p className="text-xs text-red-500 font-medium mt-2">{bulkError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={!bulkFile || isBulkLoading}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileSpreadsheet size={18} />
                  <span>{isBulkLoading ? "Processing Batch & Uploading to Cloudinary..." : "Start Bulk Generation"}</span>
                </Button>
              </form>
            </AdminPanel>

            {/* Results */}
            {bulkResult && (
              <AdminPanel className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border dark:border-dark-border">
                  <div>
                    <h3 className="text-base font-bold text-foreground dark:text-dark-foreground">
                      Bulk Generation Summary
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                      Processed {bulkResult.totalRows} spreadsheet rows.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {bulkResult.successCount} Succeeded
                    </span>
                    {bulkResult.errorCount > 0 && (
                      <span className="px-3 py-1 rounded-full font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {bulkResult.errorCount} Failed
                      </span>
                    )}
                  </div>
                </div>

                {bulkResult.certificates && bulkResult.certificates.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border dark:border-dark-border text-muted-foreground uppercase tracking-wider">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Full Name</th>
                          <th className="py-2.5 px-3">Position</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Certificate ID</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 dark:divide-dark-border/50">
                        {bulkResult.certificates.map((cert, idx) => (
                          <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-3 text-muted-foreground font-mono">{idx + 1}</td>
                            <td className="py-3 px-3 font-bold text-foreground dark:text-dark-foreground">{cert.holderName}</td>
                            <td className="py-3 px-3 text-muted-foreground dark:text-dark-muted-foreground">{cert.courseOrTitle}</td>
                            <td className="py-3 px-3">
                              <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary">
                                {cert.certificateType}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-primary dark:text-dark-primary">
                              {cert.certificateId}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <a
                                href={cert.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary dark:text-dark-primary hover:underline font-semibold"
                              >
                                PDF <ExternalLink size={11} className="ml-0.5" />
                              </a>
                              <Link
                                to={`/certificates/${cert.certificateId}`}
                                target="_blank"
                                className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
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
              </AdminPanel>
            )}
          </div>
        )}

        {/* ================= TAB 3: ISSUED REGISTRY ================= */}
        {activeTab === "list" && (
          <AdminPanel className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by recipient name, title, or certificate ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchCertificatesList()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-xs focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="participation">Participation</option>
                  <option value="merit">Excellence / Merit</option>
                  <option value="appreciation">Appreciation</option>
                </select>

                <button
                  onClick={fetchCertificatesList}
                  className="p-2.5 rounded-xl border border-border dark:border-dark-border bg-secondary hover:bg-muted text-foreground transition-colors cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {listLoading ? (
              <div className="py-12 text-center text-muted-foreground text-xs animate-pulse">
                Loading credential registry records...
              </div>
            ) : certificatesList.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                No issued certificates found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border dark:border-dark-border text-muted-foreground uppercase tracking-wider">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Position / Program</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Certificate ID</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 dark:divide-dark-border/50">
                    {certificatesList.map((cert, idx) => (
                      <tr key={cert.certificateId || idx} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3 text-muted-foreground font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-foreground dark:text-dark-foreground">{cert.holderName}</td>
                        <td className="py-3 px-3 text-muted-foreground dark:text-dark-muted-foreground">{cert.courseOrTitle}</td>
                        <td className="py-3 px-3">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary">
                            {cert.certificateType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-primary dark:text-dark-primary">
                          {cert.certificateId}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                              cert.status === "revoked"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {cert.status || "valid"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary dark:text-dark-primary hover:underline font-semibold"
                          >
                            PDF <ExternalLink size={11} className="ml-0.5" />
                          </a>
                          <Link
                            to={`/certificates/${cert.certificateId}`}
                            target="_blank"
                            className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
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
          </AdminPanel>
        )}

        {/* ================= TAB 4: CUSTOM PDF UPLOAD ================= */}
        {activeTab === "custom" && (
          <AdminPanel className="p-6 sm:p-8 space-y-6">
            {!createdResult ? (
              <form onSubmit={handleCustomSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Position"
                      value={courseOrTitle}
                      onChange={(e) => setCourseOrTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                      Certificate ID
                    </label>
                    <input
                      type="text"
                      placeholder="Certificate ID"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-dark-foreground mb-1.5">
                    Pre-made Certificate PDF File
                  </label>
                  <div
                    onClick={() => customFileInputRef.current?.click()}
                    className="border-2 border-dashed border-border dark:border-dark-border hover:border-primary rounded-2xl p-6 text-center bg-secondary/20 dark:bg-dark-secondary/20 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <input
                      ref={customFileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setCustomFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                    <UploadCloud size={24} className="mx-auto text-primary mb-2" />
                    {customFile ? (
                      <p className="text-xs font-bold text-foreground dark:text-dark-foreground">{customFile.name}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                        Click to select pre-designed PDF
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <UploadCloud size={18} />
                  <span>{isLoading ? "Uploading..." : "Upload Certificate PDF"}</span>
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-6">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold">Custom Certificate Uploaded!</h3>
                <Button onClick={resetSingleForm} variant="outline" className="text-xs">
                  Upload Another
                </Button>
              </div>
            )}
          </AdminPanel>
        )}
      </div>
    </AdminLayout>
  );
};

export default CertificateDashboard;
