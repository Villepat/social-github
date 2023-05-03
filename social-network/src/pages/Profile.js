import React from "react";
import { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Profile() {
  const [user, setUser] = useState(null);
  let { userId } = useParams();
  const { userID } = useAuth();
  if (!userId) {
    userId = userID;
  }

  useEffect(() => {
    async function fetchUserData(userId) {
      console.log("fetching user data for user id: " + userId);
      const requestOption = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send the cookie along with the request
      };
      const response = await fetch(
        "http://localhost:6969/api/user/" + userId,
        requestOption
      );
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.message);
      } else {
        console.log(data);
        setUser(data.user);
      }
    }

    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  if (!user) {
    return <div>log in to see your profile here!</div>;
  }

  return <ProfileCard user={user} />;
}

export default Profile;
