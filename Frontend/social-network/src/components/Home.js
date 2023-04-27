import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import "./Home.css";
import Button from "./Button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const toggleCreatePost = () => {
    setShowCreatePost((prevShowCreatePost) => !prevShowCreatePost);
    // Add class to body to hide navbar
    document.body.classList.toggle("modal-open");
  };
  let isLoggedIn = false;
  // check if cookie named token exists

  if (Cookies.get("token") === undefined) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }
  if (!isLoggedIn) {
    return (
      <div>
        <div className="loginregister-container">
          <LoginForm />
          <RegisterForm />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="topnav">
          <Link to="/" className="active">
            Home
          </Link>
          <Link to="/profile">Profile</Link>
          <Link to="/chat">Chat</Link>
          <Link to="#" onClick={toggleCreatePost}>
            Create a Post
          </Link>
          <div className="search-container">
            <form action="/search">
              <input type="text" placeholder="Search.." name="search" />
              <Link to="/search" type="submit">
                Search
              </Link>
            </form>
          </div>
        </div>
        {showCreatePost && (
          <CreatePostModal
            show={showCreatePost}
            toggleCreatePost={toggleCreatePost}
          />
        )}
        <div className="h">
          <style jsx>{`
            .h {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 1rem;
              margin-top: 5rem;
              height: 3rem;
              border-bottom: 1px solid #e5e5e5;
            }
          `}</style>
    
          <h1>Logged in</h1>
          <Button buttonType="Logout" />
        </div>
      </>
    );
  }
}


export default Home;
