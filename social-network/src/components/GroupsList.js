import React from "react";
import { Link } from "react-router-dom";

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

const GroupsList = () => {
  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    const getGroups = async () => {
      const groups = await fetchGroups();
      setGroups(groups);
    };
    getGroups();
  }, []);

  console.log("groups:", groups);
  if (!groups) {
    return <div>empty</div>;
  }
  return (
    <div className="group-list">
      <div className="group">
        {groups.map((group) => (
          <div key={group.Id} className="group">
            <h3>{group.Title}</h3>
            <h4>{group.Description}</h4>
            <Link to={`/groups/${group.Id}`}>
              <button className="group-button">View Group</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
