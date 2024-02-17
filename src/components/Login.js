import { useRef, useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "../api/axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import Spinner from "react-bootstrap/Spinner";
import "./Login.css";

const LOGIN_URL = "/auth/login/";

const Login = () => {
  const { setAuth, setUser, setLoginType } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  // getting info from page user came from, using this info to redirect after user logs in
  let from = location.state?.from?.pathname || "/";
  const search = location.state?.from?.search;
  from = search ? `${from}${search}` : from;
  console.log(from, "LOGIN FROM");

  const emailRef = useRef();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [formData.email, formData.password]);

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
      const response = await axios.post(LOGIN_URL, JSON.stringify(formData), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.access_token;
      const decodedToken = decodeAccessToken(accessToken);
      // const roles = response?.data?.roles

      /*Using localstorage to store the login auth data i.e accesstoken,
      had tried context api to store this earlier, but was not able to access setAuth in a custom hook,
       will look into this later
      */
      // setAuth({ accessToken });
      localStorage.setItem("auth", JSON.stringify({ accessToken }));
      resetFormData();
      const user = {
        email: decodedToken.email,
        name: decodedToken.name,
        image: decodedToken.image,
        phoneNumber: decodedToken.phone_number,
        newLogin: true,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setLoginType("regular");
      navigate(from, { state: { from: location }, replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 403) {
        setErrMsg(err.response?.data?.detail?.message);
      } else {
        setErrMsg("Login Failed");
      }
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
        "/auth/google/login/",
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
      // setAuth({ accessToken });
      localStorage.setItem("auth", JSON.stringify({ accessToken }));
      resetFormData();
      const user = {
        email: decodedToken.email,
        name: decodedToken.name,
        image: decodedToken.image,
        phoneNumber: decodedToken.phone_number,
        newLogin: true,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setLoginType("google");
      navigate(from, { state: { from: location }, replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data?.detail?.message);
      } else {
        setErrMsg("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Once user authenticates using google this gets triggered
  useGoogleOneTapLogin({
    onSuccess: googleSubmit,
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <Container className="d-flex justify-content-center login-container">
      <Alert variant="danger" show={errMsg !== ""} role="alert">
        {errMsg}
      </Alert>
      <section className="login-section mb-0">
        <span className="form-header">
          <RiShoppingCartLine className="navbar-icon" /> ShopSurfer
        </span>
        <Form onSubmit={useHandleSubmit} className="login-form">
          <Form.Group controlId="username">
            <Form.Control
              type="text"
              name="email"
              ref={emailRef}
              autoComplete="off"
              onChange={handleChange}
              value={formData.email}
              required
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
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
