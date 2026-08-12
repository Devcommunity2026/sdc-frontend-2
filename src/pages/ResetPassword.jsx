import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import AuthPageLayout from "../components/AuthPageLayout";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!email) {
      alert("Something went wrong. Please start again.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/changePassword`,
        { email, newPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Password reset successfully! Please login with your new password.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      heading1="New"
      heading2="Password"
      subtext="Create a strong, new password for your account"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background p-3 pr-12 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
          />
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-background p-3 text-foreground outline-none transition focus:ring-2 focus:ring-primary dark:border-dark-border dark:bg-dark-input dark:text-dark-foreground dark:focus:ring-dark-primary"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-password"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="rounded border-border text-primary focus:ring-primary dark:border-dark-border"
          />
          <label htmlFor="show-password" className="text-sm text-muted-foreground dark:text-dark-muted-foreground select-none cursor-pointer">
            Show Passwords
          </label>
        </div>

        <Button loading={loading} className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Reset Password
        </Button>
      </form>
    </AuthPageLayout>
  );
};

export default ResetPassword;
