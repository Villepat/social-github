import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import React from "react";
import { AuthProvider } from "./AuthContext";
import Groups from "./pages/Groups";
import GroupPage from "./pages/GroupPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="*" element={<ErrorPage errorType={'404'} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
