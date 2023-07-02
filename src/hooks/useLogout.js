import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, setUser, cartDispatch } = useAuth();

  const logout = async () => {
    // setAuth({});
    try {
      const response = await axios("user/logout/", {
        withCredentials: true,
      });
      // setUser({});
      // cartDispatch({ type: "RESET_CART" });

      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
