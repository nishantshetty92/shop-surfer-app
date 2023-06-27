import React from "react";
import { Card, Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import Rating from "./Rating";

const Product = ({ prod }) => {
  const { cart, cartDispatch } = useAuth();

  const getCartData = useCartData();
  return (
    <Card className="mb-4">
      <Card.Img
        variant="top"
        src="http://placeimg.com/640/480/cats"
        alt={prod.name}
      />
      <Card.Body>
        <Card.Title>{prod.name}</Card.Title>
        <Card.Subtitle style={{ paddingBottom: 10 }}>
          <span>₹ {prod.price}</span>
          {prod.fast_delivery ? (
            <div>Fast Delivery</div>
          ) : (
            <div>4 days delivery</div>
          )}
          <Rating
            rating={prod.rating}
            onClick={(i) => {}}
            style={{ cursor: "pointer" }}
          />
        </Card.Subtitle>
        {cart.some((cartItem) => cartItem.product.id === prod.id) ? (
          <Button
            variant="danger"
            onClick={
              () =>
                getCartData({
                  type: "REMOVE_FROM_CART",
                  payload: [prod.id],
                })
              // dispatch({
              //   type: "REMOVE_FROM_CART",
              //   payload: prod,
              // })
            }
            className="mt-3"
          >
            Remove from Cart
          </Button>
        ) : (
          <Button
            onClick={
              () =>
                getCartData({
                  type: "ADD_TO_CART",
                  payload: prod,
                })
              // dispatch({
              //   type: "ADD_TO_CART",
              //   payload: prod,
              // })
            }
            disabled={!prod.in_stock}
            className="mt-3"
          >
            {!prod.in_stock ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
