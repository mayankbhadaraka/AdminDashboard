import React, { useContext, useEffect } from "react";
import context from "../../Context/context";
import "./main.css";

const Main = () => {
  const {profile,user}=useContext(context)
  return (
    <div id="main">
      {profile ? (
        <>
        <h1>Login to view content.</h1>
        </>
      ) : (
        <h1>
          Welcome {user?.FirstName} {user?.LastName}
        </h1>
      )}
    </div>
  );
};

export default Main;
