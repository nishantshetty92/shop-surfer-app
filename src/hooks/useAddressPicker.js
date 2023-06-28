import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useAddressPicker = (pickerData) => {
  const { addressList, setAddressList } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const addAddress = async (payload) => {
    let newAddress = payload;
    try {
      const response = await axiosPrivate.post(
        "/api/address/add/",
        JSON.stringify(newAddress)
      );
      console.log(JSON.stringify(response?.data));
      setAddressList(response?.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Failed");
      }
      console.log("ADD_ADDRESS");
    }
  };

  const editAddress = async (payload) => {
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

  const getAddressList = async () => {
    try {
      const response = await axiosPrivate.get("/api/address/");
      console.log(JSON.stringify(response?.data));
      setAddressList(response?.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log("Order Failed");
      }
    }
    // localStorage.setItem("addressList", JSON.stringify(response_data));
    console.log("GET_LIST");
  };

  const handleAction = (pickerData) => {
    if (pickerData.type === "GET_LIST") {
      getAddressList();
    } else if (pickerData.type === "SELECT_ADDRESS") {
      selectAddress(pickerData?.payload);
    } else if (pickerData.type === "ADD_ADDRESS") {
      addAddress(pickerData?.payload);
    } else if (pickerData.type === "EDIT_ADDRESS") {
      editAddress(pickerData?.payload);
    }
  };

  return handleAction;
};

export default useAddressPicker;
