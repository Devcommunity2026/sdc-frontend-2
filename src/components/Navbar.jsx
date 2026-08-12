import React, { useContext, useState, useEffect } from "react";
import navData from "../data/navData";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import darkLogo from "../assets/logo-white.png";
import logo from "../assets/logo.png";
import { themeContext } from "../contexts/ThemeProvider";
import Button from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogout, checkLogin } from "../controllers/loginRequest";
import { useAuth } from "../contexts/AuthProvider";
const Navbar = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verify";
  const { logout } = useAuth()

  const navigate = useNavigate();
  const { theme, setTheme } = useContext(themeContext);
  const [isOpen, setIsOpen] = useState(false);

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Update navbar instantly when login/logout happens
  useEffect(() => {
    window.addEventListener("storage", () => checkLogin(setIsLoggedIn));
    checkLogin(setIsLoggedIn);
    return () => {
      window.removeEventListener("storage", () => checkLogin(setIsLoggedIn));
    };
  }, []);


  // Login
  const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
  };

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav
      className="w-full fixed left-0 top-0 h-20 shadow-md dark:shadow-dark-accent flex items-center justify-between px-6 md:px-10 backdrop-blur-lg z-50 
      bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground"
    >
      {/* Logo */}
      <img
        src={theme !== "dark" ? logo : darkLogo}
        alt="logo"
        className="h-10 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-2">
        {navData.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
              ${location.pathname === item.path
                ? "bg-primary/20 text-primary"
                : "hover:bg-black/10 dark:hover:bg-white/10"
              }
              transition-all`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          className="rounded-md bg-secondary dark:bg-dark-secondary px-3 py-3"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <Button onClick={() => {
            handleLogout(setIsLoggedIn, setIsOpen, navigate, logout)
          }}>Logout</Button>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div
        className="lg:hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-20 left-0 w-full bg-background dark:bg-dark-background shadow-lg"
          >
            <div className="px-4 py-4 space-y-2 text-sm">

              {navData.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${location.pathname === item.path
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-black/10 dark:hover:bg-white/10"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 mt-3">

                {/* Theme Button */}
                <button
                  onClick={toggleTheme}
                  className="flex-1 p-3 rounded-lg bg-secondary dark:bg-dark-secondary text-sm flex items-center justify-center gap-2"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>

                {/* Login / Logout */}
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => handleLogout(setIsLoggedIn, setIsOpen, navigate, logout)}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLogin(setIsLoggedIn)}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
                  >
                    Login
                  </button>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;