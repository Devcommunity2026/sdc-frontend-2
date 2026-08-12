import React from "react";
import NavBar from "./NavBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
      <NavBar />

      <main className="px-4 pb-10 pt-24 sm:px-6 lg:pl-80 lg:pr-8 lg:pt-8 xl:pr-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
