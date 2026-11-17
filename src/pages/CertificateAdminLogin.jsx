import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";
import { useAuth } from "../contexts/AuthProvider";
import { Award, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

const CertificateAdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("cert_admin_session", "true");
        login(res.data.user);
        // Objective 1: Directly redirect to certificate publishing page
        navigate("/admin/certificates", { replace: true });
      } else {
        setErrorMessage(res.data?.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Authentication failed. Please verify credentials or contact the system administrator.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="Certificate"
      heading2="Admin"
      subtext="Sign in to issue, verify, and manage official digital certificates"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-dark-primary/15 dark:text-dark-primary shadow-sm mb-3">
          <Award className="h-7 w-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary dark:border-dark-primary/30 dark:bg-dark-primary/10 dark:text-dark-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Publishing Console Gate</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground dark:text-dark-foreground">
            Admin Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              placeholder="admin@sdc.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-foreground dark:text-dark-foreground">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-10 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Award className="h-4 w-4" />
              <span>Sign In to Publishing Console &rarr;</span>
            </>
          )}
        </Button>

        <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border dark:border-dark-border text-center text-xs">
          <Link
            to="/certificates"
            className="text-muted-foreground hover:text-primary transition-colors dark:text-dark-muted-foreground dark:hover:text-dark-primary"
          >
            Looking to verify a credential? Find Certificates
          </Link>
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground transition-colors dark:text-dark-muted-foreground dark:hover:text-dark-foreground"
          >
            Standard Member Login &rarr;
          </Link>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default CertificateAdminLogin;
