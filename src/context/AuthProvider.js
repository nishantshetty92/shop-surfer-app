import { createContext, useReducer, useState } from "react";
import { cartReducer, productReducer } from "./Reducers";
import uuid from "react-uuid";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const products = [
    {
      id: uuid(),
      name: "laptop",
      price: 80,
      image: "http://placeimg.com/640/480/cats",
      inStock: 1,
      fastDelivery: false,
      rating: 2,
    },
    {
      id: uuid(),
      name: "mobile",
      price: 20,
      image: "http://placeimg.com/640/480/cats",
      inStock: 3,
      fastDelivery: true,
      rating: 4,
    },
    {
      id: uuid(),
      name: "television",
      price: 1000,
      image: "http://placeimg.com/640/480/cats",
      inStock: 50,
      fastDelivery: false,
      rating: 3,
    },
    {
      id: uuid(),
      name: "earphones",
      price: 200,
      image: "http://placeimg.com/640/480/cats",
      inStock: 10,
      fastDelivery: true,
      rating: 4,
    },
  ];

  const [state, dispatch] = useReducer(cartReducer, {
    products: products,
    cart: [],
  });

  const [filterState, filterDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, state, dispatch, filterState, filterDispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
