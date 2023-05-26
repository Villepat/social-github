import React from "react";
import { Link } from "react-router-dom";

import "../styles/Groups.css";

const fetchGroupPosts = async (groupId) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const response = await fetch(
    `http://localhost:6969/api/serve-group-posts?id=${groupId}`,
    requestOptions
  );
  const data = await response.json();
  if (response.status === 200) {
    console.log("group posts fetched");
    console.log(data);
    return data;
  } else {
    alert("Error fetching group posts.");
  }
};

const postGroupPost = async (groupNumber) => {
  const postInput = document.getElementById("post-textarea");
  const post = postInput.value;
  //check the length of the post
  if (post.length < 10 || post.length > 500) {
    alert("Post must be 10-500 characters long.");
    return;
  }
  console.log("post", post);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ group_id: groupNumber, content: post }),
  };

  const response = await fetch(
    `http://localhost:6969/api/group-posting`,
    requestOptions
  );

  if (response.status === 200) {
    console.log("group post submitted");
    // clear input
    postInput.value = "";
    const updatedPosts = await fetchGroupPosts(groupNumber);
    console.log("updatedPost:", updatedPosts);
    return updatedPosts;
  } else {
    alert("Error posting to group.");
  }
};

const GroupPosts = () => {
  const url = window.location.href;
  const pattern = /groups\/(\d+)/;
  const match = url.match(pattern);
  console.log(match);
  const groupId = match[1];
  const [groupPosts, setGroupPosts] = React.useState([]);

  React.useEffect(() => {
    const getGroupPosts = async () => {
      const groupPostsFromServer = await fetchGroupPosts(groupId);
      setGroupPosts(groupPostsFromServer);
    };
    getGroupPosts();
    console.log("group posts");
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("post submitted");

    const updatedPosts = await postGroupPost(groupId);
    setGroupPosts(updatedPosts);

    console.log("group posts", groupPosts);
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
    <div>
      <div className="group-post-input">
        {/* <h1>Group Posts</h1>
            <h1>Posts</h1> */}
        <div className="group-post-container">
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            id="post-textarea"
            required
            maxLength="500"
            minLength="10"
            title="Post should be 10-500 characters."
          />
          <button
            type="submit"
            className="group-button-post"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
      {groupPosts ? (
        groupPosts.map((groupPost) => (
          <div className="group-post" key={groupPost.Id}>
            <h3>{groupPost.Post}</h3>
            <h4>{groupPost.FullName} </h4>
            <h4>{formatTimestamp(groupPost.CreatedAt)}</h4>
            <div className="group-post-comment-section">
              <Link to={`/group/${groupId}/group-post/${groupPost.Id}`}>
                Open Comments
              </Link>
            </div>

            {/* <h4>{formatCreatedAt(groupPost.CreatedAt)}</h4> */}
          </div>
        ))
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export default GroupPosts;
