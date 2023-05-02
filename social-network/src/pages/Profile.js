import React from "react";
import { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const requestOption = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send the cookie along with the request
      };
      const response = await fetch(
        "http://localhost:6969/api/user",
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

    fetchUserData();
  }, []);

  if (!user) {
    return <div>log in to see your profile here!</div>;
  }

  return <ProfileCard user={user} />;
}

export default Profile;
