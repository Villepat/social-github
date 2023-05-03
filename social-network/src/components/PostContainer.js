import React from "react";
import "../styles/PostContainer.css";
function PostContainer({ posts, setPosts }) {
  return (
    <div className="post-container">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.content}</h3>
          <h4>{post.date}</h4>
          <h4>{post.full_name}</h4>
        </div>
      ))}
    </div>
  );
}
export default PostContainer;
