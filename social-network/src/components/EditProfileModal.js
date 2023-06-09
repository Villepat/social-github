import React, { useState } from "react";
import "../styles/ProfileCard.css";

function EditProfileModal(props) {
  const { show, handleClose, handleSave, userId, currentUserData } = props;
  const [nickname, setNickname] = useState(currentUserData.nickname);
  const [email, setEmail] = useState(currentUserData.email);
  const [aboutMe, setAboutMe] = useState(currentUserData.aboutMe);
  const [avatar, setAvatar] = useState(
    currentUserData.avatar
      ? `data:image/jpeg;base64,${currentUserData.avatar}`
      : null
  );
  const [avatarFile, setAvatarFile] = useState(null); // New state for storing the File object of the avatar

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    // Read the file and convert it to a base64 string
    const reader = new FileReader();
    reader.onloadend = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    handleSave({
      userId,
      nickname,
      email,
      aboutMe,
      avatar: avatarFile, // Pass the File object of the avatar, not the base64 string
      newPassword,
      confirmPassword,
    });
  };
  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
    >
      <div className="profile-edit-box">
        <div className="modal-header">
          <h5 className="title">Edit Profile</h5>
        </div>
        <div className="modal-body">
          <form>
            <div className="newavatar">
              <label htmlFor="avatar" className="form-avatar">
                New Avatar
              </label>
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                className="avatar-box"
                id="avatar"
                onChange={handleFileChange}
              />
            </div>
            <div className="newnickname">
              <label htmlFor="nickname" className="form-nickname">
                New Nickname
              </label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                className="nickname-box"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className="newemail">
              <label htmlFor="email" className="form-email">
                New Email
              </label>
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                className="email-box"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="newpassword">
              <label htmlFor="newpassword" className="form-newpassword">
                New Password
              </label>
              <input
                type="password"
                className="newpassword-box"
                id="newpassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="confirmpassword">
              <label htmlFor="confirmpassword" className="confirmpassword-box">
                Confirm Password
              </label>
              <input
                type="password"
                className="confirmpassword-box"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="newabout">
              <label htmlFor="about-me" className="form-about">
                New 'About Me' Text
              </label>
            </div>
            <div className="input-wrapper">
              <textarea
                className="about-textarea"
                id="about-me"
                rows="5"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              ></textarea>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-close" onClick={handleClose}>
            Close
          </button>
          <button type="button" className="btn-save" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
