import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Button from "../ui/Button";
import { applicationDomain } from "../../data/mockData";
import { EASE_OUT } from "../../libs/motion";

const CareersForm = ({ form, handleChange, handleSubmit, loading }) => {
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
    <section className="py-16 bg-muted dark:bg-dark-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE_OUT }}
          onSubmit={handleSubmit}
          className="rounded-3xl p-6 md:p-10 space-y-6 border shadow-sm bg-card border-border dark:bg-dark-card dark:border-dark-border"
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

          <div className="text-left">
            <label className={labelClass}>Resume Link *</label>
            <input
              type="url"
              name="resume"
              required
              value={form.resume}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://drive.google.com/..."
            />
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
