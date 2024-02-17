import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useCartData = () => {
  const { cartDispatch, user, setUser, cleanData } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  const isLogged = () => {
    // this function logs user out if session expired, also adds user data if user happens to be logged in
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      // deletes user data and redirects to login page
      console.log("useCartData SESSION EXPIRED");
      setUser({});
      cartDispatch({ type: "RESET_CART" });
      navigate("/login", { state: { from: location }, replace: true });
    } else if (auth?.accessToken && !user?.email) {
      // loads user data if user is logged in
      console.log("UPDATE DATA");
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  };

  const handleUnauthorized = () => {
    // this logs out user on session expiration when user tries to update the cart
    console.log("HANDLEUNAUTHORIZED");
    cleanData();
    isLogged();
  };

  const addCartItem = async (data) => {
    try {
      let format_payload = { product_id: data.id };
      format_payload = data?.addQty
        ? { ...format_payload, quantity: data.addQty }
        : format_payload;
      const response = await axiosPrivate.post(
        "/data/cart/add/",
        format_payload
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      if (error?.response?.status === 401) {
        handleUnauthorized();
      }
    } finally {
    }
  };

  const mergeCart = async (data) => {
    try {
      const response = await axiosPrivate.post("/data/cart/merge/", data);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
      }
      console.error("Error fetching cart data:", error);
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
        "/data/cart/update/",
        format_payload
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
      }
      console.error("Error fetching cart data:", error);
    }
  };

  const deleteCartItem = async (data) => {
    try {
      const format_payload = { product_ids: data };
      const response = await axiosPrivate.delete("/data/cart/delete/", {
        data: format_payload,
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
      }
      console.error("Error fetching cart data:", error);
    } finally {
    }
  };

  const getLatestCart = async () => {
    try {
      const response = await axiosPrivate.get("/data/cart/");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      if (error?.response?.status === 401) {
        handleUnauthorized();
      }
    }
  };

  const getCartData = async (cartData) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log("getCartData: " + auth?.accessToken);
    isLogged();
    let response;
    // updates cart in the backend if user if logged in else updates in cart data in app state
    if (auth?.accessToken) {
      if (cartData.type === "ADD_TO_CART") {
        response = await addCartItem(cartData.payload);
      } else if (cartData.type === "MERGE_CART") {
        response = await mergeCart(cartData.payload);
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
      return response;
    } else {
      if (cartData.type === "ADD_TO_CART") {
        cartDispatch({
          type: "ADD_TO_CART",
          payload: cartData.payload,
        });
      } else if (cartData.type === "MERGE_CART") {
        cartDispatch({
          type: "MERGE_CART",
          payload: cartData.payload[0].product,
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
      return true;
    }
  };
  return getCartData;
};

export default useCartData;
