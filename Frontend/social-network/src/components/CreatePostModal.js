import React, { useState } from "react";

function CreatePostModal(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit post data to backend
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
        <form onSubmit={handleSubmit}>
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
