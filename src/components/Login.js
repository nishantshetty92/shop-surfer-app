import { useRef, useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "../api/axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Login.css";

const LOGIN_URL = "/user/login/";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.access_token;
      // const roles = response?.data?.roles;
      setAuth({ email, accessToken });
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
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
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
    </Container>
  );
};

export default Login;
