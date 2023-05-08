import React, { useContext, useState } from "react";
import context from "../Context/context";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const Signup = () => {
  const { SignupModel, setSignupModel } = useContext(context);
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z]+\.)+[a-zA-Z]{2,}))$/;
  const Model_Close = () => {
    setSignupModel(false);
  };
  const handleChange = (e) => {
    setSignupFormData({ ...SignupFormData, [e.target.name]: e.target.value });
    if (e.target.name == "ProfilePicture") {
      setSignupFormData({
        ...SignupFormData,
        [e.target.name]: e.target.files[0],
      });
    }
  };
  const checkMobile = (len) => {
    if (SignupFormData.Mobile.length > len) {
      SignupFormData.Mobile = SignupFormData.Mobile.slice(0, 10);
    }
  };
  const [SignupFormData, setSignupFormData] = useState({
    FirstName: "",
    LastName: "",
    Mobile: "",
    Address: "",
    Email: "",
    ProfilePicture: "",
    Password: "",
    Cpassword: "",
  });
  const do_Signup = async () => {
    if (SignupFormData.FirstName.length === 0) {
      toast(" Enter Valid FirstName");
    } else if (SignupFormData.LastName.length === 0) {
      toast("Enter Valid LastName");
    } else if (SignupFormData.Mobile.length !== 10) {
      toast("Enter Valid Mobile Number");
    } else if (SignupFormData.Address.length === 0) {
      toast("Enter Valid Address");
    } else if (SignupFormData.Email.length === 0) {
      toast("Enter Valid Email");
    } else if (re.test(SignupFormData.Email) === false) {
      toast("Enter Valid Email");
    } else if (SignupFormData.Password.length <= 6) {
      toast("Set password greater than 6");
    } else if (SignupFormData.Cpassword.length <= 6) {
      toast("Set confirm password greater than 6");
    } else if (SignupFormData.Cpassword !== SignupFormData.Password) {
      toast("Password is not same.");
    } else {
      const formData = new FormData();
      formData.append("ProfilePicture", SignupFormData.ProfilePicture);
      formData.append("FirstName", SignupFormData.FirstName);
      formData.append("LastName", SignupFormData.LastName);
      formData.append("Address", SignupFormData.Address);
      formData.append("Mobile", SignupFormData.Mobile);
      formData.append("Email", SignupFormData.Email);
      formData.append("Password", SignupFormData.Password);
      const res = await fetch("/saveData", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.message != "Register Successfully.") {
        toast(data.message);
      } else {
        Model_Close();
        toast(data.message);
        setSignupFormData({
          FirstName: "",
          LastName: "",
          Mobile: "",
          Address: "",
          Email: "",
          Password: "",
          Cpassword: "",
        });
      }
    }
  };

  return (
    <div>
      <Modal show={SignupModel} onHide={Model_Close}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea3"
            >
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="number"
                onKeyDown={(evt) =>
                  (evt.key === "e" || evt.key === "+" || evt.key === "-") &&
                  evt.preventDefault()
                }
                name="Mobile"
                value={SignupFormData.Mobile}
                onChange={handleChange}
                onInput={checkMobile(10)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea4"
            >
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="Address"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={handleChange}
                name="Email"
                placeholder="name@example.com"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="ProfilePicture"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea6"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="Password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea7"
            >
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="Cpassword"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={Model_Close}>
            Close
          </Button>
          <Button variant="primary" onClick={do_Signup}>
            Signup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Signup;
