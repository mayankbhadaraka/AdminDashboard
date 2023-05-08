import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import context from "../../Context/context";
import { Link } from "react-router-dom";
import Login from "../../Model/Login";
import Signup from "../../Model/Signup";
import "react-toastify/dist/ReactToastify.css";

import "./Header.css";
import { toast, ToastContainer } from "react-toastify";
const Header = () => {
  const { setSignupModel, setLoginModel, user, profile, setProfile, setUser } =
    useContext(context);
  const Open_Login_Model = () => {
    setLoginModel(true);
  };
  const Open_Signup_Model = () => setSignupModel(true);
  const logoutApi = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      toast(data.message);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const logout = () => {
    logoutApi()
    localStorage.setItem('login',false)
    setProfile(true);
    setUser({});
  };
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar bg="dark" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            Navbar
          </Link>
          <Nav className="me-auto">
            <div id="Nav-link">
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/Blog">Blogs</Link>
            </div>
            {profile ? (
              <div id="Nav-btn">
                <Button variant="primary" onClick={Open_Login_Model}>
                  Login
                </Button>
                <Button variant="primary" onClick={Open_Signup_Model}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div id="Nav-btn">
                <h1 id="profile-name">Welcome {user?.FirstName}</h1>
                <Button variant="danger" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Signup />
      <Login />
    </div>
  );
};

export default Header;
