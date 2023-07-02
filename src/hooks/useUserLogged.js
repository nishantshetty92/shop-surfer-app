import useAuth from "./useAuth";
import useCartData from "./useCartData";

const useUserLogged = () => {
  const getCartData = useCartData();
  const { user, setUser, cartDispatch } = useAuth();

  const isLogged = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      console.log("CLEAN DATA");
      setUser({});
      cartDispatch({ type: "RESET_CART" });
    } else if (auth?.accessToken && !user?.email) {
      console.log("UPDATE DATA");
      setUser(JSON.parse(localStorage.getItem("user")));
      getCartData({ type: "UPDATE_CART" });
    }
  };
  return isLogged;
};

export default useUserLogged;
