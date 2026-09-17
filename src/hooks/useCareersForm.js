import { useState, useEffect } from "react";
import axios from "axios";

const STORAGE_KEY = "careers_form_draft";

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
  resumeFile: null,
};

const getSavedDraft = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure no unexpected null/undefined
      return {
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        college: parsed.college || "",
        branch: parsed.branch || "",
        year: parsed.year || "",
        skills: parsed.skills || "",
        github: parsed.github || "",
        linkedin: parsed.linkedin || "",
        domain: parsed.domain || "",
        motivation: parsed.motivation || "",
        resumeFile: null, // File objects cannot be stored in sessionStorage
      };
    }
  } catch (err) {
    console.warn("Failed to parse draft from sessionStorage:", err);
  }
  return null;
};

export const useCareersForm = (user, { onVerificationRequired } = {}) => {
  const [form, setForm] = useState(() => {
    const draft = getSavedDraft();
    return draft || initialForm;
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync user defaults if fields are empty
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: user.email || prev.email || "",
      }));
    }
  }, [user]);

  // Save text inputs only to sessionStorage
  const saveTextDraft = (newForm) => {
    try {
      const { resumeFile, ...textFields } = newForm;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(textFields));
    } catch (err) {
      console.warn("Failed to save draft to sessionStorage:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      saveTextDraft(updated);
      return updated;
    });
  };

  const handleFileChange = (file) => {
    if (!file) return false;

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileName = file.name.toLowerCase();
    const isAllowedExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isAllowedExt) {
      alert("Invalid file type. Only PDF, DOC, and DOCX files are allowed.");
      return false;
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      alert("File size exceeds 5 MB. Please upload a smaller file.");
      return false;
    }

    // Store File object strictly in React state
    setForm((prev) => ({
      ...prev,
      resumeFile: file,
    }));
    return true;
  };

  const removeFile = () => {
    setForm((prev) => ({
      ...prev,
      resumeFile: null,
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.resumeFile) {
      alert("Please upload your resume before submitting.");
      return;
    }

    // Check email verification before any network request / Cloudinary upload
    if (!user?.isEmailVerified) {
      if (onVerificationRequired) {
        onVerificationRequired();
      } else {
        alert("Please verify your email before submitting an application.");
      }
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("college", form.college);
      formData.append("branch", form.branch);
      formData.append("year", form.year);
      formData.append("skills", form.skills);
      formData.append("github", form.github || "");
      formData.append("linkedin", form.linkedin || "");
      formData.append("domain", form.domain);
      formData.append("motivation", form.motivation);
      formData.append("resume", form.resumeFile);

      const response = await axios.post(
        `${API_URL}/public/apply`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
        setForm(initialForm);
      }
    } catch (error) {
      console.error("Submission failed", error);

      // If backend rejected due to unverified email, open verification modal
      if (
        error.response?.status === 403 &&
        (error.response?.data?.code === "EMAIL_NOT_VERIFIED" ||
          error.response?.data?.message?.toLowerCase().includes("verify your email"))
      ) {
        if (onVerificationRequired) {
          onVerificationRequired();
          return;
        }
      }

      const message =
        error?.response?.data?.message ||
        "Unable To Submit Application. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    submitted,
    handleChange,
    handleFileChange,
    removeFile,
    handleSubmit,
  };
};
