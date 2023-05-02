import React from "react";
import "../styles/ProfileCard.css";

function ProfileCard(props) {
  const { user } = props;

  const avatarSrc = user.avatar
    ? `data:image/jpeg;base64,${user.avatar}`
    : "path/to/default/avatar.jpg"; // Replace with the path to a default avatar if necessary

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          {user.firstName} {user.lastName}
        </h5>
        <img src={avatarSrc} alt="Avatar" className="card-img" />
        <p className="card-text">{user.email}</p>
        <p className="card-text">{user.nickname}</p>
        <p className="card-text">{user.aboutme}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
