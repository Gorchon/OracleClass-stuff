// src/components/LogoutButton.tsx
import React, { useState, useCallback } from "react";
import { useConfirmation } from "../hooks/useConfirmation";
import { logout } from "../services/api";
import "../styles.css";

/**
 * Button that shows a confirmation dialog before logging out.
 */
export const LogoutButton: React.FC = () => {
  const { confirm, Confirmation } = useConfirmation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  const showLogoutConfirmation = useCallback(() => {
    confirm({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: isLoggingOut ? "Logging out..." : "Logout",
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: handleLogoutConfirm,
    });
  }, [confirm, handleLogoutConfirm, isLoggingOut]);

  return (
    <>
      <button
        onClick={showLogoutConfirmation}
        className="logout-button"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
      <Confirmation />
    </>
  );
};

export default LogoutButton;
