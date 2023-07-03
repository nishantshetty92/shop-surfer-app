import { React, useState, useEffect } from "react";

import { ListGroup } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import CartItem from "./CartItem";

const CartList = () => {
  const { cart } = useAuth();
  const getCartData = useCartData();
  const [selectAll, setSelectAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  console.log("SELECT ALL:", selectAll);

  const updateItem = async (itemData) => {
    setLoading(true);
    await getCartData(itemData);
    setLoading(false);
  };

  const updateSelectAll = async (e) => {
    e.preventDefault();
    setLoadingAll(true);
    await getCartData({
      type: "SELECT_ALL",
      payload: {
        is_selected: selectAll,
      },
    });
    setLoadingAll(false);
    // setSelectAll((prevSelectAll) => !prevSelectAll);
  };

  useEffect(() => {
    const selectedCount = cart.reduce(
      (acc, cartItem) => (cartItem.is_selected ? acc + 1 : acc),
      0
    );

    if (selectedCount !== cart.length) {
      setSelectAll(true);
    } else if (selectedCount === cart.length) {
      setSelectAll(false);
    } else if (selectedCount === 0) {
      setSelectAll(false);
    }
  }, [cart]);
  return (
    <>
      {cart?.length > 0 && (
        <span>
          {cart.reduce(
            (acc, cartItem) => (cartItem.is_selected ? acc + 1 : acc),
            0
          ) === 0 && <span>No items selected. </span>}
          <a href="#" onClick={updateSelectAll}>
            {selectAll ? "Select All" : "Deselect All"}
          </a>{" "}
          {(loading || loadingAll) && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </span>
      )}

      <ListGroup>
        {cart?.length === 0 ? (
          <span>Cart is empty!</span>
        ) : (
          cart.map((cartItem) => (
            <CartItem
              key={cartItem.product.id}
              cartItem={cartItem}
              updateItem={updateItem}
              disableAll={loadingAll}
            />
          ))
        )}
      </ListGroup>
    </>
  );
};

export default CartList;
