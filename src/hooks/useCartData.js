import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "../api/axios";

const useCartData = (cartData) => {
  const { auth, cartDispatch } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const addCartItem = async (data) => {
    try {
      const format_payload = { product_id: data.id };
      const response = await axiosPrivate.post(
        "/api/cart/add/",
        format_payload
        // {
        //   headers: {
        //     Authorization: `Bearer ${auth?.accessToken}`,
        //   },
        // }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return;
    }
  };

  const addCartItems = async (data) => {
    try {
      const response = await axiosPrivate.post(
        "/api/cart/add_items/",
        data
        // {
        //   headers: {
        //     Authorization: `Bearer ${auth?.accessToken}`,
        //   },
        // }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return;
    }
  };

  const updateCartItem = async (data) => {
    try {
      let format_payload = data;
      if (data?.id) {
        format_payload = { ...format_payload, product_id: data.id };
        delete format_payload.id;
      }

      const response = await axiosPrivate.patch(
        "/api/cart/update/",
        format_payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return;
    }
  };

  const deleteCartItem = async (data) => {
    try {
      const format_payload = { product_ids: data };
      const response = await axiosPrivate.delete("/api/cart/delete/", {
        data: format_payload,

        // headers: {
        //   Authorization: `Bearer ${auth?.accessToken}`,
        // },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return;
    }
  };

  const getLatestCart = async () => {
    try {
      const response = await axiosPrivate.get("/api/cart/");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return;
    }
  };

  const getCartData = async (cartData) => {
    console.log("getCartData: " + auth?.accessToken);
    console.log("access is there");
    let response;
    if (auth?.accessToken) {
      if (cartData.type === "ADD_TO_CART") {
        response = await addCartItem(cartData.payload);
      } else if (cartData.type === "ADD_CART_ITEMS") {
        response = await addCartItems(cartData.payload);
      } else if (
        cartData.type === "CHANGE_CART_QTY" ||
        cartData.type === "SELECT_ITEM" ||
        cartData.type === "SELECT_ALL"
      ) {
        response = await updateCartItem(cartData.payload);
      } else if (cartData.type === "REMOVE_FROM_CART") {
        response = await deleteCartItem(cartData.payload);
      } else {
        response = await getLatestCart();
      }

      // response = await getLatestCart();
      // console.log(response);
      response &&
        cartDispatch({
          type: "UPDATE_CART",
          payload: response,
        });
    } else {
      if (cartData.type === "ADD_TO_CART") {
        cartDispatch({
          type: "ADD_TO_CART",
          payload: cartData.payload,
        });
      } else if (cartData.type === "CHANGE_CART_QTY") {
        cartDispatch({
          type: "CHANGE_CART_QTY",
          payload: cartData.payload,
        });
      } else if (cartData.type === "SELECT_ITEM") {
        cartDispatch({
          type: "SELECT_ITEM",
          payload: cartData.payload,
        });
      } else if (cartData.type === "SELECT_ALL") {
        cartDispatch({
          type: "SELECT_ALL",
          payload: cartData.payload,
        });
      } else if (cartData.type === "REMOVE_FROM_CART") {
        cartDispatch({
          type: "REMOVE_FROM_CART",
          payload: cartData.payload,
        });
      }
    }
  };
  return getCartData;
};

export default useCartData;
