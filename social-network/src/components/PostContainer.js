import React from "react";
import "../styles/PostContainer.css";
import PostingForm from "./PostingForm";
import { Link } from "react-router-dom";

async function fetchPosts() {
  const response = await fetch("http://localhost:6969/api/posts");
  const data = await response.json();
  if (response.status === 200) {
    console.log("posts fetched");
    console.log(data.posts);
    return data.posts;
  } else {
    alert("Error fetching posts.");
  }
}

async function likePost(postId) {
  const response = await fetch(
    `http://localhost:6969/api/post/like?id=${postId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (response.status === 200) {
    console.log(`Post ${postId} liked`);
  } else {
    alert(`Error liking post ${postId}`);
  }
}

function PostContainer() {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
    getPosts();
  }, []);

  console.log("posts:", posts);

  const handleLikeClick = async (postId) => {
    await likePost(postId);
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

  return (
    <div className="post-container">
      <PostingForm fetchPosts={fetchPosts} setPosts={setPosts} />
      {posts.map((post) => {
        const postImageSrc = post.picture
          ? `data:image/jpeg;base64,${post.picture}`
          : null;

        return (
          <div key={post.id} className="post">
            <Link to={`/profile/${post.user_id}`}>{post.full_name}</Link>
            {postImageSrc && (
              <img src={postImageSrc} alt="Post" className="post-img" />
            )}
            <h3>{post.content}</h3>
            <h4>{post.date}</h4>
            <button onClick={() => handleLikeClick(post.id)}>Like</button>
            <span>{post.likes} likes</span>
            <Link to={`/post/${post.id}`}>Open Comments</Link>
          </div>
        );
      })}
    </div>
  );
}
export default PostContainer;
