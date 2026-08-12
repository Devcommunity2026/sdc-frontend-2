import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-20">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;