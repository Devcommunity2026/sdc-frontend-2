import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import Loader from "../components/Loader";
import TeamCard from "../components/ui/TeamCard";
import MentorCard from "../components/ui/MentorCard";
import Layout from "../components/Layout";
import Header from "../components/Header";
import SectionHeading from "../components/ui/SectionHeading";
import { fetchPeopleData } from "../controllers/detailsRequest";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================


  useEffect(() => {
    fetchPeopleData(setLoading, setTeamMembers, setMentors,);
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


    </Layout>
  );
};

export default Team;