import React from "react";
import "../styles/CommentPage.css";
import ErrorPage from "./ErrorPage";

const fetchSinglePost = async (postId) => {
  const response = await fetch(`http://localhost:6969/api/posts?id=${postId}`);
  const data = await response.json();
  if (response.status === 200) {
    console.log("posts fetched");
    console.log(data.posts);
    return data.posts[0];
  } else {
    alert("Error fetching posts.");
  }
};

const fetchComments = async (postId) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  const response = await fetch(
    `http://localhost:6969/api/serve-comments?id=${postId}`,
    requestOptions
  );
  const data = await response.json();
  if (response.status === 200) {
    console.log("comments fetched");
    console.log(data.comments);
    return data.comments;
  } else {
    alert("Error fetching comments.");
  }
};

const SinglePostView = () => {
  const url = window.location.href;
  console.log(url);
  //localhost:3000/posts/1
  const pattern = /(\d+)$/;
  const match = url.match(pattern);
  console.log(match);
  const postId = match[1];
  const [post, setPost] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const getPost = async () => {
      const postFromServer = await fetchSinglePost(postId);
      setPost(postFromServer);
    };
    getPost();
  }, []);
  React.useEffect(() => {
    const getComments = async () => {
      const commentsFromServer = await fetchComments(postId);
      setComments(commentsFromServer);
    };
    getComments();
  }, []);

  const SubmitComment = async (e) => {
    e.preventDefault();
    console.log("comment submitted");

    // send post to database
    const commentInput = document.getElementById("comment");
    const fileInput = document.getElementById("comment-file");

    if (!postId) {
      alert("Post ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("post_id", postId);
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
    if (response.status === 200) {
      console.log("im in here");
      // clear form
      document.getElementById("comment").value = "";
      console.log(response);
      // fetch posts again
      let updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    } else {
      alert("Error posting.");
    }
  };

  if (!post) {
    return <ErrorPage errorType="500" />;
  }
  return (
    <div className="comment-container">
      <div className="postview-title">SinglePostView</div>

      <div>Post</div>
      <div className="og-author">{post.full_name}</div>
      <div className="og-content">{post.content}</div>
      {post.picture ? (
        <div className="og-image">
          <img
            src={`data:image/jpeg;base64,${post.picture}`}
            className="pic"
          ></img>
        </div>
      ) : null}
      <div className="og-timecreated">{post.date}</div>

      <form>
        <input type="hidden" id="post_id" value={post.id} />
        <textarea
          className="comment-box"
          type="text"
          rows="5"
          placeholder="Comment here"
          id="comment"
        />
        <button className="submit-comment" onClick={SubmitComment}>
          Comment
        </button>
      </form>
      {comments ? (
        <div>
          <div className="comment-section">Comment Section</div>
          <div className="commentbox-container">
            {comments.map((comment) => (
              <div className="yourcomment">
                <div key={comment.id}>
                  <div className="commentator">{comment.full_name}</div>
                  <div className="new-comment">{comment.content}</div>
                  <div className="comment-time">{comment.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>no comments</div>
      )}
    </div>
  );
};

export default SinglePostView;
