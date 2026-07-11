import { useState } from "react";
import { register } from "../../Services/AuthService";

import type { RegisterRequest } from "../../types/user";

type Props = {
  onRegister: () => void;
  onSwitchToLogin: () => void;
};

export default function Register({ onRegister, onSwitchToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: RegisterRequest = {
      name,
      email,
      password,
      role,
    };

    try {
      await register(payload);
      onRegister();
    } catch (err) {
      console.error("Registration failed", err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>Create an Account</h2>
        <p>Get started with RecruitIQ AI recruitment</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Recruiter, Manager"
              required
            />
          </div>

          <button
            type="submit"
            className="add-btn"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="switch-text">
          Already have an account?
          <button type="button" onClick={onSwitchToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
