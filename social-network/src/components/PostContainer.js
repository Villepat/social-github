import React from "react";
import "../styles/PostContainer.css"

function PostContainer({ posts, setPosts }) {
    return (
        <div className="post-container">
            {posts.map((post) => (
                <div className="post">
                    <p>{post.content}</p>
                    <p>{post.date}</p>
                </div>
            ))}
        </div>
    );
}

export default PostContainer;