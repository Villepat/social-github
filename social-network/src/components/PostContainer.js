import React from "react";
import "../styles/PostContainer.css";
import PostingForm from "./PostingForm";
import { Link } from "react-router-dom";

// Function to retrieve liked post IDs from localStorage
function getLikedPostsFromStorage() {
  const likedPosts = localStorage.getItem("likedPosts");
  return likedPosts ? JSON.parse(likedPosts) : [];
}

// Function to save liked post IDs to localStorage
function saveLikedPostsToStorage(likedPosts) {
  localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
}

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
  const [likedPosts, setLikedPosts] = React.useState(getLikedPostsFromStorage);

  React.useEffect(() => {
    const getPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
    getPosts();
  }, []);

  React.useEffect(() => {
    // Update localStorage when likedPosts state changes
    saveLikedPostsToStorage(likedPosts);
  }, [likedPosts]);

  console.log("posts:", posts);

  const handleLikeClick = async (postId) => {
    await likePost(postId);
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };
    const formatTimestamp = (dateTime) => {
      const options = {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateTime).toLocaleString(undefined, options);
    };

  return (
    <div className="allposts">
      <div className="post-container">
        <PostingForm fetchPosts={fetchPosts} setPosts={setPosts} />
        {posts.map((post) => {
          const postImageSrc = post.picture
            ? `data:image/jpeg;base64,${post.picture}`
            : null;

          const isLiked = likedPosts.includes(post.id);
          const activeUserLike = posts[0].likers.find(
            (liker) => liker === sessionStorage.getItem("userID")
          );
          let temp = false;
          if (activeUserLike !== undefined) {
            temp = true;
          } else {
            temp = false;
          }

          console.log("activeUserLike:", activeUserLike);

          return (
            <div key={post.id} className="post">
              <div className="poster">
                <Link to={`/profile/${post.user_id}`}>{post.full_name}</Link>
              </div>

              {postImageSrc && (
                <img src={postImageSrc} alt="Post" className="post-img" />
              )}
              <div className="post-content">{post.content}</div>
              <div className="post-date">{formatTimestamp(post.date)}</div>

              <i
                onClick={() => {
                  toggleLike(post.id);
                  handleLikeClick(post.id);
                }}
                className={`fa fa-thumbs-up ${temp ? "liked" : ""}`}
              ></i>
              <div className="likes">
                <span>{post.like_count} </span>
              </div>

              <div className="opencomments">
                <Link to={`/post/${post.id}`}>Open Comments</Link>
              </div>

              <span>{post.likes} </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default PostContainer;
