import { useState, useEffect } from "react";
import axios from "axios";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  college: "",
  branch: "",
  year: "",
  skills: "",
  github: "",
  linkedin: "",
  domain: "",
  motivation: "",
  resume: "",
  resumePublicId: "",
};

export const useCareersForm = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeError, setResumeError] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user changes email after OTP verification, invalidate the OTP
    if (name === "email" && otpVerified && value.trim().toLowerCase() !== form.email.trim().toLowerCase()) {
      setOtpVerified(false);
      setOtpSent(false);
      setVerificationToken("");
      setOtp("");
      setOtpMessage("");
      setOtpError("Email changed. Please verify your new email.");
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Resume File Upload to Cloudinary (folder: resume)
  const handleResumeFileChange = async (file) => {
    if (!file) return;

    // Validate PDF
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setResumeError("Only PDF documents are accepted for resume.");
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setResumeError("Resume file size must be less than 10MB.");
      return;
    }

    setResumeError("");
    setResumeFile(file);
    setResumeUploading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(`${API_URL}/public/career/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const readableUrl = response.data.viewUrl ||
          `${API_URL}/public/career/resume-preview?publicId=${encodeURIComponent(response.data.publicId || "")}` ||
          response.data.url;

        setForm((prev) => ({
          ...prev,
          resume: response.data.url,
          resumePublicId: response.data.publicId || "",
          resumeViewUrl: readableUrl,
        }));
        setResumeUploaded(true);
        setResumeError("");
      } else {
        setResumeError(response.data.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      setResumeError(
        error?.response?.data?.message ||
        "Failed to upload resume. Please check your network and try again."
      );
      setResumeUploaded(false);
    } finally {
      setResumeUploading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setOtpError("Please enter a valid email address first.");
      return;
    }

    setOtpSending(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/public/career/send-otp`, {
        email: form.email.trim(),
        name: form.name.trim(),
      });

      if (response.data.success) {
        setOtpSent(true);
        setOtpMessage("Verification OTP sent to your email. Valid for 5 minutes.");
        setCountdown(60); // 60s cooldown
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setOtpError(
        error?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setOtpSending(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/public/career/resend-otp`, {
        email: form.email.trim(),
        name: form.name.trim(),
      });

      if (response.data.success) {
        setOtpMessage("A new verification OTP has been sent to your email.");
        setCountdown(60);
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setOtpError(
        error?.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      setOtpError("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/public/career/verify-otp`, {
        email: form.email.trim(),
        otp: otp.trim(),
      });

      if (response.data.success) {
        setOtpVerified(true);
        setVerificationToken(response.data.verificationToken);
        setOtpMessage("Email verified successfully!");
        setOtpError("");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError(
        error?.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setOtpVerifying(false);
    }
  };

  // Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified || !verificationToken) {
      setOtpError("Please verify your email address with OTP before submitting.");
      return;
    }

    if (!form.resume) {
      setResumeError("Please upload your resume (PDF) before submitting.");
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/public/apply`, {
        ...form,
        verificationToken,
      });

      if (response.data.success) {
        setSubmitted(true);
        setForm(initialForm);
        setVerificationToken("");
        setOtpVerified(false);
        setOtpSent(false);
        setResumeUploaded(false);
        setResumeFile(null);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert(
        error?.response?.data?.message ||
        "Unable To Submit Application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    submitted,
    handleChange,
    handleSubmit,
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
  };
};
