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
    

  return (
    <div className="post-container">
      <PostingForm fetchPosts={fetchPosts} setPosts={setPosts} />
      {posts.map((post) => (
        <div key={post.id} className="post">
          <Link to={`/profile/${post.user_id}`}>{post.full_name}</Link>
          <h3>{post.content}</h3>
          <h4>{post.date}</h4>
        </div>
      ))}
    </div>
  );
}
export default PostContainer;
