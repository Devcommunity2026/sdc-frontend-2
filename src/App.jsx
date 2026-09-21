import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
import ThemeProvider from "./contexts/ThemeProvider";
import AuthProvider from "./contexts/AuthProvider";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import Domains from "./pages/Domains";
import Careers from "./pages/Careers";
import Projects from "./pages/Projects";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/admin/UserDashboard";
import ApplicationDashboard from "./pages/admin/ApplicationDashboard";
import ContentDashboard from "./pages/admin/ContentDashboard";
import SettingDashboard from "./pages/admin/SettingDashboard";
import Root from "./pages/workspace/root";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SecureRoute from "./components/SecureRoute";
import NoAccess from "./components/NoAccess";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <>
            <ScrollToTop />
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/domains" element={<Domains />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/pageNotFound" element={<NoAccess />} />
              <Route path="/admin/user" element={
                <SecureRoute>
                  < UserDashboard />
                </SecureRoute >
              } />
              <Route path="/admin/alumni" element={
                <SecureRoute>
                  <UserDashboard defaultType="Alumni" />
                </SecureRoute>
              } />
              <Route path="/admin/content" element={<SecureRoute><ContentDashboard /></SecureRoute>} />
              <Route path="/admin/application" element={<SecureRoute><ApplicationDashboard /></SecureRoute>} />
              <Route path="/admin/settings" element={<SecureRoute><SettingDashboard /></SecureRoute>} />
              <Route path="/admin/user/settings" element={<SecureRoute><SettingDashboard /></SecureRoute>} />
              <Route path="/workspace/" element={<Root />} />

              {/* Public Auth Pages */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              <Route
                path="/verify-otp"
                element={
                  <PublicRoute>
                    <VerifyOTP />
                  </PublicRoute>
                }
              />

              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/verify"
                element={
                  <PublicRoute>
                    <Verify />
                  </PublicRoute>
                }
              />

              {/* Example Protected Route */}
              {/* 
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              */}

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

          </>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
