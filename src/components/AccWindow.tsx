import React from "react";
import { User } from "../types/user";
import { ProfileModal } from "./ProfileModal";

interface AccWindowProps {
  currentUser: User;
  onCloseAccount: () => void;
}

export const AccWindow: React.FC<AccWindowProps> = ({ currentUser, onCloseAccount }) => {
  return (
    <ProfileModal currentUser={currentUser} onClose={onCloseAccount} />
  );
};
