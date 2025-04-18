// src/components/DeleteButton.tsx
import React, { useCallback } from "react";
import { useConfirmation } from "../hooks/useConfirmation";

interface DeleteButtonProps {
  onDelete: () => Promise<void> | void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  const { confirm, Confirmation } = useConfirmation();

  const handleDelete = useCallback(async () => {
    try {
      await onDelete();
      // Optional: you could show a toast or success message here
    } catch (error) {
      console.error("Delete failed:", error);
      // Optional: you could set an error state or show an error message here
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
      <button className="delete-button" onClick={showConfirmation}>
        Delete
      </button>
      <Confirmation />
    </>
  );
};

export default DeleteButton;
