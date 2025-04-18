// src/hooks/useConfirmation.ts
import { useState, useCallback } from "react";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import React from "react";

type ConfirmationConfig = {
  title: string;
  message: React.ReactNode;
  onConfirm: () => Promise<void> | (() => void);
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "neutral";
};

type ConfirmationState = ConfirmationConfig & {
  isOpen: boolean;
};

export const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
    {
      isOpen: false,
      title: "",
      message: "",
      onConfirm: async () => {},
    }
  );

  const confirm = useCallback((config: ConfirmationConfig) => {
    setConfirmationState({
      isOpen: true,
      ...config,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      await confirmationState.onConfirm();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setConfirmationState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [confirmationState.onConfirm]);

  const handleCancel = useCallback(() => {
    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const Confirmation = useCallback(
    () => (
      <ConfirmationDialog
        isOpen={confirmationState.isOpen}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
        variant={confirmationState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [confirmationState, handleConfirm, handleCancel]
  );

  return { confirm, Confirmation };
};

export default useConfirmation;
