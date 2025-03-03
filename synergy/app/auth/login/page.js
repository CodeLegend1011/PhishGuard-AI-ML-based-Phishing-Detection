"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.css"; // Import the updated CSS file

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section: Login Form */}
      <div className="login-left">
        <h2 className="login-title">Log in to your account</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {error && <p className="errorMessage">{error}</p>}
          <input
            type="email"
            placeholder="Email Address"
            className="input1"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="input1"
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="submit">Login</button>
        </form>

        {/* Signup Message with Inline CSS */}
        <p style={{ color: "black", marginTop: "1rem" }}>
          Don't have an account? <a href="/auth/signup" className="signup-link">Sign Up</a>
        </p>
      </div>

      {/* Right Section: Background Illustration */}
      <div className="login-right"></div>
    </div>
  );
}
