import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";

function Navbar() {
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>

        {loggedIn ? (
          <>
            <li>
              <Link to="/groups">Groups</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Notifications />
            </li>
            <li>
              <SearchBar />
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {/* commented out for now they only appear when you are logged in */}
        {/* <li>
          <Notifications />
        </li>
        <li>
          <SearchBar />
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
