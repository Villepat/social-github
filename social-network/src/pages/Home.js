import React from "react";
import { useAuth } from "../AuthContext";
import PostContainer from "../components/PostContainer";
import "../styles/PostContainer.css";
import UserList from "../components/UserList";

function Home() {
  const { loggedIn } = useAuth();
  return (
    <div className="social-network-header">
      <div className="welcome">Welcome xdd</div>
      {/* <p>Connect with friends, share your thoughts, and more!</p> */}
      {loggedIn ? (
        <div>
          <div>
            {/* <p>hello {nickname}! Start connecting with your friends now.</p> */}
          </div>
          <div className="user-list-container">
            <div className="user-list-header">Users</div>
            <UserList />
          </div>
          <div className="posts-container">
            <PostContainer />
          </div>
        </div>
      ) : (
        <p>Register or login to continue.</p>
      )}
    </div>
  );
}
export default Home;
