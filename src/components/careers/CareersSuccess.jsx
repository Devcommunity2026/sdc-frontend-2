import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { EASE_OUT } from "../../libs/motion";

const CareersSuccess = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background dark:bg-dark-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="text-center max-w-md w-full rounded-3xl p-10 border bg-card border-border dark:bg-dark-card dark:border-dark-border shadow-xl"
      >
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 bg-primary dark:bg-dark-primary">
          <CheckCircle
            size={40}
            className="text-primary-foreground dark:text-dark-primary-foreground"
          />
        </div>

        <h2 className="text-3xl font-bold mb-3 text-foreground dark:text-dark-foreground">
          Application Submitted!
        </h2>

        <p className="text-muted-foreground dark:text-dark-muted-foreground">
          Your application has been submitted successfully. We will review it and get back to you soon.
        </p>
      </motion.div>
    </section>
  );
};

export default CareersSuccess;
