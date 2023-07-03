import { useRef, useState, useEffect } from "react";
import { Form, Button, Alert, Container, Col, Row } from "react-bootstrap";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import "./Register.css";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX = /^[789]\d{9}$/;
const REGISTER_URL = "/user/register/";

const Register = () => {
  const { setAuth, setUser, setLoginType } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef();
  // const errRef = useRef();
  // const successRef = useRef();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    pwd: "",
    matchPwd: "",
  });

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [validFirstName, setValidFirstName] = useState(false);

  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(formData.email));
  }, [formData.email]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(formData.phone));
  }, [formData.phone]);

  useEffect(() => {
    setValidFirstName(formData.firstName?.length > 2);
  }, [formData.firstName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.pwd));
    setValidMatch(formData.pwd === formData.matchPwd);
  }, [formData.pwd, formData.matchPwd]);

  // useEffect(() => {

  // }, [formData.email, formData.pwd, formData.matchPwd, formData.phone]);

  const resetFormData = () => {
    setFormData({
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      pwd: "",
      matchPwd: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["email", "pwd", "matchPwd", "phone"].includes(name)) {
      setSuccessMsg("");
      setErrMsg("");
      setShowResend(false);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const decodeAccessToken = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      console.log(token);
      console.log(JSON.stringify(decodedToken));
      return decodedToken;
    } catch (error) {
      console.log("Failed to decode JWT:", error.message);
    }
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(formData.email);
    const v2 = PWD_REGEX.test(formData.pwd);
    const v3 = PHONE_REGEX.test(formData.phone);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      //clear state and controlled inputs
      resetFormData();
      setSuccessMsg(
        "We have sent you an email. Please click on the verification link to activate your account."
      );
      setErrMsg("");
    } catch (err) {
      setSuccessMsg("");
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        err.response?.data?.resend && setShowResend(true);
        setErrMsg(err.response?.data?.message);
      } else {
        setErrMsg("Registration Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      setSuccessMsg("");
      setErrMsg("");
      if (formData?.email) {
        const response = await axios.post("/user/resend/register/", {
          email: formData.email,
        });
        setSuccessMsg(response?.data?.message);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
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
    <Container className="d-flex justify-content-center register-container">
      <Alert variant="success" show={successMsg !== ""} role="alert">
        {successMsg}
      </Alert>
      <Alert variant="danger" show={errMsg !== ""} role="alert">
        {errMsg}
      </Alert>
      <section className="register-section">
        <h1 className="form-header">
          <RiShoppingCartLine className="navbar-icon" /> ShopSurfer
        </h1>
        <Form onSubmit={handleSubmit} className="register-form">
          <Form.Group controlId="email">
            <Form.Control
              type="text"
              name="email"
              ref={emailRef}
              autoComplete="off"
              onChange={handleChange}
              value={formData.email}
              required
              isValid={validEmail}
              isInvalid={!validEmail && formData.email}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              placeholder="Email"
              className="mb-3"
            />
            {emailFocus && formData.email && !validEmail && (
              <p className="instructions">
                <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email
                address
              </p>
            )}
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Control
              type="phone"
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              required
              isValid={validPhone}
              isInvalid={!validPhone && formData.phone}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              className="mb-3"
              placeholder="Mobile Number"
            />
            {phoneFocus && formData.phone && !validPhone && (
              <p className="instructions">
                <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid mobile
                number
              </p>
            )}
          </Form.Group>

          <Row>
            <Col>
              <Form.Control
                type="text"
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                isValid={validFirstName}
                isInvalid={!validFirstName && formData.firstName}
                className="mb-3"
                placeholder="First Name"
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                className="mb-3"
                placeholder="Last Name"
              />
            </Col>
          </Row>

          <Form.Group controlId="password">
            <Form.Control
              type="password"
              name="pwd"
              onChange={handleChange}
              value={formData.pwd}
              required
              isValid={validPwd}
              isInvalid={!validPwd && formData.pwd}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              placeholder="Password"
              className="mb-3"
            />
            {pwdFocus && !validPwd && (
              <p className="instructions">
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number, and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            )}
          </Form.Group>

          <Form.Group controlId="confirm_pwd">
            <Form.Control
              type="password"
              name="matchPwd"
              onChange={handleChange}
              value={formData.matchPwd}
              required
              isValid={validMatch && formData.matchPwd !== ""}
              isInvalid={!validMatch && formData.matchPwd}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              placeholder="Confirm Password"
              className="mb-3"
            />
            {matchFocus && !validMatch && (
              <p className="instructions">
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
                password input field.
              </p>
            )}
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={
              !validEmail ||
              !validPwd ||
              !validMatch ||
              !validPhone ||
              !validFirstName ||
              showResend ||
              loading
            }
          >
            Sign Up{" "}
            {!showResend && loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          {showResend && (
            <Button
              variant="primary"
              onClick={resendVerification}
              className="mt-3"
              disabled={loading}
            >
              Resend Verification Email{" "}
              {showResend && loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </Button>
          )}
        </Form>
        <span className="form-subheader">
          Already registered? <Link to="/login">Sign In</Link>
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

export default Register;
