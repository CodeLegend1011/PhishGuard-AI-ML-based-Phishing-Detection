"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import "./styles/landingPage.css";

export default function LandingPage() {
  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        {/* Logo with Image */}
        <div className="flex items-center space-x-2">
          <img
            src="/logo_phishguard.png" // Path to your logo image
            alt="PhishGuard Logo"
            className="w-8 h-8 rounded-full" // Making the logo circular (adjust size as needed)
          />
          <h1 className="logo">PhishGuard</h1>
        </div>
        
        <div className="nav-links">
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#about" className="nav-link">About</Link>
        </div>
        <div className="auth-buttons">
          <Link href="/auth/login" className="auth-btn primary">Login</Link>
          <Link href="/auth/signup" className="auth-btn secondary">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-title"
        >
          Protect Your Digital Identity
        </motion.h2>
        <p className="hero-description">
          AI-driven security solutions to keep you safe from cyber threats.
        </p>
        <div className="cta-buttons">
          <Link href="/auth/signup" className="cta-btn primary">Get Started</Link>
          <Link href="#features" className="cta-btn secondary">Learn More</Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
          <h3>Real-Time Threat Detection</h3>
          <p>Stay informed with instant alerts on potential risks.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
          <h3>AI-Powered Security</h3>
          <p>Advanced machine learning algorithms to detect phishing attempts.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
          <h3>Comprehensive Analytics</h3>
          <p>Gain insights into your online security with in-depth reports.</p>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>Why Choose PhishGuard?</h2>
        <p>PhishGuard is designed to provide cutting-edge protection against phishing and cyber threats. Our AI-driven approach ensures that your digital identity remains secure by detecting and blocking malicious attempts before they can cause harm. With real-time monitoring, intelligent threat analysis, and user-friendly security insights, PhishGuard empowers you to browse, communicate, and transact online with confidence.</p>
      </section>
    </div>
  );
}
