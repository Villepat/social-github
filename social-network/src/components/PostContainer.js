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

  const SubmitComment = async (e) => {
    e.preventDefault();
    console.log("comment submitted");

    // send post to database
    const commentInput = document.getElementById("comment");
    const fileInput = document.getElementById("comment-file");
    const postIdInput = document.getElementById("post_id");

    if (!postIdInput || !postIdInput.value) {
      alert("Post ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("post_id", postIdInput.value);
    formData.append("content", commentInput.value);

    if (fileInput && fileInput.files[0]) {
      formData.append("comment", fileInput.files[0]);
    }

    const requestOptions = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    const response = await fetch(
      "http://localhost:6969/api/commenting",
      requestOptions
    );
    const data = await response.text();
    console.log(data);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData.status === 200) {
        // clear form
        document.getElementById("comment").value = "";
        // fetch posts again
        setPosts(await fetchPosts());
      } else {
        alert("Error posting.");
      }
    } else {
      alert("Error: empty response.");
    }
  };

  console.log("posts:", posts);

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
            <form>
              <input type="hidden" id="post_id" value={post.id} />
              <textarea
                className="comment-box"
                type="text"
                rows="10"
                placeholder="Comment here"
                id="comment"
              />

              <button className="submit-comment" onClick={SubmitComment}>
                Comment
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
export default PostContainer;
