import React from "react";
import DomainCard from "../components/ui/DomainCard";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { domains } from "../data/mockData";


const Domains = () => {
  return (
    <Layout>
      <Header
        heading1={'Our '}
        heading2={'Domains'}
        subtext={`Choose your area of interest and dive deep into the technology that excites you.`} />

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <DomainCard key={domain.id} domain={domain} index={index} />
        ))}
      </div>
    </Layout>
  );
};

export default Domains; 