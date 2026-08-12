import React from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import SectionHeading from "../components/ui/SectionHeading";
import Header from "../components/Header"
import Heading from "../components/Heading";
import DomainCard from "../components/ui/DomainCard"
import { mission, Vision, values, offerings } from "../data/aboutData";


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <Layout>
      <Header heading1={'About'} heading2={'Our Comunity'}
        subtext={`We're on a mission to empower student developers with the skills, mentorship, and community they need to thrive.`} />

      {/* Mission & Vision */}
      <section className="py-8 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <DomainCard domain={mission} index={0} />
            <DomainCard domain={Vision} index={0} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-8 lg:py-20 gradient-purple-section relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            badge="What We Believe"
            title={
              <>
                Our Core <span className="gradient">Values</span>
              </>
            }
            subtitle="These values guide everything we do."
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((v, index) => (
              <DomainCard key={index} domain={v} index={index} center={true} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learings */}
      <section className="py-8 lg:py-20 gradient-purple-section relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            badge="Grow With Us"
            title={
              <>
                Learning <span className="gradient">Opportunities</span>
              </>
            }
            subtitle="From workshops to hackathons, we offer diverse pathways to level up your skills."
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offerings.map((v, index) => (
              <DomainCard key={index} domain={v} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;