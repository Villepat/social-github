import React from "react";

function ProfileCard(props) {
  const { user } = props;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{user.name}</h5>
        <p className="card-text">{user.email}</p>
        <p className="card-text">{user.phone}</p>
        <p className="card-text">{user.address}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
