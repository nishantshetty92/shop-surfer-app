import { useRef, useState, useEffect, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Login.css";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <Container className="d-flex justify-content-center login-container">
      {success ? (
        <section className="login-section">
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <section className="login-section">
          <Alert
            ref={errRef}
            variant={errMsg ? "danger" : "secondary"}
            className={errMsg ? "" : "offscreen"}
            role="alert"
          >
            {errMsg}
          </Alert>
          <span className="form-header">
            <RiShoppingCartLine className="navbar-icon" /> ShopSurfer
          </span>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                placeholder="Password"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
          <span className="form-subheader">
            Need an Account? <Link to="/register">Sign Up</Link>
          </span>
        </section>
      )}
    </Container>
  );
};

export default Login;
