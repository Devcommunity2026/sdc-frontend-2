import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthProvider";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing. Please check your link.");
        setLoading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);

        if (res.data.success) {
          setStatus("success");
          setMessage("Email verified successfully. You can now submit your application.");
          // Refresh user context if user is logged in
          if (refreshUser) {
            await refreshUser();
          }
        } else {
          setStatus("error");
          setMessage(res.data.message || "Verification link is invalid or has expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification link is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 bg-background dark:bg-dark-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl dark:border-dark-border dark:bg-dark-card"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 size={48} className="animate-spin text-primary dark:text-dark-primary" />
              <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                Verifying your email...
              </h2>
              <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                Please wait while we confirm your verification link.
              </p>
            </div>
          ) : status === "success" ? (
            <div className="space-y-6 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                  Email Verified!
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
                  {message}
                </p>
              </div>

              <Button
                onClick={() => navigate("/careers")}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                Continue to Application <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
                <XCircle size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                  Verification Failed
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
                  {message}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={() => navigate("/careers")}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Request New Verification Link
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
