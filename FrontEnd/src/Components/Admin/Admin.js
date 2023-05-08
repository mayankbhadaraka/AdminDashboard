import React, { useContext } from "react";
import "./Admin.css";
import Log from "../LogData/Log";
import context from "../Context/context";
import NotAdmin from "../NonAdmin/NotAdmin";
import { ToastContainer } from "react-toastify";
const Admin = () => {
  const { profile,user } = useContext(context);
  return (
    <div className="Admin">
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
      {!profile & (user.isAdmin === true) ? (
        <Log />
      ) : (
        <NotAdmin />
      )}
    </div>
  );
};

export default Admin;
