import React from "react";
import { useAuth } from "../AuthContext";
import ProfileCard from "../components/ProfileCard";

function Profile() {
  // const { nickname } = useAuth();
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <ProfileCard user={user} />
    </div>
  );
}

export default Profile;
