import React from "react";

const AdminPanel = ({ children, className = "" }) => {
  return (
    <section
      className={`rounded-2xl border border-border bg-card shadow-sm dark:border-dark-border dark:bg-dark-card ${className}`}
    >
      {children}
    </section>
  );
};

export default AdminPanel;
