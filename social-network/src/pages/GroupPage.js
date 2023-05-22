import React from "react";
import GroupPosts from "../components/GroupPosts";
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
const fetchEventData = async (groupNumber) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ groupId: groupNumber }),
  };

  const response = await fetch(
    `http://localhost:6969/api/serve-events`,
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

const GroupPage = () => {
  const { userID } = useAuth(); // Get the userID
  const url = window.location.href;
  const pattern = /groups\/(\d+)/;
  const match = url.match(pattern);
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
    };
    getGroupData();

    const getEventData = async () => {
      const eventsDataFromServer = await fetchEventData(groupNumber);
      setEventsData(eventsDataFromServer);
    };
    getEventData();
  }, [groupNumber]);

  if (!groupData) {
    return <div>loading...</div>;
  }

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

    // If response is OK, re-fetch the events
    if (response.ok) {
      const eventsDataFromServer = await fetchEventData(groupNumber);
      setEventsData(eventsDataFromServer);
    } else {
      console.error("Failed to create event");
    }
    setNewEvent({
      title: "",
      description: "",
      dateTime: "",
    });
  };
  console.log(groupNumber, "group number");

  return (

    <div className="group-page">
      <div className="group-page-header">
        <h2>{groupData.name}</h2>
        <p>{groupData.description}</p>
        <button className="join-group-button">Join Group</button>
      </div>
      <h1>Members</h1>
      <div className="group-page-members">
        {/* <h2>Members</h2> */}
        <p>Add user here</p>
      </div>
      <h1>Group Events</h1>
      <div className="group-page-event">
        {/* <h1>Events</h1> */}
               {/* Use EventContainer component */}
        {/* Add event form */}
        <form onSubmit={handleEventSubmit}>
          <div className="group-page-event-form">
          <h2>Create event</h2>
          <input className="event-input"
            type="text"
            name="title"
            placeholder="Title"
            value={newEvent.title}
            onChange={handleEventChange}
            required
            pattern="^[a-zA-Z0-9\s.,!?;:]{1,50}$"
            title="Event title should be 1-50 alphanumeric characters (.,!?;: allowed)."
          />
          <input className="event-description"
            type="text"
            name="description"
            placeholder="Description"
            value={newEvent.description}
            onChange={handleEventChange}
            required
            pattern="^[a-zA-Z0-9\s.,!?;:]{1,50}$"
            title="Event description should be 1-256 alphanumeric characters (.,!?;: allowed)."
          />
          <input className="event-date"
            type="datetime-local"
            name="dateTime"
            value={newEvent.dateTime}
            onChange={handleEventChange}
            required
            min={new Date().toISOString().substring(0, 16)}
          />
          <button className="create-event-button" type="submit">Create event</button>
        </div>
        </form>
        </div>
        <h1>Uppcoming Events:</h1>
        <div className="group-page-event">
        <EventContainer
          groupId={groupNumber}
          userID={userID}
          eventsData={eventsData}
        />
      </div>

      <div className="group-page-post">
        <h1>Group Posts</h1>
        <div className="group-post-container">
          <div className="post-display">
            <GroupPosts />
          </div>
        </div>
      </div>
      <div className="group-chat-modal">
        <button className="group-button">Open Groupchat</button>
      </div>
        </div>
  );
};

export default GroupPage;
