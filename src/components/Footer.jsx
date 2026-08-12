import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Globe } from "lucide-react";
import { useAuth } from "../contexts/AuthProvider";
import { themeContext } from "../contexts/ThemeProvider";
import logo from "../assets/logo.png";
import darkLogo from "../assets/logo-white.png";

const Footer = () => {
  const { user } = useAuth();
  const { theme } = useContext(themeContext);
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  const quickLinks = [
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blog" },
    { name: "Careers", path: "/careers" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-card text-foreground dark:border-dark-border dark:bg-dark-card dark:text-dark-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent dark:via-dark-primary/60" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* CTA strip */}
        <div className="mb-12 flex flex-col gap-6 rounded-2xl border border-border/80 bg-secondary/50 p-6 dark:border-dark-border/80 dark:bg-dark-secondary/60 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-dark-primary">
              Join us
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground dark:text-dark-foreground">
              Ready to join the community?
            </h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground dark:text-dark-muted-foreground">
              Connect with 150+ developers and start building together.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/careers"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground"
            >
              Apply Now
            </Link>
            {isAdmin && (
              <Link
                to="/admin/user"
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <img
              src={theme === "dark" ? darkLogo : logo}
              alt="Developers Community"
              className="mb-4 h-10 w-auto"
            />
            <h2 className="text-lg font-bold leading-tight">
              Developers <span className="text-primary dark:text-dark-primary">Community</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
              A student-led tech community at Medicaps University, empowering developers through collaboration, mentorship, and hands-on learning.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground dark:text-dark-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary dark:text-dark-muted-foreground dark:hover:text-dark-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground dark:text-dark-foreground">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground dark:text-dark-muted-foreground">
              <li>
                
                <a  href="mailto:sdc.admins@gmail.com"
                  className="inline-flex items-start gap-2 transition-colors hover:text-primary dark:hover:text-dark-primary"
                >
                  <Mail size={16} className="mt-0.5 shrink-0" />
                  sdc.admins@gmail.com
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                Medicaps University, Indore
              </li>
              <li>
                <a
                  href="https://medicaps.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 transition-colors hover:text-primary dark:hover:text-dark-primary"
                >
                  <Globe size={16} className="mt-0.5 shrink-0" />
                  medicaps.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground dark:border-dark-border dark:text-dark-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Developers&apos; Community. All rights reserved.</p>
          <p className="font-medium tracking-wide">Break · Build · Merge</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;