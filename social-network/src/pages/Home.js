import React from "react";
import { useAuth } from "../AuthContext";

function Home() {
  const { loggedIn, nickname } = useAuth();
  return (
    <div>
      <h1>Welcome to My Social Network</h1>
      <p>Connect with friends, share your thoughts, and more!</p>
      {loggedIn ? (
        <p>hello {nickname}! Start connecting with your friends now.</p>
      ) : (
        <p>Register or login to continue.</p>
      )}
    </div>
  );
}

export default Home;
