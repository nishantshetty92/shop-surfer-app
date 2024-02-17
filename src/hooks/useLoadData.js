import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";

const useLoadData = () => {
  const { cart, cartDispatch } = useAuth();

  const getCart = async () => {
    try {
      const response = await axiosPrivate.get("/data/cart/");

      cartDispatch({
        type: "UPDATE_CART",
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      // navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const mergeCart = async () => {
    try {
      const response = await axiosPrivate.post("/data/cart/merge/", cart);

      cartDispatch({
        type: "UPDATE_CART",
        payload: response.data,
      });
    } catch (err) {
      console.error(err);
      // navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      cart.length > 0 ? await mergeCart() : await getCart();
    };
    loadData();
  }, []);

  return true;
};

export default useLoadData;
