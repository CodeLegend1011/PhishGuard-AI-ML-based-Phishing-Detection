"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/signup.css"; // Import the updated CSS file

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
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
    <div className="signup-container">
      {/* Left Section: Background Illustration */}
      <div className="signup-left"></div>

      {/* Right Section: Signup Form */}
      <div className="signup-right">
        <h2 className="signup-title">Create an account</h2>

        <form onSubmit={handleSignup}>
          {error && <p className="errorMessage">{error}</p>}
          <input 
            type="text" 
            placeholder="Name" 
            className="input1" 
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
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
          <button type="submit" className="submit">Sign Up</button>
        </form>

        {/* Login Message */}
        <p style={{ color: "black", marginTop: "1rem" }}>
          Already have an account? <a href="/auth/login" className="signup-link">Log in</a>
        </p>
      </div>
    </div>
  );
}
