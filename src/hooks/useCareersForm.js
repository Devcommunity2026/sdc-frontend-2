import { useState } from "react";
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
};

export const useCareersForm = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${API_URL}/public/apply`,
        form
      );

      if (response.data.success) {
        setSubmitted(true);
        setForm(initialForm);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert(
        error?.response?.data?.message ||
        "Unable To Submit Application"
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
  };
};
