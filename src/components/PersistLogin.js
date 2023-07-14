import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Container } from "react-bootstrap";

const PersistLogin = () => {
  /* This component is wrapped over all the pages that use a logged in user session
  This component just refreshes the accesstoken for a logged in user */
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

    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="app-container">
          <Container fluid className="content-container text-center pt-5">
            Verifying Session...
          </Container>
        </div>
      ) : (
        // All wrapped child components
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
