import { React, useState, useEffect } from "react";

import { ListGroup, Row, Col, Button, Image, Form } from "react-bootstrap";
import Rating from "./Rating";
import { AiFillDelete } from "react-icons/ai";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";

const CartList = () => {
  const { cart } = useAuth();
  const getCartData = useCartData();
  const [selectAll, setSelectAll] = useState(true);

  console.log("SELECT ALL:", selectAll);

  const updateSelectAll = (e) => {
    e.preventDefault();
    getCartData({
      type: "SELECT_ALL",
      payload: {
        is_selected: selectAll,
      },
    });
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
          </a>
        </span>
      )}

      <ListGroup>
        {cart?.length === 0 ? (
          <span>Cart is empty!</span>
        ) : (
          cart.map((cartItem) => (
            <ListGroup.Item key={cartItem.product.id}>
              <Row>
                <Col md={1}>
                  <Form.Check
                    type="checkbox"
                    checked={cartItem.is_selected}
                    onChange={() =>
                      getCartData({
                        type: "SELECT_ITEM",
                        payload: {
                          id: cartItem.product.id,
                          is_selected: !cartItem.is_selected,
                        },
                      })
                    }
                  />
                </Col>
                <Col md={2}>
                  <Image
                    src={cartItem.product.image}
                    alt={cartItem.product.name}
                    fluid
                    rounded
                  />
                </Col>
                <Col md={2}>
                  <span>{cartItem.product.name}</span>
                </Col>
                <Col md={2}>₹ {cartItem.product.price}</Col>
                <Col md={2}>
                  <Rating rating={cartItem.product.rating} onClick={() => {}} />
                </Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={cartItem.quantity}
                    onChange={(e) =>
                      getCartData({
                        type: "CHANGE_CART_QTY",
                        payload: {
                          id: cartItem.product.id,
                          quantity: e.target.value,
                        },
                      })
                    }
                  >
                    {[...Array(cartItem.product.quantity)].map((_, x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={1}>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() =>
                      getCartData({
                        type: "REMOVE_FROM_CART",
                        payload: [cartItem.product.id],
                      })
                    }
                  >
                    <AiFillDelete fontSize="20px" />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </>
  );
};

export default CartList;
