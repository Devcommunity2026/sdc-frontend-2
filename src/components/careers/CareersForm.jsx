import React from "react";
import { motion } from "framer-motion";
import { Send, UploadCloud, FileText, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { applicationDomain } from "../../data/mockData";
import { EASE_OUT } from "../../libs/motion";

const CareersForm = ({
  form,
  handleChange,
  handleFileChange,
  removeFile,
  handleSubmit,
  loading,
  user
}) => {
  const inputClass = `
    w-full rounded-xl px-4 py-3 text-sm transition-all outline-none
    bg-background text-foreground placeholder:text-muted-foreground
    border border-border
    focus:ring-2 focus:ring-primary/30 focus:border-primary
    dark:bg-dark-background
    dark:text-dark-foreground
    dark:placeholder:text-dark-muted-foreground
    dark:border-dark-border
    dark:focus:ring-dark-primary/30
    dark:focus:border-dark-primary
  `;

  const labelClass = `
    block mb-2 font-medium text-sm
    text-foreground dark:text-dark-foreground
  `;

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-background dark:bg-dark-background">
      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-96 rounded-full blur-[140px] bg-primary/10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_OUT }}
          onSubmit={handleSubmit}
          className="rounded-3xl p-6 md:p-10 space-y-6 border shadow-lg bg-card border-border dark:bg-dark-card dark:border-dark-border"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground text-left">
              Application Form
            </h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-dark-muted-foreground text-left">
              Fill in your details carefully before submitting.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 text-left">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="john@email.com"
              />
            </div>

            <div>
              <label className={labelClass}>Phone *</label>
              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className={labelClass}>College *</label>
              <input
                name="college"
                required
                value={form.college}
                onChange={handleChange}
                className={inputClass}
                placeholder="College Name"
              />
            </div>

            <div>
              <label className={labelClass}>Branch *</label>
              <input
                name="branch"
                required
                value={form.branch}
                onChange={handleChange}
                className={inputClass}
                placeholder="CSE / IT / ECE"
              />
            </div>

            <div>
              <label className={labelClass}>Year *</label>
              <select
                name="year"
                required
                value={form.year}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="text-left">
            <label className={labelClass}>Technical Skills *</label>
            <input
              name="skills"
              required
              value={form.skills}
              onChange={handleChange}
              className={inputClass}
              placeholder="React, Python, Java"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 text-left">
            <div>
              <label className={labelClass}>GitHub Profile</label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className={labelClass}>LinkedIn Profile</label>
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          {/* RESUME FILE UPLOAD */}
          <div className="text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <label className={labelClass}>Upload Resume (PDF, DOC, DOCX up to 5MB) *</label>
              {!form.resumeFile && (form.college || form.skills || form.motivation) && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium pb-2 sm:pb-0">
                  Please select your resume file to proceed
                </span>
              )}
            </div>

            {!form.resumeFile ? (
              <label
                htmlFor="resume-upload"
                className="group flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all border-border bg-background hover:bg-secondary/40 hover:border-primary/50 dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary/40 dark:hover:border-dark-primary/50"
              >
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary transition-transform group-hover:scale-110">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-dark-foreground">
                    Click to browse or drag and drop your resume
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max size: 5 MB)
                  </p>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border border-primary/30 bg-primary/5 dark:border-dark-primary/30 dark:bg-dark-primary/10">
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary shrink-0">
                    <FileText size={22} />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-sm font-medium text-foreground dark:text-dark-foreground truncate">
                      {form.resumeFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
                      {(form.resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <label
                    htmlFor="resume-upload-replace"
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary cursor-pointer font-medium text-white dark:border-dark-border dark:bg-dark-background dark:hover:bg-dark-secondary"
                  >
                    Replace
                    <input
                      id="resume-upload-replace"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-left">
            <label className={labelClass}>Domain Interested In *</label>
            <select
              name="domain"
              required
              value={form.domain}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Domain</option>
              {applicationDomain.map((element, index) => (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className={labelClass}>
              Why do you want to join? *
            </label>
            <textarea
              name="motivation"
              required
              value={form.motivation}
              onChange={handleChange}
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Tell us about your motivation..."
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default CareersForm;
