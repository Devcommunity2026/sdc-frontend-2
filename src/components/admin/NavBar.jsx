import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Crown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  X,
} from "lucide-react";
import { adminNav } from "../../data/navData";
import { useAuth } from "../../contexts/AuthProvider";
import { themeContext } from "../../contexts/ThemeProvider";
import { handleLogout } from "../../controllers/loginRequest";

const getRoleConfig = (role) => {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return {
        label: "Admin",
        Icon: Crown,
        className:
          "border-primary/20 bg-primary/10 text-primary dark:border-dark-primary/25 dark:bg-dark-primary/15 dark:text-dark-primary",
      };
    case "moderator":
      return {
        label: "Moderator",
        Icon: ShieldCheck,
        className:
          "border-accent/20 bg-accent/10 text-accent dark:border-dark-accent/25 dark:bg-dark-accent/15 dark:text-dark-accent",
      };
    default:
      return {
        label: role || "User",
        Icon: UserCheck,
        className:
          "border-border bg-secondary text-secondary-foreground dark:border-dark-border dark:bg-dark-secondary dark:text-dark-secondary-foreground",
      };
  }
};

const BrandBlock = ({ compact = false, roleConfig }) => {
  const RoleIcon = roleConfig.Icon;

  return (
    <div className={`flex min-w-0 ${compact ? "items-center gap-3" : "flex-col gap-4"}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-dark-primary">
          <LayoutDashboard size={20} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-foreground dark:text-dark-foreground">
            SDC Admin
          </h1>
          {!compact && (
            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">
              Dashboard Control Center
            </p>
          )}
        </div>
      </div>

      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${roleConfig.className}`}
        title={`Logged in as ${roleConfig.label}`}
      >
        <RoleIcon size={13} strokeWidth={2.4} />
        {roleConfig.label}
      </span>
    </div>
  );
};

const NavLinks = ({ location, onNavigate }) => (
  <div className="flex flex-col gap-1.5">
    {adminNav.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={`
            flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all
            ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm dark:bg-dark-primary dark:text-dark-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground dark:text-dark-muted-foreground dark:hover:bg-dark-secondary dark:hover:text-dark-foreground"
            }
          `}
        >
          <Icon size={18} />
          <span>{item.name}</span>
        </Link>
      );
    })}
  </div>
);

const Actions = ({ stacked = false, theme, toggleTheme, onLogout, onNavigateHome }) => (
  <div className={stacked ? "grid gap-2" : "flex items-center gap-2"}>
    <Link
      to="/"
      onClick={onNavigateHome}
      className={`
        flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm
        font-medium text-foreground transition-all hover:bg-secondary dark:border-dark-border dark:bg-dark-card
        dark:text-dark-foreground dark:hover:bg-dark-secondary
        ${stacked ? "w-full" : ""}
      `}
    >
      <Home size={17} />
      <span>Home</span>
    </Link>

    <button
      type="button"
      onClick={toggleTheme}
      className={`
        flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm
        font-medium text-foreground transition-all hover:bg-secondary dark:border-dark-border dark:bg-dark-card
        dark:text-dark-foreground dark:hover:bg-dark-secondary
        ${stacked ? "w-full" : ""}
      `}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      {stacked && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
    </button>

    <button
      type="button"
      onClick={onLogout}
      className={`
        flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold
        text-primary-foreground transition-all hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground
        ${stacked ? "w-full" : ""}
      `}
    >
      <LogOut size={17} />
      <span>Logout</span>
    </button>
  </div>
);

const NavBar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useContext(themeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const roleConfig = getRoleConfig(user?.role);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const onLogout = () => {
    handleLogout(setIsLoggedIn, setOpen, navigate, logout);
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background/95 p-5 text-foreground shadow-sm backdrop-blur-xl dark:border-dark-border dark:bg-dark-background/95 dark:text-dark-foreground lg:flex lg:flex-col">
        <BrandBlock roleConfig={roleConfig} />

        <div className="mt-8">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase text-muted-foreground dark:text-dark-muted-foreground">
            Manage
          </p>
          <NavLinks location={location} />
        </div>

        <div className="mt-auto rounded-2xl border border-border bg-card p-3 dark:border-dark-border dark:bg-dark-card">
          <Actions
            stacked
            theme={theme}
            toggleTheme={toggleTheme}
            onLogout={onLogout}
            onNavigateHome={() => setOpen(false)}
          />
        </div>
      </aside>

      <nav className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border bg-background/95 px-4 text-foreground shadow-sm backdrop-blur-xl dark:border-dark-border dark:bg-dark-background/95 dark:text-dark-foreground sm:px-6 lg:hidden">
        <BrandBlock compact roleConfig={roleConfig} />

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-border bg-card p-2.5 dark:border-dark-border dark:bg-dark-card"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {open && (
        <div className="fixed left-0 top-20 z-40 w-full border-b border-border bg-background/98 p-4 shadow-xl dark:border-dark-border dark:bg-dark-background/98 lg:hidden">
          <NavLinks location={location} onNavigate={() => setOpen(false)} />
          <div className="mt-4 border-t border-border pt-4 dark:border-dark-border">
            <Actions
              stacked
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={onLogout}
              onNavigateHome={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
