import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../components/Layout";
import HomeHeader from "../components/HomeHeader";
import { fetchHomeData } from "../controllers/homeRequest";

import Button from "../components/ui/Button";
import DomainCard from "../components/ui/DomainCard";
import EventCard from "../components/ui/EventCard";
import SectionHeading from "../components/ui/SectionHeading";
import StatCounter from "../components/ui/StatsCounter";
import MentorCard from "../components/ui/MentorCard";

import { Laptop, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

// Mock Data
import { domains } from "../data/mockData";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [communityStats, setCommunityStats] = useState([
    {
      label: "Users",
      value: 0,
    },
    {
      label: "Mentors",
      value: 0,
    },
    {
      label: "Members",
      value: 0,
    },
    {
      label: "Domains",
      value: 6,
    },
  ]);


  useEffect(() => {
    fetchHomeData({ setEvents, setMentors, setCommunityStats });
  }, []);

  return (
    <Layout>
      <HomeHeader />

      {/* ================= STATS ================= */}
      <section className="page-section-alt py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, i) => (
              <StatCounter
                key={stat.label}
                stat={stat}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <SectionHeading
                badge="Who We Are"
                title={
                  <>
                    A Community That{" "}
                    <span className="text-primary dark:text-dark-primary">
                      Codes Together
                    </span>
                  </>
                }
                subtitle="We bring developers together to learn, build, and grow through real-world collaboration and hands-on experience."
                center={false}
              />

              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: Laptop,
                    text: "Hands-on workshops and coding sessions",
                  },
                  {
                    icon: Users,
                    text: "Peer-to-peer learning and mentorship",
                  },
                  {
                    icon: Trophy,
                    text: "Hackathons and competitive programming",
                  },
                ].map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-dark-primary/10">
                      <Icon className="w-5 h-5 text-primary dark:text-dark-primary" />
                    </div>

                    <p className="text-foreground dark:text-dark-foreground">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="p-8 rounded-2xl grid grid-cols-2 gap-4 bg-muted dark:bg-dark-muted">
              {[
                "React",
                "Python",
                "TensorFlow",
                "Docker",
                "Git",
                "AWS",
              ].map((tech) => (
                <div
                  key={tech}
                  className="
                    p-4 rounded-xl text-center
                    bg-background text-foreground border border-border
                    dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border
                  "
                >
                  {tech}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ================= DOMAINS ================= */}
      <section className="page-section-alt py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            badge="What We Do"
            title={
              <>
                <span className="text-foreground dark:text-dark-foreground">
                  Our{" "}
                </span>

                <span className="text-primary dark:text-dark-primary">
                  Domains
                </span>
              </>
            }
            subtitle="Explore different areas of technology"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.slice(0, 3).map((domain, i) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                index={i}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/domains">
              <Button
                variant="outline"
                size="xl"
                className="text-lg font-semibold"
              >
                View All Domains
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="page-section-surface py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            badge="Stay Updated"
            title={
              <>
                <span className="text-primary dark:text-dark-primary">
                  Events
                </span>
              </>
            }
            subtitle="Don't miss out on our exciting events, workshops, and hackathons."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <EventCard
                key={event._id}
                event={{
                  ...event,
                  image: event.thumbnail || event.image,
                }}
                index={i}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/events">
              <Button
                variant="outline"
                size="xl"
                className="text-lg font-semibold"
              >
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MENTORS ================= */}
      <section className="page-section-alt py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            badge="Learn from the Best"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, i) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                index={i}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/team">
              <Button
                variant="outline"
                size="xl"
                className="text-lg font-semibold"
              >
                Meet Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Home;