import { useState } from "react";
import { login } from "../../Services/AuthService";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password });
      onLogin(response.access_token);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>Welcome Back</h2>
        <p>Log in to access your TalentSpark hiring panel</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
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

          <button
            type="submit"
            className="save-btn"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="switch-text">
          Don't have an account?
          <button type="button" onClick={onSwitchToRegister}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;