import React from "react";
import "../styles/EventContainer.css"

const EventContainer = ({ groupId, userID, eventsData }) => {
  const [events, setEvents] = React.useState([]);
  const [eventResponse, setEventResponse] = React.useState({});

  React.useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

  const handleResponseChange = (eventId, e) => {
    setEventResponse({
      ...eventResponse,
      [eventId]: e.target.value,
    });
  };

  const handleResponseSubmit = (eventId, e) => {
    e.preventDefault();
    // Call `postEventResponse` here with `eventId` and `eventResponse[eventId]`.
    // For now, let's just log the event response to the console.
    console.log(`Response for event ${eventId}: ${eventResponse[eventId]}`);
    alert("Invitation accepted");
  };

  if (!eventsData) {
    return <div>We have no events happening yet. Take initiative!</div>;
  }

  const formatDateTime = (dateTime) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <div className="event-container" key={event.id}>
          <b>
            
            <h2>{event.title}</ h2>
          </b>
          <h4>{formatDateTime(event.dateTime)}</h4>
          <p>{event.description}</p>
          <form onSubmit={(e) => handleResponseSubmit(event.id, e)}>
            <label>
              Going:
              <input
              className="event-going-radio-button"
                type="radio"
                name={`response-${event.id}`}
                value="going"
                checked={eventResponse[event.id] === "going"}
                onChange={(e) => handleResponseChange(event.id, e)}
              />
            </label>
            <label>
              Not Going:
              <input
                className="event-going-radio-button"
                type="radio"
                name={`response-${event.id}`}
                value="not going"
                checked={eventResponse[event.id] === "not going"}
                onChange={(e) => handleResponseChange(event.id, e)}
              />
            </label>
            <button className="event-submitt-button" type="submit">Submit</button>
          </form>
        </div>
        </div>
      ))}
    </div>
  );
};

export default EventContainer;
