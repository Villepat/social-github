import React from "react";

const PostingForm = ({ fetchPosts, setPosts }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("post submitted");

    // send post to database after validation
    const post = document.getElementById("post").value;
    if (post.length < 10 || post.length > 500) {
      alert("Post must be 10-500 characters long.");
      return;
    }
    const privacyInput = document.getElementById("privacy");
    const picture = document.getElementById("picture");

    const formData = new FormData();
    formData.append("content", post);
    formData.append("privacy", privacyInput.value);
    if (picture.files[0]) {
      formData.append("picture", picture.files[0]);
    }

    const requestOptions = {
      method: "POST",
      // headers object is removed since the browser will set the correct content type and boundary for FormData
      body: formData,
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
      // fetch posts again
      setPosts(await fetchPosts());
    } else {
      alert("Error posting.");
    }
  };
  return (
    <div className="posting-form">
      <form>
        <textarea
          className="post-box"
          type="text"
          rows="10"
          placeholder="What's on your mind?"
          id="post"
          required
          maxLength="500"
          minLength="10"
          title="Post should be 10-500 characters."
        />

        <label className="upload" htmlFor="picture">
          Upload nudes
        </label>
        <input type="file" id="picture" />
        <select id="privacy">
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="onlyme">Only me</option>
        </select>
        <button className="submit-post" onClick={handleSubmit}>
          Post
        </button>
      </form>
    </div>
  );
};

export default PostingForm;
