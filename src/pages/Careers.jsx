import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

import Layout from "../components/Layout";
import Header from "../components/Header";
import CareersForm from "../components/careers/CareersForm";
import CareersSuccess from "../components/careers/CareersSuccess";
import { useCareersForm } from "../hooks/useCareersForm";

const Careers = () => {
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);

  const { form, loading, submitted, handleChange, handleSubmit } = useCareersForm();

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
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

    fetchRegistrationStatus();
  }, []);

  return (
    <Layout>
      <Header
        heading1="Join "
        heading2="Our Community"
        subtext="Fill out the application form below and become part of our developer community."
      />

      {statusLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted dark:bg-dark-secondary min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary"></div>
          <p className="mt-4 text-muted-foreground dark:text-dark-muted-foreground font-medium">
            Checking registration status...
          </p>
        </div>
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
        <CareersForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </Layout>
  );
};

export default Careers;