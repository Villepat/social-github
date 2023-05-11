import React from "react";

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
    return <div>Loading events...</div>;
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>{new Date(event.dateTime).toLocaleString()}</p>
          <form onSubmit={(e) => handleResponseSubmit(event.id, e)}>
            <label>
              Going:
              <input
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
                type="radio"
                name={`response-${event.id}`}
                value="not going"
                checked={eventResponse[event.id] === "not going"}
                onChange={(e) => handleResponseChange(event.id, e)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default EventContainer;
