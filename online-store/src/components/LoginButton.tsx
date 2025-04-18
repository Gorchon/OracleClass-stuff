// src/components/LoginButton.tsx
import React, { useState } from "react";
import LoginModal from "./LoginModal";
import "./LoginModal.css";

/**
 * Simple button that opens the LoginModal.
 */
const LoginButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <button
        className="login-button"
        onClick={() => {
          setIsMenuOpen(false);
          setShowLoginModal(true);
        }}
      >
        Login
      </button>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default LoginButton;
