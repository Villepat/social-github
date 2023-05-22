import React from "react";
import { Link } from "react-router-dom";
import "../styles/Groups.css";

const fetchGroups = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const response = await fetch(
    "http://localhost:6969/api/groups",
    requestOptions
  );

  const data = await response.json();
  if (response.status === 200) {
    console.log("groups fetched");
    console.log(data);
    return data.groups;
  } else {
    alert("Error fetching groups.");
  }
};

const createGroup = async () => {
  console.log("create group");

  const name = document.getElementById("group-name").value;
  const description = document.getElementById("group-description").value;
  console.log(name);
  console.log(description);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
    credentials: "include",
  };
  const response = await fetch(
    "http://localhost:6969/api/create-group",
    requestOptions
  );
  const data = response.status;
  if (data === 200) {
    console.log("group created");
    return 200;
  } else {
    alert("Error creating group.");
  }
};

const GroupsList = () => {
  const [groups, setGroups] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    const groupName = document.getElementById("group-name").value;
    const groupDescription = document.getElementById("group-description").value;

    if (groupName.length < 1) {
      alert("Group Name must be at least 1 character long");
      return;
    }

    if (groupDescription.length < 10) {
      alert("Group Description must be at least 10 characters long");
      return;
    }
    const status = await createGroup();
    if (status === 200) {
      setGroups(await fetchGroups());
      // clear form
      document.getElementById("group-name").value = "";
      document.getElementById("group-description").value = "";
    }
  };

  React.useEffect(() => {
    const getGroups = async () => {
      const groups = await fetchGroups();
      setGroups(groups);
    };
    getGroups();
  }, []);

  console.log("groups:", groups);
  return (
    <div>
      <div className="group-form">
        <h1 className="group-form-header">Create a Group</h1>
        <form className="group-form-container">
          <label className="group-form-label">Group Name</label>
          <input
            className="group-form-input"
            type="text"
            placeholder="Group Name (1-50 characters)"
            id="group-name"
            required
            maxLength="50"
            minLength={1}
            title="Group name should be 1-50 characters."
          />
          <label className="group-form-label">Group Description</label>
          <textarea
            className="group-form-input"
            type="textarea"
            placeholder="Group Description (10-500 characters)"
            id="group-description"
            required
            maxLength="500"
            minLength="10"
            title="Group description should be 1-500 characters."
          />
          <button className="group-form-button" onClick={handleSubmit}>
            Create Group
          </button>
        </form>
      </div>
      {groups ? (
        <div>
          <h1 className="group-header">Groups</h1>
          <div className="group-list">
            {groups.map((group) => (
              <div key={group.Id} className="group">
                <h3 className="group-listview-title">{group.Title}</h3>
                <h4 className="group-listview-description">
                  {group.Description}
                </h4>
                <h4 className="timestamp">{group.CreatedAt}</h4>
                <Link to={`/groups/${group.Id}`}>
                  <button className="group-button">View Group</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="group-header">No Groups</h1>
      )}
    </div>
  );
};

export default GroupsList;
