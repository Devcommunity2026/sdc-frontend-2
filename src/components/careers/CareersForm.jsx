import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Loader2,
  KeyRound,
} from "lucide-react";
import Button from "../ui/Button";
import { applicationDomain } from "../../data/mockData";
import { EASE_OUT } from "../../libs/motion";

const CareersForm = ({
  form,
  loading,
  handleChange,
  handleBlur,
  handleSubmit,
  errors = {},
  touched = {},
  // Resume props
  resumeFile,
  resumeUploading,
  resumeUploaded,
  resumeError,
  handleResumeFileChange,
  // OTP props
  otp,
  setOtp,
  otpSent,
  otpSending,
  otpVerifying,
  otpVerified,
  otpError,
  otpMessage,
  countdown,
  handleSendOtp,
  handleResendOtp,
  handleVerifyOtp,
}) => {
  const fileInputRef = useRef(null);

  const getInputClass = (fieldName) => {
    const hasError = Boolean(touched?.[fieldName] && errors?.[fieldName]);
    return `
      w-full h-11 rounded-xl px-4 text-sm transition-all outline-none
      bg-background text-foreground placeholder:text-muted-foreground
      border ${
        hasError
          ? "border-destructive dark:border-rose-500 focus:ring-2 focus:ring-destructive/30 focus:border-destructive"
          : "border-border focus:ring-2 focus:ring-primary/30 focus:border-primary"
      }
      dark:bg-dark-background
      dark:text-dark-foreground
      dark:placeholder:text-dark-muted-foreground
      dark:border-dark-border
    `;
  };

  const getTextareaClass = (fieldName) => {
    const hasError = Boolean(touched?.[fieldName] && errors?.[fieldName]);
    return `
      w-full rounded-xl p-4 text-sm transition-all outline-none resize-none
      bg-background text-foreground placeholder:text-muted-foreground
      border ${
        hasError
          ? "border-destructive dark:border-rose-500 focus:ring-2 focus:ring-destructive/30 focus:border-destructive"
          : "border-border focus:ring-2 focus:ring-primary/30 focus:border-primary"
      }
      dark:bg-dark-background
      dark:text-dark-foreground
      dark:placeholder:text-dark-muted-foreground
      dark:border-dark-border
    `;
  };

  const labelClass = `
    font-medium text-sm text-foreground dark:text-dark-foreground
  `;

  const renderFieldError = (fieldName) => {
    if (!touched?.[fieldName] || !errors?.[fieldName]) return null;
    return (
      <p className="text-xs text-destructive dark:text-rose-400 mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} className="shrink-0" />
        <span>{errors[fieldName]}</span>
      </p>
    );
  };

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleResumeFileChange(file);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleResumeFileChange(file);
    }
  };

  const isFormSubmittable = otpVerified && form.resume && !loading && !resumeUploading;

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-background dark:bg-dark-background">
      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-96 rounded-full blur-[140px] bg-primary/10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_OUT }}
          onSubmit={handleSubmit}
          className="rounded-3xl p-6 md:p-10 space-y-8 border shadow-lg bg-card border-border dark:bg-dark-card dark:border-dark-border"
        >
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground text-left">
              Career Application
            </h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-dark-muted-foreground text-left">
              Please complete all applicant details, upload your PDF resume, and verify your email with OTP.
            </p>
          </div>

          {/* Section 1: Applicant Details */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground dark:text-dark-foreground border-b border-border dark:border-dark-border pb-2 text-left">
              1. Personal & Academic Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-5 text-left">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>Full Name *</label>
                </div>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.name && errors?.name)}
                  className={getInputClass("name")}
                  placeholder="John Doe"
                />
                {renderFieldError("name")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>
                    College Email *
                  </label>
                  {otpVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs text-amber-500 font-medium shrink-0 whitespace-nowrap">
                      Verification Required
                    </span>
                  )}
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.email && errors?.email)}
                  className={`${getInputClass("email")} ${otpVerified ? "border-emerald-500/50 bg-emerald-50/10" : ""}`}
                  placeholder="en23cs301562@medicaps.ac.in"
                />
                {renderFieldError("email")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>Phone Number *</label>
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.phone && errors?.phone)}
                  className={getInputClass("phone")}
                  placeholder="+91 9876543210"
                />
                {renderFieldError("phone")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>Branch / Specialization *</label>
                </div>
                <input
                  name="branch"
                  required
                  value={form.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.branch && errors?.branch)}
                  className={getInputClass("branch")}
                  placeholder="CSE / IT / ECE"
                />
                {renderFieldError("branch")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>Current Academic Year *</label>
                </div>
                <select
                  name="year"
                  required
                  value={form.year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.year && errors?.year)}
                  className={getInputClass("year")}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {renderFieldError("year")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>Domain Applied For *</label>
                </div>
                <select
                  name="domain"
                  required
                  value={form.domain}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.domain && errors?.domain)}
                  className={getInputClass("domain")}
                >
                  <option value="">Select Domain</option>
                  {applicationDomain.map((element, index) => (
                    <option key={index} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
                {renderFieldError("domain")}
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                <label className={labelClass}>Technical Skills * (comma separated)</label>
              </div>
              <input
                name="skills"
                required
                value={form.skills}
                onChange={handleChange}
                onBlur={handleBlur}
                data-has-error={Boolean(touched?.skills && errors?.skills)}
                className={getInputClass("skills")}
                placeholder="React, Node.js, Python, TypeScript, MongoDB"
              />
              {renderFieldError("skills")}
            </div>

            <div className="grid sm:grid-cols-2 gap-5 text-left">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>GitHub Profile</label>
                </div>
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.github && errors?.github)}
                  className={getInputClass("github")}
                  placeholder="https://github.com/username"
                />
                {renderFieldError("github")}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                  <label className={labelClass}>LinkedIn Profile</label>
                </div>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  data-has-error={Boolean(touched?.linkedin && errors?.linkedin)}
                  className={getInputClass("linkedin")}
                  placeholder="https://linkedin.com/in/username"
                />
                {renderFieldError("linkedin")}
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center justify-between gap-2 mb-2 min-h-[22px]">
                <label className={labelClass}>
                  Why do you want to join? *
                </label>
              </div>
              <textarea
                name="motivation"
                required
                value={form.motivation}
                onChange={handleChange}
                onBlur={handleBlur}
                data-has-error={Boolean(touched?.motivation && errors?.motivation)}
                rows={4}
                className={getTextareaClass("motivation")}
                placeholder="Tell us about your interests, past projects, and why you want to be part of SDC..."
              />
              {renderFieldError("motivation")}
            </div>
          </div>

          {/* Section 2: Resume Upload */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border dark:border-dark-border pb-2">
              <h3 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                2. Resume Upload (PDF)
              </h3>
              {form.resume && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} /> Resume Attached
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={onFileInput}
            />

            {!form.resume ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                  ${resumeUploading
                    ? "border-primary/50 bg-primary/5 dark:bg-dark-primary/10"
                    : "border-border hover:border-primary/60 bg-secondary/30 dark:border-dark-border dark:hover:border-dark-primary/60"
                  }
                `}
              >
                {resumeUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 size={36} className="animate-spin text-primary dark:text-dark-primary" />
                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                      Uploading resume...
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                      Processing your document, please wait...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary flex items-center justify-center">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                        Click to select or drag and drop your Resume
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-1">
                        PDF format only (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground truncate">
                      {resumeFile?.name || "Uploaded Resume.pdf"}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Resume uploaded successfully</span>
                      {resumeFile?.size && (
                        <span>• {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={
                      form.resumeViewUrl ||
                      (form.resumePublicId
                        ? `${import.meta.env.VITE_API_URL}/public/career/resume-preview?publicId=${encodeURIComponent(form.resumePublicId)}`
                        : form.resume)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-primary dark:text-dark-primary hover:underline px-3 py-1.5 rounded-lg border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
                  >
                    <ExternalLink size={13} />
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground px-3 py-1.5 rounded-lg border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
                  >
                    Replace
                  </button>
                </div>
              </div>
            )}

            {resumeError && (
              <div className="flex items-center gap-2 text-xs font-medium text-destructive dark:text-rose-400 bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                <AlertCircle size={15} className="shrink-0" />
                <span>{resumeError}</span>
              </div>
            )}
          </div>

          {/* Section 3: Email OTP Verification */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-border dark:border-dark-border pb-2">
              <h3 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                3. Email OTP Verification
              </h3>
              {otpVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} /> Verified
                </span>
              )}
            </div>

            {otpVerified ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
                <ShieldCheck size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Email address verified successfully
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                    Your OTP verification token is attached to this application.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border dark:border-dark-border bg-secondary/20 dark:bg-dark-secondary/20 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                      Verify Your Email Address
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-0.5">
                      We will send a 6-digit OTP to <strong>{form.email || "your @medicaps.ac.in email"}</strong>
                    </p>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      disabled={otpSending || !form.email}
                      onClick={handleSendOtp}
                      className="w-36 h-10 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center shrink-0 active:scale-95"
                    >
                      {otpSending ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin shrink-0" />
                          <span>Sending...</span>
                        </span>
                      ) : (
                        <span>Send OTP</span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={countdown > 0 || otpSending}
                      onClick={handleResendOtp}
                      className="w-36 h-10 px-2 rounded-xl text-xs font-semibold border border-border dark:border-dark-border bg-secondary/50 hover:bg-secondary text-primary dark:text-dark-primary disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all inline-flex items-center justify-center shrink-0"
                    >
                      {otpSending ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin" />
                          <span>Sending...</span>
                        </span>
                      ) : countdown > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono">
                          <Clock size={13} />
                          <span>{countdown}s</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <RefreshCw size={12} />
                          <span>Resend OTP</span>
                        </span>
                      )}
                    </button>
                  )}
                </div>

                {otpSent && (
                  <div className="pt-3 border-t border-border/60 dark:border-dark-border/60 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <KeyRound size={17} />
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="• • • • • •"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground text-center font-mono text-lg tracking-[0.4em] font-bold placeholder:text-muted-foreground/40 placeholder:tracking-[0.2em] outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={otpVerifying || otp.length !== 6}
                        onClick={handleVerifyOtp}
                        className="w-full sm:w-36 h-11 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center shrink-0 active:scale-95"
                      >
                        {otpVerifying ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Loader2 size={14} className="animate-spin shrink-0" />
                            <span>Verifying...</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 size={14} />
                            <span>Verify OTP</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {otpMessage && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span>{otpMessage}</span>
                  </div>
                )}

                {otpError && (
                  <div className="flex items-center gap-2 text-xs font-medium text-destructive dark:text-rose-400 bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Button */}
          <div className="pt-4 space-y-2">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormSubmittable}
              className={`
                w-full flex items-center justify-center gap-2 py-4 text-base font-semibold transition-all
                ${!isFormSubmittable ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Application
                </>
              )}
            </Button>

            {!isFormSubmittable && (
              <p className="text-xs text-center text-muted-foreground dark:text-dark-muted-foreground">
                {!form.resume && !otpVerified
                  ? "Please upload your resume and verify your email to enable submission."
                  : !form.resume
                  ? "Please upload your PDF resume to enable submission."
                  : !otpVerified
                  ? "Please verify your email with OTP to enable submission."
                  : ""}
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default CareersForm;
