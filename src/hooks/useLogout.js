import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, setUser, cartDispatch, cleanData } = useAuth();

  const logout = async () => {
    // setAuth({});
    try {
      await axios("user/logout/", {
        withCredentials: true,
      });
      // setUser({});
      // cartDispatch({ type: "RESET_CART" });

      cleanData();
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
