import React from "react";
import "../styles/GroupPage.css";

const fetchGroupData = async (groupNumber) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const response = await fetch(
    `http://localhost:6969/api/serve-group-data?id=${groupNumber}`,
    requestOptions
  );

  const data = await response.json();
  if (response.status === 200) {
    console.log("group data fetched");
    console.log(data);
    return data.group;
  } else {
    alert("Error fetching group data.");
  }
};


const GroupPage = () => {
  const url = window.location.href;
  const pattern = /groups\/(\d+)/;
  const match = url.match(pattern);
  console.log(match);
  const groupNumber = match[1];
  const [groupData, setGroupData] = React.useState([]);

  React.useEffect(() => {
    const getGroupData = async () => {
      const groupDataFromServer = await fetchGroupData(groupNumber);
      setGroupData(groupDataFromServer);
    };
    getGroupData();
  }, []);


  return (
    <div className="group-page">
      <div className="group-page-header">
        <h1>{groupData.name}</h1>
        <p>{groupData.description}</p>
      <button className="join-button">Join Group</button>
      </div>
        <div className="group-page-body">
          <h1>Members</h1>
          <p>User 1</p>
          <p>User 2</p>
          {/* <ul>
            {groupData.members.map((member) => (
              <li key={member}>{member}</li>  
            ))}
          </ul> */}
        </div>



        <div className="group-page-body">
          <h1>Posts</h1>
          <div className="post-container">
            <textarea
              className="post-textarea"
              placeholder="What's on your mind?"
              id="post-textarea"
            />
            <button className="post-button">Post</button>
            <h2>display the post here:</h2>
            </div>
            </div>
          <div className="group-page-event">
            <h1>Events</h1>
            <p>Event 1</p>
          </div>
          <div className="group-chat-modal">
            <button className="chat-button">Open Groupchat</button>
          </div>

            {/* popup-modal for the group-chat */}
            <div className="group-chat-modal-content">
              <div className="group-chat-modal-header">
                <span className="group-chat-modal-close">&times;</span>
                <h1>Group Chat</h1>
              </div>
                <div className="group-chat-modal-body">
                  <p>Chat here ... </p>
                      </div>
                    <div className="group-chat-modal-footer-input">
                      <input
                        type="text"
                        placeholder="Type a message"
                        name="msg"
                        required
                      />
                      <button type="submit" className="chat-send-button">
                        Send
                      </button>
                  </div>
                </div>
              </div>
          );
};

export default GroupPage;
