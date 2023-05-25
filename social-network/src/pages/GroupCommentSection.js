import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GroupCommentView.css";
import ErrorPage from "./ErrorPage";
import { Link } from "react-router-dom";

const fetchSinglePost = async (postId, groupId) => {
  const response = await fetch(
    `http://localhost:6969/api/serve-group-posts?group-postID=${postId}&id=${groupId}`
  );
  const data = await response.json();
  if (response.status === 200) {
    console.log("posts fetched");
    console.log(data.posts);
    return data;
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
    `http://localhost:6969/api/serve-group-comments?id=${postId}`,
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

const GroupCommentView = () => {
  const navigate = useNavigate();
  const url = window.location.href;
  const pattern = /(\d+)$/;
  const regex = /group\/(\d+)/;
  const groupIdMatch = url.match(regex);
  const groupId = groupIdMatch[1];
  console.log(groupId);
  const match = url.match(pattern);
  const postId = match[1];
  console.log("post", postId);
  const [post, setPost] = React.useState([]);
  const [comments, setComments] = React.useState([]);

  const redirectToHome = () => {
    navigate("/groups");
  };

  React.useEffect(() => {
    const getPost = async () => {
      const postFromServer = await fetchSinglePost(postId, groupId);
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
      "http://localhost:6969/api/group-commenting",
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
    <div className="comment-container">
      <div className="postview-title">SinglePostViewXD</div>
      <button className="back-button" onClick={redirectToHome}>
        X
      </button>
      <div className="singlepost">
        <div className="og-author">
          <Link to={`/profile/${post.user_id}`}>{post.full_name}</Link>
        </div>
        <div className="og-content">{post.content}</div>
        {post.picture ? (
          <div className="og-image">
            <img
              src={`data:image/jpeg;base64,${post.picture}`}
              className="pic"
            ></img>
          </div>
        ) : null}
        <div className="og-timecreated">{formatTimestamp(post.date)}</div>
      </div>
      <form>
        <input type="hidden" id="post_id" value={post.id} />
        <textarea
          className="comment-box"
          type="text"
          rows="5"
          placeholder="Comment here..."
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
              <div className="yourcomment" key={comment.id}>
                <div className="commentator">{comment.full_name}</div>
                <div className="new-comment">{comment.content}</div>
                <div className="comment-time">
                  {formatTimestamp(comment.created_at)}
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

export default GroupCommentView;
