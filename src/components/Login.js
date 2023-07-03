import { useRef, useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "../api/axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import "./Login.css";
import Spinner from "react-bootstrap/Spinner";

const LOGIN_URL = "/user/login/";

const Login = () => {
  const { setAuth, setUser, setLoginType } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const decodeAccessToken = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      return decodedToken;
    } catch (error) {
      console.log("Failed to decode JWT:", error.message);
    }
    return;
  };

  const useHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.access_token;
      const decodedToken = decodeAccessToken(accessToken);
      // const roles = response?.data?.roles
      setAuth({ accessToken });
      localStorage.setItem("auth", JSON.stringify({ accessToken }));
      setEmail("");
      setPwd("");
      const user = {
        email: decodedToken.email,
        name: decodedToken.name,
        phoneNumber: decodedToken.phone_number,
        newLogin: true,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setLoginType("regular");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 403) {
        setErrMsg(err.response?.data?.message);
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  const googleSubmit = async (credentialResponse) => {
    setLoading(true);
    setLoginType("google");
    const decodedCred = decodeAccessToken(credentialResponse?.credential);
    try {
      const response = await axios.post(
        "/user/google/login/",
        JSON.stringify(decodedCred),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.access_token;
      const decodedToken = decodeAccessToken(accessToken);
      // const roles = response?.data?.roles
      setAuth({ accessToken });
      localStorage.setItem("auth", JSON.stringify({ accessToken }));
      setEmail("");
      setPwd("");
      const user = {
        email: decodedToken.email,
        name: decodedToken.name,
        phoneNumber: decodedToken.phone_number,
        newLogin: true,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setLoginType("google");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data?.message);
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: googleSubmit,
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <Container className="d-flex justify-content-center login-container">
      <section className="login-section mb-0">
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
        <Form onSubmit={useHandleSubmit} className="login-form">
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
          <Button variant="primary" type="submit" disabled={loading}>
            Sign In{" "}
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Form>
        <span className="form-subheader">
          Need an Account? <Link to="/register">Sign Up</Link>
        </span>
        <div
          className="form-subheader mt-2 mb-0"
          style={{ color: "gray", fontWeight: "bold" }}
        >
          Or
        </div>
      </section>
      <GoogleLogin
        onSuccess={googleSubmit}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
    </Container>
  );
};

export default Login;
