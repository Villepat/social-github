import React from 'react'

const PostingForm = ({ fetchPosts, setPosts }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("post submitted");
        // send post to database
        const post = document.getElementById("post").value;
        const privacyInput = document.getElementById("privacy");
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
          // fetch posts again
          setPosts(await fetchPosts());
          alert("Post submitted successfully!");
        } else {
          alert("Error submitting post.");
        }
      };
  return (
    <form>
        <textarea
        className="post-box"
        type="text"
        rows="10"
        placeholder="What's on your mind?"
        id="post"
        />
        <select id="privacy">
        <option value="public">Public</option>
        <option value="friends">Friends</option>
        <option value="onlyme">Only me</option>
        </select>
        <button className="submit-post" onClick={handleSubmit}>
        Post
        </button>
    </form>
  )
}

export default PostingForm