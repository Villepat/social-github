import React from "react";
import "../styles/Groups.css";
import EventContainer from "../components/EventContainer";
import { useAuth } from "../AuthContext"; // import useAuth from AuthContext

const fetchGroupData = async (groupNumber) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const response = await fetch(
    `http://localhost:6969/api/serve-group-data`,
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

const postGroupPost = async (groupNumber) => {
  const postInput = document.getElementById("post-textarea");
  const post = postInput.value;
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
  } else {
    alert("Error posting to group.");
  }
};

const GroupPage = () => {
  const { userID } = useAuth(); // Get the userID
  const url = window.location.href;
  const pattern = /groups\/(\d+)/;
  const match = url.match(pattern);
  console.log(match);
  const groupNumber = match[1];
  const [groupData, setGroupData] = React.useState([]);
  const [eventsData, setEventsData] = React.useState([]);
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    description: "",
    dateTime: "",
  });

  React.useEffect(() => {
    const getGroupData = async () => {
      const groupDataFromServer = await fetchGroupData(groupNumber);
      setGroupData(groupDataFromServer);
      const eventsDataFromServer = await fetchEventData(groupNumber);
      setEventsData(eventsDataFromServer);
    };
    getGroupData();
  }, [groupNumber]);

  if (!groupData) {
    return <div>loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("post submitted");
    postGroupPost(groupNumber);
  };

  const handleEventChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:6969/api/event", {
      method: "POST",
      credentials: "include", // to send the session cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_id: groupNumber,
        title: newEvent.title,
        description: newEvent.description,
        date_time: newEvent.dateTime,
      }),
    });
    console.log(groupNumber);
    console.log(newEvent.title);
    console.log(newEvent.description);
    console.log(newEvent.dateTime);

    // If response is OK, re-fetch the events
    if (response.ok) {
      const eventsDataFromServer = await fetchEventData(groupNumber);
      setEventsData(eventsDataFromServer);
    } else {
      console.error("Failed to create event");
    }
  };

  const fetchEventData = async (groupNumber) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    const response = await fetch(
      `http://localhost:6969/api/serve-events?group_id=${groupNumber}`,
      requestOptions
    );

    const data = await response.json();
    if (response.status === 200) {
      console.log("events data fetched");
      console.log(data);
      return data.events;
    } else {
      alert("Error fetching events data.");
    }
  };

  return (
    <div className="group-page">
      <div className="group-page-header">
        <h1>{groupData.name}</h1>
        <p>{groupData.description}</p>
        <button className="join-group-button">Join Group</button>
      </div>
      <div className="group-page-members">
        <h1>Members</h1>
        <p>User 1</p>
      </div>

      <div className="group-page-event">
        <h1>Events</h1>
        <EventContainer
          groupId={groupNumber}
          userID={userID}
          eventsData={eventsData}
        />

        {/* Use EventContainer component */}
        {/* Add event form */}
        <form onSubmit={handleEventSubmit}>
          <h2>Create event</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newEvent.title}
            onChange={handleEventChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newEvent.description}
            onChange={handleEventChange}
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={newEvent.dateTime}
            onChange={handleEventChange}
          />
          <button type="submit">Create event</button>
        </form>
      </div>

      <div className="group-page-post">
        <h1>Posts</h1>
        <div className="group-post-container">
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            id="post-textarea"
          />
          <button
            type="submit"
            className="group-button-post"
            onClick={handleSubmit}
          >
            Post
          </button>
          <div className="post-display">
            <h3>
              display the post here: <br></br>. <br></br>.
            </h3>
          </div>
        </div>
      </div>
      <div className="group-chat-modal">
        <button className="group-button">Open Groupchat</button>
      </div>
      <div className="group-chat-modal-content">
        <div className="group-chat-modal-header">
          <span className="group-chat-modal-close">&times;</span>
          <h1>Group Chat</h1>
        </div>
        <div className="group-chat-modal-body">
          <p>Some text</p>
          <p>Some other text...</p>
          <div className="group-chat-modal-footer-input">
            <input
              type="text"
              placeholder="Type a message"
              name="msg"
              required
            />
            <button type="submit" className="group-chat-modal-send">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
