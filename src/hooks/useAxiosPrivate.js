import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  /* This hook wraps the valid accesstoken to every endpoint that needs it.
  Also it refreshes expired accesstoken using the refresh token, this keeps the user logged in*/

  const refresh = useRefreshToken();
  // const { auth, setAuth } = useAuth();
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          console.log("REQUEST INTERCEPT CALLED");
          config.headers["Authorization"] = `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.accessToken
          }`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          console.log("RESPONSE INTERCEPT CALLED");
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${
            JSON.parse(localStorage.getItem("auth"))?.accessToken
          }`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
