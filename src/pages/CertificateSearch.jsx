import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Award, Search, ShieldCheck, CheckCircle, ExternalLink } from "lucide-react";
import Button from "../components/ui/Button";

const CertificateSearch = () => {
  const [certId, setCertId] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/certificates/${encodeURIComponent(certId.trim())}`);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 bg-background dark:bg-dark-background">
        <div className="w-full max-w-lg mx-auto text-center space-y-7 bg-card dark:bg-dark-card p-8 sm:p-12 rounded-3xl border border-border dark:border-dark-border shadow-xl">
          {/* Badge Icon */}
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary shadow-xs">
            <Award size={36} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-dark-foreground tracking-tight">
              Enter Certificate ID
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-dark-muted-foreground max-w-sm mx-auto leading-relaxed">
              Enter your unique Certificate ID to verify credential authenticity.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Certificate ID"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-2xl border border-border dark:border-dark-border bg-background dark:bg-dark-input text-foreground dark:text-dark-foreground font-mono text-sm placeholder:text-muted-foreground dark:placeholder:text-dark-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition-all shadow-inner"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-dark-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verify Credential Now</span>
              <ShieldCheck size={18} />
            </Button>
          </form>

          {/* Registry Notice & Admin Link */}
          <div className="pt-4 border-t border-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground dark:text-dark-muted-foreground gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle size={14} className="text-emerald-500" />
              <span>Verifiable Credential Protocol</span>
            </span>

            <Link
              to="/certificate-admin/login"
              className="text-primary dark:text-dark-primary hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>Admin Portal</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CertificateSearch;
