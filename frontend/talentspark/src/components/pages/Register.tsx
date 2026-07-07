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
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Create an Account</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p>
        Already have an account? <button type="button" onClick={onSwitchToLogin}>Login</button>
      </p>
    </form>
  );
}
