// src/components/DeleteButton.tsx
import React, { useCallback } from "react";
import { useConfirmation } from "../hooks/useConfirmation";

export interface DeleteButtonProps {
  onDelete: () => Promise<void> | void;
  className?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  className = "delete-button",
}) => {
  const { confirm, Confirmation } = useConfirmation();

  const handleDelete = useCallback(async () => {
    try {
      await onDelete();
      // Optional: toast success here
    } catch (error) {
      console.error("Delete failed:", error);
      // Optional: show error UI
    }
  }, [onDelete]);

  const showConfirmation = useCallback(() => {
    confirm({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this item?",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: handleDelete,
    });
  }, [confirm, handleDelete]);

  return (
    <>
      <button className={className} onClick={showConfirmation}>
        Delete
      </button>
      <Confirmation />
    </>
  );
};

export default DeleteButton;
