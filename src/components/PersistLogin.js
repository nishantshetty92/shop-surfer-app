import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Container } from "react-bootstrap";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  console.log("PERSIST LOGIN");
  // const { auth } = useAuth();
  const refresh = useRefreshToken();
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        // console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    // console.log(`isLoading: ${isLoading}`);
    // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <div className="app-container">
          <Container fluid className="content-container text-center pt-5">
            Verifying Session...
          </Container>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
