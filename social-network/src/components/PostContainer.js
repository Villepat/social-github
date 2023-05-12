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
    <div className="allposts">
      <div className="post-container">
        <PostingForm fetchPosts={fetchPosts} setPosts={setPosts} />
        {posts.map((post) => {
          const postImageSrc = post.picture
            ? `data:image/jpeg;base64,${post.picture}`
            : null;

          return (
            <div key={post.id} className="post">
              <div className="poster">
                <Link to={`/profile/${post.user_id}`}>{post.full_name}</Link>
              </div>

              {postImageSrc && (
                <img src={postImageSrc} alt="Post" className="post-img" />
              )}
              <div className="post-content">{post.content}</div>
              <div className="post-date">{post.date}</div>
              <div className="opencomments">
                <Link to={`/post/${post.id}`}>Open Comment section</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default PostContainer;
