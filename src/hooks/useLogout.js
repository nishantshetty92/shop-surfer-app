import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, setUser, cartDispatch, cleanData } = useAuth();

  const logout = async () => {
    // This endpoint deletes the refresh token for logged in user
    // setAuth({});
    try {
      await axios("user/logout/", {
        withCredentials: true,
      });
      // setUser({});
      // cartDispatch({ type: "RESET_CART" });

      // Deletes all auth, user and cart data
      cleanData();
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
