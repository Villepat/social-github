import React from "react";
import './Home.css';

function Home() {
    return (
        <div className="topnav">
            <a className="active" href="#home">Home</a>
            <a href="#profile">Profile</a>
            <a href="#chat">Chat</a>
            <a href="#createpost">Create a Post</a>
            <a href="#groups">Groups</a>
            
            <div className="search-container">
                <form action="/search">
                    <input type="text" placeholder="Search.." name="search" />
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    );
}

export default Home;