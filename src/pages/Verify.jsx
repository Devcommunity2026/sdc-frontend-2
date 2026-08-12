import React, { useState } from "react";
import axios from "axios";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("verifyEmail");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        { email, userOtp: otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="Verify"
      heading2="OTP"
      subtext="Enter the OTP sent to your email"
    >
      {email && (
        <p className="mb-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground dark:border-dark-border dark:bg-dark-muted/50 dark:text-dark-muted-foreground">
          Code sent to <span className="font-medium text-foreground dark:text-dark-foreground">{email}</span>
        </p>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoComplete="one-time-code"
          className="rounded-lg border border-border bg-background p-3 text-center tracking-widest outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:focus:ring-dark-primary"
        />

        <Button loading={loading} className="mt-2 w-full">
          Verify
        </Button>
      </form>
    </AuthPageLayout>
  );
};

export default Verify;
