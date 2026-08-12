import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    if (!email) {
      alert("Something went wrong. Please request OTP again.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verifyOTP`,
        { email, userOtp: otp },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("OTP verified successfully!");
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="Verify"
      heading2="OTP"
      subtext={`Enter the 6-digit OTP sent to ${email || "your email"}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="rounded-lg border border-border bg-background p-3 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary text-center tracking-widest text-lg font-semibold"
        />

        <Button loading={loading} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Verify OTP
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground dark:text-dark-muted-foreground">
        Didn&apos;t get the code?
      </div>

      <Button
        variant="outline"
        className="mt-2 w-full border-border dark:border-dark-border"
        onClick={() => navigate("/forgot-password")}
      >
        Resend OTP
      </Button>
    </AuthPageLayout>
  );
};

export default VerifyOTP;
