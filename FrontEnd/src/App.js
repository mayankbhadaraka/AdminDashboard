import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PNF from "./Components/Invalid/PNF";
import Header from "./Components/Home/Header/Header";
import Footer from "./Components/Home/Footer/Footer";
import Main from "./Components/Home/Main/main";
import Admin from "./Components/Admin/Admin";
import Profile from "./Components/Profile/Profile";
import context from "./Components/Context/context";
import { toast } from "react-toastify";
function App() {
  const { setUser, setProfile } = useContext(context);
  const isInitialLoad = useRef(true);
  const getUserDetails = async () => {
    try {
      const res = await fetch("/logInUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUser(data.log)
      setProfile(false);
      toast(data.message);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }
      if(localStorage.getItem('login')=='true'){
        getUserDetails();
      }
  }, []);

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="*" element={<PNF />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
