import React from "react";
import "../styles/ProfileCard.css";

function ProfileCard(props) {
  const { user } = props;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{user.firstName} {user.lastName}</h5>
        <p className="card-text">{user.email}</p>
        <p className="card-text">{user.nickname}</p>
        <p className="card-text">{user.aboutme}</p>
      </div>
    </div>
  );
}


export default ProfileCard;

