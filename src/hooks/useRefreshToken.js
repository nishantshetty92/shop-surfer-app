import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("user/login/refresh/", {
      withCredentials: true,
    });
    console.log("setAuth: " + setAuth);

    setAuth((prev) => {
      return { ...prev, accessToken: response.data.access_token };
    });
    console.log("ACCESS TOKEN UPDATED: " + response.data.access_token);
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
