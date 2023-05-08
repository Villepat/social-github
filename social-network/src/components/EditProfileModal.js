import React, { useState } from "react";

function EditProfileModal(props) {
  const { show, handleClose, handleSave, userId } = props;
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = () => {
    console.log("submitting edit profile form");
    console.log({ userId, nickname, email, aboutMe, avatar });
    handleSave({ userId, nickname, email, aboutMe, avatar });
  };

  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
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
                <input
                  type="text"
                  className="form-control"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className="newemail">
                <label htmlFor="email" className="form-email">
                  New Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="newabout">
                <label htmlFor="about-me" className="form-about">
                  New 'About Me' Text
                </label>
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
    </div>
  );
}

export default EditProfileModal;
