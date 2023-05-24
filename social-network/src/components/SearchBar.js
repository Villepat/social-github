import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// send the search query to the server
const sendSearchQuery = async (searchQuery) => {
    if (searchQuery === "") {
        return;
    }
    const response = await fetch("http://localhost:6969/api/search-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            searchQuery: searchQuery,
        }),
        credentials: "include",
    });

    console.log("search query sent");

    // handle response
    const data = await response.json();
    if (response.status === 200) {
        console.log("search query received");
        console.log(data);
    } else {
        alert("Error searching for users.");
    }

    let users = data;
    console.log(users);

    // display the search results
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";
    users.forEach((user) => {
        console.log(user.full_name);
        const userElement = document.createElement("div");
        userElement.innerHTML = `<a href="/profile/${user.id}">${user.full_name}</a>`;
        searchResults.appendChild(userElement);
    });
};

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    //set a timeout to send the search query to the server
    setTimeout(() => {
        sendSearchQuery(event.target.value);
    }, 1000);
  };

  return (
    <div>
        <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
        />
        <div id="search-results"></div>
    </div>
  );
};

export default SearchBar;
