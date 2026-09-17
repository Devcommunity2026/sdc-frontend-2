import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MailCheck,
  Send,
  RefreshCw,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import Button from "../ui/Button";

const EmailVerificationModal = ({
  isOpen,
  onClose,
  user,
  refreshUser,
  onVerifiedSuccess,
  hasFileAttached = false
}) => {
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [checking, setChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const initialSentRef = useRef(false);
  const pollIntervalRef = useRef(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // When modal opens, auto-send verification email once if needed and start polling
  useEffect(() => {
    if (!isOpen) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      initialSentRef.current = false;
      setIsVerified(false);
      setMessage({ type: "", text: "" });
      return;
    }

    // Auto-trigger verification email on first open
    if (!initialSentRef.current && user && !user.isEmailVerified) {
      initialSentRef.current = true;
      sendVerificationEmail();
    }

    // Poll verification status in background every 4s while modal is open
    pollIntervalRef.current = setInterval(async () => {
      if (refreshUser && !isVerified) {
        try {
          const updated = await refreshUser();
          if (updated?.isEmailVerified) {
            handleVerificationDetected();
          }
        } catch (err) {
          // Silent catch during background polling
        }
      }
    }, 4000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen]);

  const handleVerificationDetected = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsVerified(true);
    setMessage({
      type: "success",
      text: "Email verified successfully! You can now submit your application."
    });

    if (onVerifiedSuccess) {
      onVerifiedSuccess();
    }
  };

  const sendVerificationEmail = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setMessage({ type: "", text: "" });

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(
        `${API_URL}/auth/resend-verification`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage({
          type: "success",
          text:
            res.data.message ||
            "Verification email sent! Please check your inbox and spam folder."
        });
        setResendCooldown(60);
      }
    } catch (err) {
      const remainingSeconds = err.response?.data?.retryAfter;
      if (remainingSeconds) {
        setResendCooldown(remainingSeconds);
        setMessage({
          type: "info",
          text:
            err.response?.data?.message ||
            `A verification email was already sent. Please check your inbox or retry in ${remainingSeconds}s.`
        });
      } else {
        setMessage({
          type: "error",
          text:
            err.response?.data?.message ||
            "Failed to send verification email. Please try again."
        });
      }
    } finally {
      setResending(false);
    }
  };

  const handleManualCheck = async () => {
    if (!refreshUser || checking) return;
    setChecking(true);
    try {
      const updated = await refreshUser();
      if (updated?.isEmailVerified) {
        handleVerificationDetected();
      } else {
        setMessage({
          type: "info",
          text:
            "Email is not verified yet. Please check your inbox, click the verification link, then click below."
        });
      }
    } catch (e) {
      console.error(e);
      setMessage({
        type: "error",
        text: "Could not check verification status. Please try again."
      });
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md dark:bg-dark-background/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 text-center shadow-2xl dark:border-dark-border dark:bg-dark-card"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground dark:text-dark-muted-foreground dark:hover:bg-dark-secondary dark:hover:text-dark-foreground"
            title="Close and return to form"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            {isVerified ? (
              <CheckCircle2 size={36} className="text-emerald-500 dark:text-emerald-400" />
            ) : (
              <MailCheck size={36} />
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </h2>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
              {isVerified
                ? "Your email has been successfully verified. You can now proceed to submit your application."
                : (
                  <>
                    Please verify your email address before submitting your application.
                    <br />
                    We sent a verification link to{" "}
                    <strong className="text-foreground dark:text-dark-foreground font-semibold">
                      {user?.email}
                    </strong>
                    .
                  </>
                )}
            </p>
          </div>

          {/* Status Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl p-3.5 text-xs md:text-sm font-medium flex items-center justify-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : message.type === "error"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : message.type === "error" ? (
                <AlertCircle size={16} className="shrink-0" />
              ) : (
                <MailCheck size={16} className="shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Form State Preservation Note */}
          <p className="mt-3 text-xs text-muted-foreground dark:text-dark-muted-foreground">
            {hasFileAttached
              ? "✓ Your application details and uploaded resume are saved in this tab."
              : "✓ Your application details are saved in this tab."}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {isVerified ? (
              <Button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
              >
                Continue to Application <ArrowRight size={18} />
              </Button>
            ) : (
              <>
                <Button
                  onClick={sendVerificationEmail}
                  disabled={resending || resendCooldown > 0}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  size="lg"
                >
                  {resending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending Verification Email...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>Resend Verification in {resendCooldown}s</>
                  ) : (
                    <>
                      <Send size={18} /> Resend Verification Email
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleManualCheck}
                  disabled={checking}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Checking Status...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} /> I have verified my email
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground underline pt-1 cursor-pointer transition-colors"
                >
                  Return to application form
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmailVerificationModal;
