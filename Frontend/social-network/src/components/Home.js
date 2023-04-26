import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import "./Home.css";

function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const toggleCreatePost = () => {
    setShowCreatePost((prevShowCreatePost) => !prevShowCreatePost);
    // Add class to body to hide navbar
    document.body.classList.toggle("modal-open");
  };

  return (
    <>
      <div className="topnav">
        <a className="active" href="#home">
          Home
        </a>
        <a href="#profile">Profile</a>
        <a href="#bals">Chat</a>
        <a href="#" onClick={toggleCreatePost}>
          Create a Post
        </a>
        <div className="search-container">
          <form action="/search">
            <input type="text" placeholder="Search.." name="search" />
            <a href="#sus" type="submit">
              Search
            </a>
          </form>
        </div>
      </div>
      {showCreatePost && (
        <CreatePostModal
          show={showCreatePost}
          toggleCreatePost={toggleCreatePost}
        />
      )}
    </>
  );
}

export default Home;
