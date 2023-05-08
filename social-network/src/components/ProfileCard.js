import React, { useState } from "react";

import "../styles/ProfileCard.css";

import EditProfileModal from "./EditProfileModal";

function ProfileCard(props) {
  const { user, ownProfile, setUser, userId } = props;

  const [showEditModal, setShowEditModal] = useState(false);

  console.log("user", user);

  console.log("userid", userId);

  const handleModalClose = () => {
    setShowEditModal(false);
  };

  const handleFollow = () => {
    console.log("follow button pressed");
  };

  const handleModalSave = async (updatedData) => {
    const { userId, email, nickname, aboutMe, newAvatar, newAvatarBase64 } =
      updatedData;

    const formData = new FormData();

    formData.append("userId", userId);

    formData.append("email", email);

    formData.append("nickname", nickname);

    formData.append("aboutMe", aboutMe);

    if (newAvatar) {
      formData.append("avatar", newAvatar);
    }

    const requestOptions = {
      method: "POST",

      headers: {
        // "Content-Type": "multipart/form-data" should NOT be set manually
        // The browser will automatically set the correct boundary
      },

      body: formData,

      credentials: "include",
    };

    const response = await fetch(
      "http://localhost:6969/api/user/update",
      requestOptions
    );

    if (response.ok) {
      const updatedUser = { ...user, email, nickname, aboutMe };

      if (newAvatar) {
        updatedUser.avatar = newAvatarBase64;
      }

      setUser(updatedUser);

      setShowEditModal(false);
    } else {
      const errorData = await response.json();

      console.error("Error updating user profile:", errorData.message);
    }
  };

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

        <p className="card-email">email: {user.email}</p>

        <p className="card-nickname">nickname: {user.nickname}</p>

        <p className="card-aboutme">about me: {user.aboutme}</p>

        <p className="card-birthday">date of birth: {user.birthday}</p>

        {ownProfile ? (
          <button
            className="editprofile-button"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleFollow}>
            Follow
          </button>
        )}
      </div>

      <EditProfileModal
        show={showEditModal}
        handleClose={handleModalClose}
        handleSave={handleModalSave}
        userId={userId} // Pass the user.user_id as the userId prop
      />
    </div>
  );
}

export default ProfileCard;
