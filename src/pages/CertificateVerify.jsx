import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  Check,
  ExternalLink,
  Search,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Maximize2,
} from "lucide-react";
import Button from "../components/ui/Button";

const CertificateVerify = () => {
  const { id } = useParams();
  const [viewState, setViewState] = useState("loading"); // 'loading' | 'found' | 'not_found' | 'error'
  const [certificate, setCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCertificate = useCallback(async () => {
    if (!id || !id.trim()) {
      setViewState("not_found");
      setErrorMessage("No certificate ID was provided.");
      return;
    }

    setViewState("loading");
    setErrorMessage("");

    try {
      const res = await axios.get(`${API_URL}/api/certificates/${encodeURIComponent(id.trim())}`);
      if (res.data && res.data.data) {
        setCertificate(res.data.data);
        setViewState("found");
      } else {
        setViewState("not_found");
        setErrorMessage("Certificate record not found.");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setViewState("not_found");
        setErrorMessage("Certificate not found; it may be invalid or the ID might be incorrect.");
      } else {
        setViewState("error");
        setErrorMessage(
          err.response?.data?.message || "Unable to reach verification service. Please try again."
        );
      }
    }
  }, [id, API_URL]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const handleCopyId = () => {
    if (!certificate?.certificateId) return;
    navigator.clipboard.writeText(certificate.certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!certificate?.fileUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(certificate.fileUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const filename = `${certificate.holderName.replace(/[^a-zA-Z0-9_-]/g, "_")}-${certificate.certificateId}.pdf`;

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    } catch (e) {
      window.open(certificate.fileUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = certificate?.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recent";

  const formattedStartDate = certificate?.startDate
    ? new Date(certificate.startDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const formattedEndDate = certificate?.endDate
    ? new Date(certificate.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Layout>
      <section className="py-8 md:py-12 bg-background dark:bg-dark-background min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* 1. Loading State */}
          {viewState === "loading" && (
            <div className="max-w-xl mx-auto my-20 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-3xl p-12 text-center space-y-4 shadow-lg animate-pulse">
              <div className="w-14 h-14 rounded-full bg-primary/20 mx-auto animate-spin border-4 border-primary border-t-transparent" />
              <p className="text-foreground dark:text-dark-foreground font-semibold">
                Verifying certificate authenticity...
              </p>
              <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                Querying verifiable credential protocol for ID: {id}
              </p>
            </div>
          )}

          {/* 2. Not Found State */}
          {viewState === "not_found" && (
            <div className="max-w-xl mx-auto my-20 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                <AlertTriangle size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                  Certificate Not Found
                </h2>
                <p className="mt-2 text-sm text-muted-foreground dark:text-dark-muted-foreground max-w-md mx-auto">
                  {errorMessage}
                </p>
                {id && (
                  <div className="mt-4 inline-block px-4 py-1.5 rounded-xl bg-secondary dark:bg-dark-secondary font-mono text-xs text-foreground dark:text-dark-foreground">
                    Queried ID: {id}
                  </div>
                )}
              </div>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/certificates">
                  <Button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold text-xs">
                    <Search size={15} />
                    <span>Search Another Certificate</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* 3. Found State: 2-Column Split Screen */}
          {viewState === "found" && certificate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* LEFT HALF: Credentials Details */}
              <div className="space-y-6">
                {/* Status Header Banner */}
                {certificate.status === "revoked" ? (
                  <div className="rounded-3xl bg-red-500/10 border-2 border-red-500/30 p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-red-500 text-white rounded-2xl shrink-0">
                      <XCircle size={28} />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500/20 text-red-600 dark:text-red-400 mb-1">
                        Revoked Credential
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-foreground dark:text-dark-foreground">
                        Certificate Officially Revoked
                      </h2>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-0.5">
                        The issuing authority has marked this certificate as revoked. It is no longer valid.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-card dark:bg-dark-card border border-border dark:border-dark-border p-5 sm:p-6 flex items-center gap-4 shadow-md">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl shrink-0">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1">
                        <ShieldCheck size={12} />
                        <span>Authentic & Verified</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-foreground dark:text-dark-foreground">
                        Official SDC Credential Verified
                      </h2>
                    </div>
                  </div>
                )}

                {/* Main Credentials Card */}
                <div className="bg-card dark:bg-dark-card rounded-3xl border border-border dark:border-dark-border p-6 sm:p-8 shadow-md space-y-6">
                  {/* Recipient Full Name */}
                  <div className="p-5 rounded-2xl bg-secondary/50 dark:bg-dark-secondary/50 border border-border dark:border-dark-border space-y-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                      <User size={14} />
                      <span>Full Name</span>
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-dark-foreground tracking-tight pt-1">
                      {certificate.holderName}
                    </div>
                  </div>

                  {/* Position */}
                  <div className="p-5 rounded-2xl bg-secondary/50 dark:bg-dark-secondary/50 border border-border dark:border-dark-border space-y-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                      <Award size={14} />
                      <span>Position</span>
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-foreground dark:text-dark-foreground tracking-tight pt-1">
                      {certificate.courseOrTitle}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/30 dark:bg-dark-secondary/30 border border-border dark:border-dark-border">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                        Certificate Type
                      </span>
                      <span className="mt-1.5 inline-block capitalize px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary border border-primary/20">
                        {certificate.certificateType || "Internship"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/30 dark:bg-dark-secondary/30 border border-border dark:border-dark-border">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                        {formattedStartDate && formattedEndDate ? "Tenure Period" : "Date"}
                      </span>
                      <span className="mt-1.5 font-bold text-foreground dark:text-dark-foreground text-xs sm:text-sm block">
                        {formattedStartDate && formattedEndDate
                          ? `${formattedStartDate} - ${formattedEndDate}`
                          : formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Certificate ID Pill */}
                  <div className="p-4 rounded-2xl bg-secondary/40 dark:bg-dark-secondary/40 border border-border dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground">
                        Certificate ID
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-primary dark:text-dark-primary mt-0.5 block select-all">
                        {certificate.certificateId}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyId}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground border border-border dark:border-dark-border hover:bg-secondary transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      {copiedId ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    {certificate.fileUrl && (
                      <>
                        <button
                          onClick={handleDownloadPdf}
                          disabled={isDownloading}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs transition-all cursor-pointer shadow-md"
                        >
                          <Download size={15} />
                          <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
                        </button>

                        <a
                          href={certificate.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary dark:bg-dark-secondary text-foreground dark:text-dark-foreground border border-border dark:border-dark-border hover:bg-muted font-semibold text-xs transition-all cursor-pointer shadow-xs"
                        >
                          <ExternalLink size={14} />
                          <span>Open PDF in New Tab</span>
                        </a>
                      </>
                    )}

                    <Link
                      to="/certificates"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary dark:bg-dark-secondary text-foreground dark:text-dark-foreground border border-border dark:border-dark-border hover:bg-muted font-semibold text-xs transition-all"
                    >
                      <Search size={14} />
                      <span>Search Another</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT HALF: The Certificate Itself */}
              <div className="w-full">
                <div className="bg-card dark:bg-dark-card rounded-3xl border border-border dark:border-dark-border p-4 sm:p-5 shadow-lg flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border dark:border-dark-border px-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground dark:text-dark-foreground">
                      <FileText size={16} className="text-primary" />
                      <span>Official Certificate Document</span>
                    </div>

                    {certificate.fileUrl && (
                      <a
                        href={certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-dark-primary hover:underline"
                      >
                        <span>Full Screen</span>
                        <Maximize2 size={12} />
                      </a>
                    )}
                  </div>

                  {certificate.fileUrl ? (
                    <div className="w-full h-[500px] sm:h-[600px] lg:h-[720px] rounded-2xl overflow-hidden border border-border dark:border-dark-border bg-slate-900/5 dark:bg-slate-950/40 relative">
                      <iframe
                        src={`${certificate.fileUrl}#toolbar=0&navpanes=0`}
                        title="Official Certificate PDF"
                        className="w-full h-full rounded-2xl"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-xs text-muted-foreground">
                      No document preview available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CertificateVerify;
