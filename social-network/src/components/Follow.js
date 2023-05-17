import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import socket from "../webSocket";

function Follow({ userId }) {
  console.log("inside Follow.js");
  const { userID } = useAuth();

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

    socket.send(
      JSON.stringify({
        type: "follow",
        followee: userId,
        follower: userID,
      })
    );
  };

  useEffect(() => {
    handleFollow();
  }, [userId, userID]);

  return <></>;
}

export default Follow;
