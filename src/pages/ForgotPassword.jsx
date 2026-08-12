import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgotPassword`,
        { email },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("OTP sent successfully to your email!");
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="Reset"
      heading2="Password"
      subtext="Enter your email to receive a password reset OTP"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="rounded-lg border border-border bg-background p-3 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
        />

        <Button loading={loading} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Send OTP
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground dark:text-dark-muted-foreground">
        Remember your password?
      </div>

      <Button
        variant="outline"
        className="mt-2 w-full border-border dark:border-dark-border"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </Button>
    </AuthPageLayout>
  );
};

export default ForgotPassword;
