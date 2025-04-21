// src/components/ConfirmationDialog.tsx
import React, { ReactNode } from "react";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "neutral";
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "neutral",
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="confirmation-dialog-backdrop" onClick={onCancel}>
      <div className="confirmation-dialog-container" onClick={stop}>
        <div className="confirmation-dialog-content">
          <h3 className="confirmation-dialog-title">{title}</h3>
          <div className="confirmation-dialog-message">{message}</div>
        </div>

        <div className="confirmation-dialog-actions">
          <button
            type="button"
            className={`confirmation-dialog-button confirm-button ${variant}`}
            onClick={(e) => {
              stop(e);
              onConfirm();
            }}
          >
            {confirmText}
          </button>

          <button
            type="button"
            className="confirmation-dialog-button cancel-button"
            onClick={(e) => {
              stop(e);
              onCancel();
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
