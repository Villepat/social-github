import React, { useState } from "react";

import "../styles/ProfileCard.css";

import EditProfileModal from "./EditProfileModal";

function ProfileCard(props) {
  const { user, ownProfile, setUser, userId } = props;

  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(
    user.avatar
      ? `data:image/jpeg;base64,${user.avatar}`
      : "path/to/default/avatar.jpg"
  );

  console.log("user", user);

  console.log("userid", userId);

  const handleModalClose = () => {
    setShowEditModal(false);
  };

  const handleModalSave = async (updatedData) => {
    const {
      userId,
      email,
      nickname,
      aboutMe,
      avatar,
      newPassword,
      confirmPassword,
    } = updatedData;

    const formData = new FormData();

    formData.append("userId", userId);
    if (email) formData.append("email", email);
    if (nickname) formData.append("nickname", nickname);
    if (aboutMe) formData.append("aboutMe", aboutMe);
    if (newPassword) formData.append("password", newPassword);
    if (confirmPassword) formData.append("confirmPassword", confirmPassword);
    if (avatar) {
      formData.append("avatar", avatar);
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
      const updatedUser = { ...user };

      if (email) updatedUser.email = email;
      if (nickname) updatedUser.nickname = nickname;
      if (aboutMe) updatedUser.aboutme = aboutMe;
      if (newPassword) updatedUser.newPassword = newPassword;
      if (confirmPassword) updatedUser.confirmPassword = confirmPassword;

      if (avatar) {
        const reader = new FileReader();
        reader.onloadend = function () {
          // Update the user's avatar data and the avatar source
          updatedUser.avatar = reader.result;
          setAvatarSrc(reader.result);
          setUser(updatedUser);
        };
        reader.readAsDataURL(avatar);
      } else {
        updatedUser.avatar = user.avatar;
        setUser(updatedUser);
      }
      setUser(updatedUser);

      setShowEditModal(false);
    } else {
      const errorData = await response.json();

      console.error("Error updating user profile:", errorData.message);
    }
  };

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

        {ownProfile && (
          <button
            className="editprofile-button"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <EditProfileModal
        show={showEditModal}
        handleClose={handleModalClose}
        handleSave={handleModalSave}
        userId={userId}
        currentUserData={user}
      />
    </div>
  );
}

export default ProfileCard;
