import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Loader from "../components/Loader";
import TeamCard from "../components/ui/TeamCard";
import MentorCard from "../components/ui/MentorCard";
import Layout from "../components/Layout";
import Header from "../components/Header";
import SectionHeading from "../components/ui/SectionHeading";
import { fetchPeopleData, fetchAlumniData } from "../controllers/detailsRequest";
import { Briefcase, Calendar, GraduationCap, AlertCircle, RefreshCw } from "lucide-react";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alumni, setAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(true);
  const [alumniError, setAlumniError] = useState(null);

  // ================= FETCH DATA =================

  useEffect(() => {
    fetchPeopleData(setLoading, setTeamMembers, setMentors);
    fetchAlumniData(setAlumniLoading, setAlumni, setAlumniError);
  }, []);

  return (
    <Layout>

      {/* ================= HERO SECTION ================= */}

      <Header
        heading1="Our"
        heading2="Team"
        subtext="Meet the talented individuals who drive our
            community forward."
      />

      {/* ================= MENTORS ================= */}
      <section className="relative overflow-hidden py-16 lg:py-24 page-section-alt bg-dark-background">

        {/* Blur */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full blur-[120px] bg-primary/10" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">

          {/* Heading */}
          <div className="text-center mb-14">
            <SectionHeading
              badge="Guidance"
              title={
                <>
                  <span className="text-foreground dark:text-dark-foreground">
                    Our{" "}
                  </span>

                  <span className="text-primary dark:text-dark-primary">
                    Mentors
                  </span>
                </>
              }
              subtitle="Industry experts who guide our community members on their tech journey."
            />
          </div>

          {/* Mentor Cards */}
          {loading ? (
            <Loader label="Loading mentors..." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, i) => (
                <MentorCard key={mentor._id} mentor={mentor} index={i} />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ================= CORE TEAM ================= */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-14">

            <span
              className="
                inline-flex items-center rounded-full
                px-4 py-1 text-sm font-medium mb-4
                bg-primary/10 text-primary
              "
            >
              The Team
            </span>

            <h2
              className="
                text-3xl md:text-4xl font-bold mb-4
                text-foreground dark:text-dark-foreground
              "
            >
              Core{" "}

              <span className="text-primary dark:text-dark-primary">
                Team
              </span>
            </h2>

            <p
              className="
                max-w-2xl mx-auto
                text-muted-foreground dark:text-dark-muted-foreground
              "
            >
              The dedicated student leaders who organize
              and manage our community.
            </p>
          </div>

          {/* Team Cards */}
          {loading ? (
            <Loader label="Loading team..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <TeamCard key={member._id} member={member} index={i} />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ================= ALUMNI SECTION ================= */}
      <section className="relative overflow-hidden py-16 lg:py-24 page-section-alt bg-dark-background border-t border-border/40 dark:border-dark-border/40">

        {/* Ambient Glow */}
        <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full blur-[120px] bg-primary/10 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">

          {/* Section Heading */}
          <div className="text-center mb-14">
            <SectionHeading
              badge="Legacy"
              title={
                <>
                  <span className="text-foreground dark:text-dark-foreground">
                    Our{" "}
                  </span>
                  <span className="text-primary dark:text-dark-primary">
                    Alumni
                  </span>
                </>
              }
              subtitle="Celebrating our graduated members building impactful careers across premier organizations."
            />
          </div>

          {/* Alumni Content */}
          {alumniLoading ? (
            <Loader label="Loading alumni..." />
          ) : alumniError ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-center space-y-4 shadow-sm">
              <div className="flex justify-center text-primary dark:text-dark-primary">
                <AlertCircle size={36} />
              </div>
              <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                {alumniError}
              </p>
              <button
                onClick={() => fetchAlumniData(setAlumniLoading, setAlumni, setAlumniError)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground transition-all cursor-pointer"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          ) : alumni.length === 0 ? (
            <div className="max-w-md mx-auto p-8 rounded-2xl border border-dashed border-border dark:border-dark-border bg-card/50 dark:bg-dark-card/50 text-center text-muted-foreground dark:text-dark-muted-foreground">
              <GraduationCap className="mx-auto mb-3 opacity-40" size={40} />
              <p className="text-base font-medium text-foreground dark:text-dark-foreground">No alumni records yet</p>
              <p className="text-sm mt-1">Our alumni directory will be updated soon.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Desktop Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 mb-3 rounded-xl border border-border/60 dark:border-dark-border/60 bg-secondary/70 dark:bg-dark-secondary/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-dark-muted-foreground shadow-xs">
                <div className="col-span-5 flex items-center gap-2">
                  <GraduationCap size={15} className="text-primary dark:text-dark-primary" />
                  <span>Alumni Name</span>
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <Briefcase size={15} className="text-primary dark:text-dark-primary" />
                  <span>Company</span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                  <Calendar size={15} className="text-primary dark:text-dark-primary" />
                  <span>Passing Year</span>
                </div>
              </div>

              {/* List Rows */}
              <div className="space-y-2.5">
                {alumni.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 sm:px-6 py-4 rounded-xl border border-border dark:border-dark-border bg-card hover:bg-secondary/40 dark:bg-dark-card dark:hover:bg-dark-secondary/40 hover:border-primary/40 dark:hover:border-dark-primary/40 transition-all duration-200 shadow-xs"
                  >
                    {/* Name */}
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-dark-primary/15 text-primary dark:text-dark-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {item.name ? item.name.charAt(0).toUpperCase() : "A"}
                      </div>
                      <span className="font-semibold text-foreground dark:text-dark-foreground text-sm sm:text-base truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* Company */}
                    <div className="sm:col-span-4 flex items-center gap-2 text-sm text-muted-foreground dark:text-dark-muted-foreground pl-11 sm:pl-0">
                      <span className="sm:hidden font-medium text-xs text-muted-foreground/70">Company:</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary dark:bg-dark-secondary font-medium text-foreground dark:text-dark-foreground text-xs sm:text-sm">
                        <Briefcase size={12} className="opacity-70" />
                        {item.company}
                      </span>
                    </div>

                    {/* Passing Year */}
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-end gap-2 pl-11 sm:pl-0">
                      <span className="sm:hidden font-medium text-xs text-muted-foreground/70">Passing Year:</span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-dark-primary/15 dark:text-dark-primary dark:border-dark-primary/25">
                        <Calendar size={11} />
                        Class of {item.passingYear}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>


    </Layout>
  );
};

export default Team;