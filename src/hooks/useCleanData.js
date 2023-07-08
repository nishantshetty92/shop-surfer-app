const useCleanData = () => {
  const cleanData = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };
  return cleanData;
};

export default useCleanData;
