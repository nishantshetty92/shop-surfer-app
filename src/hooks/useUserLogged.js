import useAuth from "./useAuth";
import useCartData from "./useCartData";

const useUserLogged = () => {
  /* This hook deletes any user data(auth, user & cart) if session has expired.
  It also adds user data in active tab, if user has logged in on another tab */
  const getCartData = useCartData();
  const { user, setUser, cartDispatch } = useAuth();

  const isLogged = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      // Deletes Data if session expired
      console.log("CLEAN DATA");
      setUser({});
      cartDispatch({ type: "RESET_CART" });
    } else if (auth?.accessToken && !user?.email) {
      // Adds Data in active tab if session is valid
      console.log("UPDATE DATA");
      setUser(JSON.parse(localStorage.getItem("user")));
      getCartData({ type: "UPDATE_CART" });
    }
  };
  return isLogged;
};

export default useUserLogged;
