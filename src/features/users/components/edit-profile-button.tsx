"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";

interface EditProfileButtonProps {
  user: UserData;
}
export const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>

      <EditProfileModal
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
