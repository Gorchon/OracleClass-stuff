// src/components/LoginModal.tsx

import React, { useState } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
} from "../services/api";
import "./LoginModal.css";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    try {
      await registerWithEmail(email, password, displayName);
      onClose();
    } catch {
      setError("Registration failed. Email might be in use.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      setError("Google sign‑in failed");
    }
  };

  return (
    <div className="login-modal-backdrop" onClick={onClose}>
      <div
        className="login-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="login-modal-header">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <button
            className="login-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {error && <div className="login-modal-error">{error}</div>}

        <form
          className="login-modal-form"
          onSubmit={isRegistering ? handleRegister : handleEmailLogin}
        >
          {isRegistering && (
            <div className="login-modal-form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-modal-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-modal-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-modal-actions">
            <button type="submit" className="login-modal-submit-btn">
              {isRegistering ? "Register" : "Login"}
            </button>
          </div>
        </form>

        <button className="login-modal-google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png"
            alt="Google logo"
            className="login-modal-google-icon"
          />
          Sign in with Google
        </button>

        <footer className="login-modal-footer">
          <button
            className="login-modal-toggle-btn"
            onClick={() => {
              setError("");
              setIsRegistering(!isRegistering);
            }}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;
