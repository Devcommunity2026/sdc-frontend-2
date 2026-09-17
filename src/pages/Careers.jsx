import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldAlert, LogIn } from "lucide-react";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import CareersForm from "../components/careers/CareersForm";
import CareersSuccess from "../components/careers/CareersSuccess";
import EmailVerificationModal from "../components/careers/EmailVerificationModal";
import { useCareersForm } from "../hooks/useCareersForm";
import { useAuth } from "../contexts/AuthProvider";

const Careers = () => {
  const navigate = useNavigate();
  const { user, PageLoading, refreshUser } = useAuth();

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const {
    form,
    loading,
    submitted,
    handleChange,
    handleFileChange,
    removeFile,
    handleSubmit
  } = useCareersForm(user, {
    onVerificationRequired: () => setShowVerifyModal(true)
  });

  // Check login status once initial page loading completes
  useEffect(() => {
    if (!PageLoading && !user) {
      navigate("/login", {
        state: {
          from: "/careers",
          message: "Please login before submitting an application."
        },
        replace: true
      });
    }
  }, [user, PageLoading, navigate]);

  // Fetch registration status and fresh user verification status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API_URL}/api/admin/registration/status`);
        if (res.data.success) {
          setRegistrationOpen(res.data.registrationOpen);
        }
      } catch (error) {
        console.error("Failed to fetch registration status:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();

    // Refresh profile in background so user has latest verification status
    if (user && refreshUser) {
      refreshUser();
    }
  }, []);

  return (
    <Layout>
      <Header
        heading1="Join "
        heading2="Our Community"
        subtext="Fill out the application form below and become part of our developer community."
      />

      {statusLoading || PageLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-background dark:bg-dark-background min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary"></div>
          <p className="mt-4 text-muted-foreground dark:text-dark-muted-foreground font-medium">
            Loading...
          </p>
        </div>
      ) : !user ? (
        <section className="py-20 bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground min-h-[50vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg w-full rounded-3xl p-10 border bg-card border-border dark:bg-dark-card dark:border-dark-border shadow-xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary">
              <LogIn size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
                Login Required
              </h2>
              <p className="text-base text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                Please login before submitting an application.
              </p>
            </div>

            <Button
              onClick={() =>
                navigate("/login", {
                  state: {
                    from: "/careers",
                    message: "Please login before submitting an application."
                  }
                })
              }
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <LogIn size={18} /> Login to Apply
            </Button>
          </motion.div>
        </section>
      ) : !registrationOpen ? (
        <section className="py-20 bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground min-h-[50vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg w-full rounded-3xl p-10 border bg-card border-border dark:bg-dark-card dark:border-dark-border shadow-xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary">
              <ShieldAlert size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
                Registration Closed
              </h2>
              <p className="text-base text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                Registrations are currently closed.
              </p>
            </div>
          </motion.div>
        </section>
      ) : submitted ? (
        <CareersSuccess />
      ) : (
        <>
          <CareersForm
            form={form}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            handleSubmit={handleSubmit}
            loading={loading}
            user={user}
          />

          <EmailVerificationModal
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
            user={user}
            refreshUser={refreshUser}
            onVerifiedSuccess={() => {
              // Once verified, close modal so user can proceed
              setTimeout(() => {
                setShowVerifyModal(false);
              }, 1200);
            }}
            hasFileAttached={!!form.resumeFile}
          />
        </>
      )}
    </Layout>
  );
};

export default Careers;