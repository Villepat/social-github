import React from "react";
import { useAuth } from "../AuthContext";
import PostContainer from "../components/PostContainer";
import "../styles/PostContainer.css";

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

function Home() {
  const { loggedIn, nickname } = useAuth();
  const [posts, setPosts] = React.useState([]);
  
  React.useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
    getPosts();
  }, []);
  
  console.log("posts:", posts);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("post submitted");
    // send post to database
    const post = document.getElementById("post").value;
    const privacyInput = document.getElementById('privacy');
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        'content': post,
        'privacy': privacyInput.value,
      }),
      credentials: "include",
    };

    const response = await fetch(
      "http://localhost:6969/api/posting",
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (data.status === 200) {
      // clear form
      document.getElementById("post").value = "";
      alert("Post submitted successfully!");
    } else {
      alert("Error submitting post.");
    }
    setPosts(await fetchPosts());
  };

  return (
    <div className="social-network-header">
      <h1>Welcome to My Social Network</h1>
      {/* <p>Connect with friends, share your thoughts, and more!</p> */}
      {loggedIn ? (
        <div>
          <div>
            <p>hello {nickname}! Start connecting with your friends now.</p>
            <form>
              <textarea className="post-box" type="text" rows="10" placeholder="What's on your mind?" id="post" /> 
              <select id="privacy">
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="onlyme">Only me</option>
              </select>
              <button className="submit-post" onClick={handleSubmit}>Post</button>
            </form>
          </div>
          <div className="posts-container">
            <h1 className="post-header">Posts</h1>
            <PostContainer posts={posts} setPosts={setPosts} />
          </div>
        </div>
      ) : (
        <p>Register or login to continue.</p>
      )}
    </div>
  );
}

export default Home;
