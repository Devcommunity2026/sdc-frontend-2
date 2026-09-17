import { useState, useEffect } from "react";
import axios from "axios";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  college: "Medicaps University",
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

export const validateField = (fieldName, val, currentForm = {}) => {
  const value = val !== undefined && val !== null ? String(val) : "";

  switch (fieldName) {
    case "name": {
      if (!value.trim()) return "Full name is required.";
      if (/[0-9]/.test(value)) return "Name should not contain numbers.";
      if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return "Name contains invalid characters.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    }
    case "email": {
      if (!value.trim()) return "Email address is required.";
      const trimmed = value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Please enter a valid email address.";
      }
      if (!trimmed.endsWith("@medicaps.ac.in")) {
        return "Only Medicaps email addresses (@medicaps.ac.in) are allowed.";
      }
      return "";
    }
    case "phone": {
      if (!value.trim()) return "Phone number is required.";
      const trimmed = value.trim();
      // Instantly flag letters or invalid characters (e.g. ABCD)
      if (/[^\d+\s-]/.test(trimmed)) {
        return "Phone number must contain numbers only.";
      }
      const digits = trimmed.replace(/\D/g, "");
      // Handle country code +91 or leading 91
      if (trimmed.startsWith("+91") || (digits.length === 12 && digits.startsWith("91"))) {
        const remainingDigits = digits.startsWith("91") ? digits.slice(2) : digits;
        if (remainingDigits.length !== 10) {
          return `Phone number must be 10 digits after +91 (entered ${remainingDigits.length} digits).`;
        }
        return "";
      }
      if (digits.length > 10) {
        return `Phone number cannot exceed 10 digits (entered ${digits.length} digits).`;
      }
      if (digits.length < 10) {
        return `Phone number must be 10 digits (entered ${digits.length} digits).`;
      }
      return "";
    }
    case "college": {
      if (!value.trim()) return "College / University name is required.";
      if (value.trim().length < 2) return "Please enter a valid college name.";
      return "";
    }
    case "branch": {
      if (!value.trim()) return "Branch / Specialization is required.";
      return "";
    }
    case "year": {
      if (!value || !["1", "2", "3", "4"].includes(String(value))) {
        return "Please select your current academic year.";
      }
      return "";
    }
    case "skills": {
      if (!value.trim()) return "Technical skills are required (e.g., React, Node.js).";
      return "";
    }
    case "github": {
      if (!value.trim()) return "";
      const trimmed = value.trim();
      if (!/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/?$/i.test(trimmed)) {
        return "Please enter a valid GitHub profile URL (e.g. https://github.com/username).";
      }
      return "";
    }
    case "linkedin": {
      if (!value.trim()) return "";
      const trimmed = value.trim();
      if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_.-]+\/?$/i.test(trimmed)) {
        return "Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username).";
      }
      return "";
    }
    case "domain": {
      if (!value.trim()) return "Please select a domain / position applied for.";
      return "";
    }
    case "motivation": {
      if (!value.trim()) return "Please explain why you want to join SDC.";
      if (value.trim().length < 20) {
        return `Please write at least 20 characters (current: ${value.trim().length}).`;
      }
      return "";
    }
    default:
      return "";
  }
};

export const useCareersForm = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

    // Instant validation on input change
    const updatedForm = { ...form, [name]: value };
    const err = validateField(name, value, updatedForm);

    if (name === "phone") {
      const trimmed = value.trim();
      const hasLetters = /[^\d+\s-]/.test(trimmed);
      const digits = trimmed.replace(/\D/g, "");
      const isTooLong = !trimmed.startsWith("+91") && digits.length > 10;
      // Show error immediately if non-numbers entered or >10 numbers entered, or if already touched
      if (hasLetters || isTooLong || touched[name]) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: err }));
      } else if (!err) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "name") {
      const hasDigits = /[0-9]/.test(value);
      if (hasDigits || touched[name]) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: err }));
      } else if (!err) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "email") {
      const trimmed = value.trim().toLowerCase();
      const hasOtherDomain = trimmed.includes("@") && !trimmed.endsWith("@medicaps.ac.in") && (trimmed.endsWith(".com") || trimmed.endsWith(".in") || trimmed.endsWith(".org") || trimmed.endsWith(".net") || trimmed.includes("@gmail") || trimmed.includes("@yahoo") || trimmed.includes("@outlook"));
      if (hasOtherDomain || touched[name]) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: err }));
      } else if (!err) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "github" || name === "linkedin") {
      if (value.trim() && err) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: err }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: err }));
      } else if (!err) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value, form);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const fieldsToValidate = [
      "name",
      "email",
      "phone",
      "branch",
      "year",
      "skills",
      "github",
      "linkedin",
      "domain",
      "motivation",
    ];

    const newErrors = {};
    const allTouched = {};

    fieldsToValidate.forEach((field) => {
      allTouched[field] = true;
      const err = validateField(field, form[field], form);
      if (err) {
        newErrors[field] = err;
      }
    });

    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Resume File Upload (PDF)
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
    const emailError = validateField("email", form.email, form);
    if (emailError) {
      setTouched((prev) => ({ ...prev, email: true }));
      setErrors((prev) => ({ ...prev, email: emailError }));
      setOtpError(emailError);
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
        setOtpMessage("Verification OTP sent to your email. Valid for 5 minutes (check spam folder if not received).");
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
        setOtpMessage("A new verification OTP has been sent to your email. Valid for 5 minutes.");
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

    const isValid = validateAll();
    if (!isValid) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-has-error="true"]');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
          firstErrorEl.focus?.();
        }
      }, 50);
      return;
    }

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
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      console.error("Submission failed", error);
      const errMsg =
        error?.response?.data?.message ||
        "Unable To Submit Application. Please try again.";

      // Alert the user
      alert(errMsg);

      // If token expired or already used, reload page after user presses OK
      const lowerMsg = errMsg.toLowerCase();
      if (
        lowerMsg.includes("verification token") ||
        lowerMsg.includes("expired") ||
        lowerMsg.includes("verify again") ||
        error?.response?.status === 401
      ) {
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    validateAll,
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
