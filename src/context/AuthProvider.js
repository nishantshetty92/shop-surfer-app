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
  const axiosPrivate = useAxiosPrivate();

  const [cart, cartDispatch] = useReducer(
    cartReducer,
    JSON.parse(localStorage.getItem("cart")) || {
      cart: [],
      selectedCount: 0,
      selectAll: false,
    }
  );

  const [filter, filterDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        console.log("User Logged In ");
        let isMounted = true;
        const controller = new AbortController();

        const getCartData = async () => {
          try {
            const response = await axiosPrivate.get("/api/cart/", {
              signal: controller.signal,
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth?.accessToken}`,
              },
            });

            isMounted &&
              cartDispatch({
                type: "UPDATE_CART",
                payload: response.data,
              });
          } catch (err) {
            console.error(err);
            // navigate("/login", { state: { from: location }, replace: true });
          }
        };

        isMounted && getCartData();

        return () => {
          isMounted = false;
          controller.abort();
        };
      } else {
        console.log("User Logged Out");
      }
    };

    fetchData();
  }, [user?.email, axiosPrivate]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        setUser,
        cart,
        cartDispatch,
        filter,
        filterDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
