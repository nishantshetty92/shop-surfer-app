import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth, setUser } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios("user/logout/", {
        withCredentials: true,
      });
      setUser({});
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
