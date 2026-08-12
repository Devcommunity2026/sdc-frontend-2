import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";
import { handelLogin } from "../controllers/loginRequest";
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      await handelLogin(e, email, password, login,navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="Welcome"
      heading2="Back"
      subtext="Login to continue your journey with the community"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          className="rounded-lg border border-border bg-background p-3 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-background p-3 pr-12 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-end text-sm">
          <span
            onClick={() => navigate("/forgot-password")}
            className="cursor-pointer text-primary hover:underline font-medium select-none"
          >
            Forgot Password?
          </span>
        </div>

        <Button loading={loading} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Login
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground dark:text-dark-muted-foreground">
        Don&apos;t have an account?
      </div>

      <Button
        variant="outline"
        className="mt-2 w-full border-border dark:border-dark-border"
        onClick={() => navigate("/register")}
      >
        Create Account
      </Button>
    </AuthPageLayout>
  );
};

export default Login;
