import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logOut = useLogout();

  const refresh = async () => {
    try {
      const response = await axios.get("user/login/refresh/", {
        withCredentials: true,
      });
      console.log("setAuth: " + setAuth);

      localStorage.setItem(
        "auth",
        JSON.stringify({ accessToken: response.data.access_token })
      );
      // setAuth((prev) => {
      //   return { ...prev, accessToken: response.data.access_token };
      // });
      console.log("ACCESS TOKEN UPDATED: " + response.data.access_token);
      return response.data.accessToken;
    } catch (err) {
      if (err?.response?.status === 401) {
        logOut();
      }
    }
  };

  return refresh;
};

export default useRefreshToken;
