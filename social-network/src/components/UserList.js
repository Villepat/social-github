import React, { useState } from "react";
import useFetchUserList from "./FetchuserList.js";
import { Link } from "react-router-dom";
import ChatModal from "./ChatModal.js"; // Import the ChatModal component


function UserListItem({ user }) {
  const [showChat, setShowChat] = useState(false);

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="user-list-item">
      <Link to={`/profile/${user.id}`}>{user.fullname}</Link>
      <button onClick={handleOpenChat} className="chat-button">
        <i className="fa-solid fa-comments"></i>
      </button>
      {showChat && <ChatModal user={user} onClose={handleCloseChat} />}
    </div>
  );
}

function UserList() {
  const { data: userlist, loading, error } = useFetchUserList();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {userlist.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UserList;
