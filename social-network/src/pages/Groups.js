import React, { useEffect } from "react";
import "../styles/Groups.css";
import GroupsList from "../components/GroupsList";

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
  const data = await response.json();
  if (data.status === 200) {
    console.log("group created");
    alert("Group created successfully!");
  } else {
    alert("Error creating group.");
  }
};

const Groups = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    createGroup();
  };

  return (
    <div className="group-page">
      <div className="group-form">
        <h1 className="group-form-header">Create a Group</h1>
        <form className="group-form-container">
          <label className="group-form-label">Group Name</label>
          <input
            className="group-form-input"
            type="text"
            placeholder="Group Name"
            id="group-name"
          />
          <label className="group-form-label">Group Description</label>
          <input
            className="group-form-input"
            type="text"
            placeholder="Group Description"
            id="group-description"
          />
          <button className="group-form-button" onClick={handleSubmit}>
            Create Group
          </button>
        </form>
      </div>
      <h1 className="group-header">Groups</h1>
      <GroupsList />
    </div>
  );
};

export default Groups;
