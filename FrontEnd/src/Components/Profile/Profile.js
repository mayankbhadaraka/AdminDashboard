import React, { useContext, useEffect, useState } from "react";
import context from "../Context/context";
import { Button, Form, Modal } from "react-bootstrap";
import "./Profile.css";
import { toast } from "react-toastify";
const Profile = () => {
  const { profile, user,setUser } = useContext(context);
  console.log(user.ProfilePicture)
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z]+\.)+[a-zA-Z]{2,}))$/;
  const [updatedData, setUpdatedData] = useState({});
  useEffect(()=>{setUpdatedData(user)},[user])
  let [editModel, setEditModel] = useState(false);
  const Close = () => {
    setEditModel(false);
  };
  const Update_data = async () => {
    if (updatedData.FirstName.length === 0) {
      toast("Enter Valid FirstName");
    } else if (updatedData.LastName.length === 0) {
      toast("Enter Valid LastName");
    } else if (updatedData.Address.length === 0) {
      toast("Enter Valid Address");
    } else if (updatedData.Mobile.length !== 10) {
      toast("Check Mobile Number length");
    } else if (updatedData.Email.length === 0) {
      toast("Enter Valid Email");
    } else if (re.test(updatedData.Email) === false) {
      toast("Enter Valid Email");
    } else if (updatedData.Password.length <= 6) {
      toast("Set password greater than 6");
    } else {
      const formData = new FormData();
      formData.append("ProfilePicture", updatedData.ProfilePicture);
      formData.append("FirstName", updatedData.FirstName);
      formData.append("LastName", updatedData.LastName);
      formData.append("Address", updatedData.Address);
      formData.append("Mobile", updatedData.Mobile);
      formData.append("Email", updatedData.Email);
      formData.append("Password", updatedData.Password);
      const res = await fetch("/Update", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      setUser(updatedData)
      toast(data.message);
      Close();
    }
  };
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Mobile") {
      if (value.length <= 10) {
        setUpdatedData((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
      }
    }else if (e.target.name == "ProfilePicture") {
      setUpdatedData({
        ...updatedData,
        [e.target.name]: e.target.files[0],
      });
    }else {
      setUpdatedData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };
  return (
    <>
      {user !== null ? (
        !profile ? (
          <div id="Profile">
            <div className="about-section">
              <h1>{user.FirstName}'s Profile</h1>
              <p>Some Information about what we know about you</p>
            </div>
            <div id="Info">
              <div className="row">
                <div className="column">
                  <div className="card">
                    <img
                      src={`/Images/${user.ProfilePicture}`}
                      alt={"Profile Picture"}
                    />
                    <div className="container">
                      <h2>
                        <b>First name</b> : {user.FirstName}
                      </h2>
                      <h2>
                        <b>Last name</b> : {user.LastName}
                      </h2>
                      <p className="title">
                        <b>Mobile</b> : {user.Mobile}
                      </p>
                      <p>
                        <b>Address</b> : {user.Address}
                      </p>
                      <p>
                        <b>Email</b> : {user.Email}
                      </p>
                      <p>
                        <button className="button" onClick={()=>setEditModel(true)}>Edit</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={editModel} onHide={Close}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="FirstName"
                      onChange={handleChange}
                      value={updatedData.FirstName}
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea2"
                  >
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="LastName"
                      onChange={handleChange}
                      value={updatedData.LastName}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea3"
                  >
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      value={updatedData.Mobile}
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "+" ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                      name="Mobile"
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea4"
                  >
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      value={updatedData.Address}
                      name="Address"
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput5"
                  >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      onChange={handleChange}
                      value={updatedData.Email}
                      name="Email"
                      placeholder="name@example.com"
                      disabled
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput5"
                  >
                    <Form.Label>Change Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleChange}
                      name="ProfilePicture"
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea6"
                  >
                    <Form.Label>Change Password</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      name="Password"
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={Close}>
                  Close
                </Button>
                <Button variant="primary" onClick={Update_data}>
                  Edit
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <h1>Login to view Profile</h1>
        )
      ) : (
        <h1>Login to view Profile</h1>
      )}
    </>
  );
};

export default Profile;
