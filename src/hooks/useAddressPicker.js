import { useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useAddressPicker = () => {
  const { user, setUser, addressList, setAddressList, cartDispatch } =
    useAuth();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const isLogged = (navigate) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      console.log("CHECKOUT SESSION EXPIRED");
      setUser({});
      cartDispatch({ type: "RESET_CART" });
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      return true;
    }
    return false;
  };

  const handleUnauthorized = (navigate) => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    isLogged(navigate);
  };

  const addAddress = async (payload, navigate) => {
    let newAddress = payload;
    try {
      const response = await axiosPrivate.post(
        "/api/address/add/",
        JSON.stringify(newAddress)
      );
      console.log(JSON.stringify(response?.data));
      setAddressList(response?.data);
      return response?.data;
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
        handleUnauthorized(navigate);
      } else {
        console.log("Failed");
      }
      console.log("ADD_ADDRESS");
    }
  };

  const editAddress = async (payload, navigate) => {
    let updatedAddress = payload;
    try {
      const response = await axiosPrivate.patch(
        "/api/address/edit/",
        JSON.stringify(updatedAddress)
      );
      console.log(JSON.stringify(response?.data));
      setAddressList(response?.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
        handleUnauthorized(navigate);
      } else {
        console.log("Failed");
      }
      console.log("EDIT_ADDRESS");
    }
  };

  const selectAddress = (addressId) => {
    const updatedList = addressList?.map((addr) =>
      addressId === addr.id
        ? { ...addr, is_selected: true }
        : { ...addr, is_selected: false }
    );
    setAddressList(updatedList);
    // localStorage.setItem("addressList", JSON.stringify(updatedList));
    console.log("SELECT_ADDRESS");
  };

  const getAddressList = async (navigate) => {
    try {
      const response = await axiosPrivate.get("/api/address/");
      console.log(JSON.stringify(response?.data));
      setAddressList(response?.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
        handleUnauthorized(navigate);
      } else {
        console.log("Order Failed");
      }
    }
    // localStorage.setItem("addressList", JSON.stringify(response_data));
    console.log("GET_LIST");
  };

  const handleAction = async (pickerData, navigate) => {
    const result = isLogged(navigate);
    if (result) {
      if (pickerData.type === "GET_LIST") {
        await getAddressList(navigate);
      } else if (pickerData.type === "SELECT_ADDRESS") {
        selectAddress(pickerData?.payload);
      } else if (pickerData.type === "ADD_ADDRESS") {
        await addAddress(pickerData?.payload, navigate);
      } else if (pickerData.type === "EDIT_ADDRESS") {
        await editAddress(pickerData?.payload, navigate);
      }
    }
  };

  return handleAction;
};

export default useAddressPicker;
