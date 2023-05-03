import React from "react";
import { useAuth } from "../AuthContext";
import PostContainer from "../components/PostContainer";
import "../styles/PostContainer.css";
import UserList from "../components/UserList";

function Home() {
  const { loggedIn, nickname } = useAuth();
  return (
    <div className="social-network-header">
      <h1>Welcome to My Social Network</h1>
      {/* <p>Connect with friends, share your thoughts, and more!</p> */}
      {loggedIn ? (
        <div>
          <div>
            <p>hello {nickname}! Start connecting with your friends now.</p>
          </div>
          <div className="posts-container">
            <PostContainer/>
          </div>
          <div className="user-list-container">
            <h1 className="user-list-header">Users</h1>
            <UserList />
          </div>
        </div>
      ) : (
        <p>Register or login to continue.</p>
      )}
    </div>
  );
}
export default Home;
