import React, { useEffect, useState } from "react";
import { Card, Container, Alert, Button, Col } from "react-bootstrap";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { BsExclamationCircleFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import Spinner from "react-bootstrap/Spinner";
import "./VerifyUser.css";

const VerifyUser = () => {
  const [verificationStatus, setVerificationStatus] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Getting jwt token from URL
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    setToken(token);

    // Verifying the token on the backend
    token && verifyToken(token);
  }, []);

  const decodeAccessToken = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);
      return decodedToken;
    } catch (error) {
      console.log("Failed to decode JWT:", error.message);
    }
    return;
  };

  const verifyToken = async (token) => {
    setLoading(true);
    try {
      // This endpoint activates the registered user if sent token is verified & valid
      const response = await axios.post("/auth/verify/register/", { token });

      setResponse(response);
      setVerificationStatus("success");
      setMessage(response?.data?.message);
    } catch (err) {
      console.log(err);
      setVerificationStatus("error");
      if (!err?.response) {
        setMessage("No Server Response");
      } else {
        setResponse(err?.response);
        setMessage(err.response?.data?.detail?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResendLoading(true);
    try {
      // This endpoint resends verification email to registered user email address
      // Getting user email address from token sent in URL
      const decodedToken = decodeAccessToken(token);
      if (decodedToken?.email) {
        const response = await axios.post("/auth/resend/register/", {
          email: decodedToken.email,
        });
        setAlertStatus("success");
        setAlertMessage(response?.data?.message);
      }
    } catch (err) {
      setAlertStatus("error");
      if (!err?.response) {
        setAlertMessage("No Server Response");
      } else {
        setAlertMessage(err.response?.data?.detail?.message);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container className="verify-user-container" fluid>
      <Col sm={12} md={8} lg={6} xl={4}>
        <span className="logo form-header mb-2">
          <RiShoppingCartLine size={48} /> ShopSurfer
        </span>
        <Card className="verify-card">
          <Card.Body>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Verifying...
              </>
            ) : (
              <>
                <div className="icon-container">
                  {verificationStatus === "success" ? (
                    <FaCheckCircle size={64} className="success-icon" />
                  ) : (
                    <BsExclamationCircleFill
                      size={64}
                      className="danger-icon"
                    />
                  )}
                </div>
                <div className="message-container">
                  {verificationStatus === "success" ? (
                    <span className="success">{message}</span>
                  ) : (
                    <span className="error">{message}</span>
                  )}
                </div>
                <div className="button-container mb-0">
                  {/* Based on api response code returned showing button for different cases*/}
                  {[200, 409].includes(response?.status) ? (
                    <Button
                      variant="primary"
                      className="w-100"
                      as={Link}
                      to="/login"
                    >
                      Sign In
                    </Button>
                  ) : response?.status === 401 ? (
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={resendVerification}
                      disabled={resendLoading}
                    >
                      Resend Verification Link{" "}
                      {resendLoading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  ) : (
                    [400, 404].includes(response?.status) && (
                      <Button
                        variant="primary"
                        className="w-100"
                        as={Link}
                        to="/register"
                      >
                        Sign Up
                      </Button>
                    )
                  )}
                </div>
              </>
            )}
          </Card.Body>
        </Card>
        <Alert
          variant={alertStatus === "error" ? "danger" : "success"}
          className="alert-message mt-4"
          role="alert"
          show={alertMessage !== ""}
        >
          {alertMessage}
        </Alert>
      </Col>
    </Container>
  );
};

export default VerifyUser;
