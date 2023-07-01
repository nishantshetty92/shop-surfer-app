import { createContext, useReducer, useState, useEffect } from "react";
import { cartReducer, productReducer } from "./Reducers";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  console.log("AUTH PROVIDER");
  const [auth, setAuth] = useState({});
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [addressList, setAddressList] = useState([]);

  const [cart, cartDispatch] = useReducer(
    cartReducer,
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [filter, filterDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  const [loginType, setLoginType] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      console.log(user);
      if (user?.email && user?.newLogin) {
        console.log("User Logged In ");
        let isMounted = true;
        const controller = new AbortController();
        console.log("CURRENT CART: ", cart);

        const getCart = async () => {
          try {
            const response = await axiosPrivate.get("/api/cart/");

            isMounted &&
              cartDispatch({
                type: "UPDATE_CART",
                payload: response.data,
              });
          } catch (err) {
            console.error(err);
          }
        };

        const mergeCart = async () => {
          try {
            const response = await axiosPrivate.post("/api/cart/merge/", cart);

            isMounted &&
              cartDispatch({
                type: "UPDATE_CART",
                payload: response.data,
              });
          } catch (err) {
            console.error(err);
          }
        };

        isMounted && (cart?.length > 0 ? mergeCart() : getCart());
        const updatedUser = { ...user, newLogin: false };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return () => {
          isMounted = false;
          controller.abort();
        };
      } else {
        console.log("User Logged Out");
      }
    };

    fetchData();
  }, [user?.email, user?.newLogin, axiosPrivate]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        loginType,
        setLoginType,
        cart,
        cartDispatch,
        filter,
        filterDispatch,
        addressList,
        setAddressList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
