import React, { useState } from "react";
import "./PostModal.css";

function CreatePostModal(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const post = {
      user_id: 2,
      title: title,
      content: content,
      privacy: 0,
    };

    const response = await fetch("http://localhost:6969/api/posting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();
    console.log(data);
    if (data.message === "success") {
      alert("Post created successfully!");
    } else {
      alert("Post creation failed!");
    }

    props.onHide();
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePrivacyChange = (event) => {
    setIsPublic(event.target.value === "public");
  };

  return (
    <div className="modal" style={{ display: props.show ? "block" : "none" }}>
      <div className="modal-content">
        <form className="post-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
          />
          <label htmlFor="privacy">Privacy:</label>
          <select
            id="privacy"
            value={isPublic ? "public" : "private"}
            onChange={handlePrivacyChange}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="super-private">Super Private</option>
          </select>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
