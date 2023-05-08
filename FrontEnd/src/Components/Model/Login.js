import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import context from "../Context/context";
import { toast } from "react-toastify";

const Login = () => {
  const { LoginModel, setLoginModel,setProfile,setUser } =
    useContext(context);
  const [loginError, setLoginError] = useState(false);
  const [msg, setMsg] = useState({});
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z]+\.)+[a-zA-Z]{2,}))$/;
  const [loginFormData, setLoginFormData] = useState({
    Email: "",
    Password: "",
  });
  const handleLogin = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };
  const Model_Close = () => {
    setLoginModel(false);
  };
  const do_Login = async () => {
    if (loginFormData.Email.length === 0) {
      toast("Enter Email");
    } else if (re.test(loginFormData.Email) === false) {
      toast("Enter Valid Email");
    } else if (loginFormData.Password.length === 0) {
      toast("Enter Password");
    } else {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
      });
      const data = await res.json();
      toast(data.message);
      if(data.user){
        localStorage.setItem("login",true)
        setUser(data.user)
        setProfile(false)
        Model_Close()
      }
    }
  };
  return (
    <div>
      <Modal show={LoginModel} onHide={Model_Close}>
        <Modal
          className="Status"
          show={loginError}
          onHide={() => {
            setLoginError(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msg}</Modal.Body>
        </Modal>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                onChange={handleLogin}
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={handleLogin}
                name="Password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={Model_Close}>
            Close
          </Button>
          <Button variant="primary" onClick={do_Login}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
