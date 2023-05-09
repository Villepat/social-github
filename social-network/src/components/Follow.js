import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";

function Follow({ userId }) {
  console.log("inside Follow.js");
  const { userID } = useAuth();

  useEffect(() => {
    const handleFollow = async () => {
      const requestOptions = {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          followee: userId,
          follower: userID,
        }),

        credentials: "include",
      };

      const response = await fetch(
        "http://localhost:6969/api/follow",
        requestOptions
      );

      if (response.ok) {
        console.log("followed");
      } else {
        console.log("follow failed");
      }
    };
    handleFollow();
  }, [userId, userID]);

  // Render nothing, as this component is only for handling side effect
  return null;
}

export default Follow;
