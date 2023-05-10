import React from 'react'
import ErrorPage from './ErrorPage'

const fetchSinglePost = async (postId) => {
    const response = await fetch(`http://localhost:6969/api/posts?id=${postId}`)
    const data = await response.json()
    if (response.status === 200) {
        console.log("posts fetched")
        console.log(data.posts)
        return data.posts[0]
    } else {
        alert("Error fetching posts.")
    }
}

const fetchComments = async (postId) => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    }
    const response = await fetch(
        `http://localhost:6969/api/serve-comments?id=${postId}`,
        requestOptions
    )
    const data = await response.json()
    if (response.status === 200) {
        console.log("comments fetched")
        console.log(data.comments)
        return data.comments
    } else {
        alert("Error fetching comments.")
    }
}


const SinglePostView = () => {
    const url = window.location.href
    console.log(url)
    //localhost:3000/posts/1
    const pattern = /(\d+)$/
    const match = url.match(pattern)
    console.log(match)
    const postId = match[1]
    const [post, setPost] = React.useState([])
    const [comments, setComments] = React.useState([])
    React.useEffect(() => {
        const getPost = async () => {
            const postFromServer = await fetchSinglePost(postId)
            setPost(postFromServer)
        }
        getPost()
    }, [])
    React.useEffect(() => {
        const getComments = async () => {
            const commentsFromServer = await fetchComments(postId)
            setComments(commentsFromServer)
        }
        getComments()
    }, [])


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
    const data = await response.text();
    console.log(data);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData.status === 200) {
        // clear form
        document.getElementById("comment").value = "";
        console.log(jsonData);
      } else {
        alert("Error posting.");
      }
    } else {
      alert("Error: empty response.");
    }
  };

    if (!post) {
        return <ErrorPage errorType="500"/>
    }
  return (
    <div>
    <div>SinglePostView</div>
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
        <div>Post</div>
        <div>{post.content}</div>
        <div>{post.created_at}</div>
        <div>{post.full_name}</div>
    { comments ? (
        <div>
            <div>Comments</div>
            <div>{comments.map((comment) => (
                <div key={comment.id}>
                    <div>{comment.content}</div>
                    <div>{comment.created_at}</div>
                    <div>{comment.full_name}</div>
                </div>
            ))}
        </div>
        </div>
    ) : ( 
        <div>no comments</div>
    )}
    </div>
  )
}

export default SinglePostView