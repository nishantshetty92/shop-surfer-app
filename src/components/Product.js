import React from "react";
import { Card, Button } from "react-bootstrap";
import { CartState } from "../context/Context";
import Rating from "./Rating";

const Product = ({ prod }) => {
  const {
    state: { cart },
    dispatch,
  } = CartState();
  return (
    <Card className="mb-4">
      <Card.Img variant="top" src={prod.image} alt={prod.name} />
      <Card.Body>
        <Card.Title>{prod.name}</Card.Title>
        <Card.Subtitle style={{ paddingBottom: 10 }}>
          <span>₹ {prod.price}</span>
          {prod.fastDelivery ? (
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
        {cart.some((p) => p.id === prod.id) ? (
          <Button
            variant="danger"
            onClick={() =>
              dispatch({
                type: "REMOVE_FROM_CART",
                payload: prod,
              })
            }
            className="mt-3"
          >
            Remove from Cart
          </Button>
        ) : (
          <Button
            onClick={() =>
              dispatch({
                type: "ADD_TO_CART",
                payload: prod,
              })
            }
            disabled={!prod.inStock}
            className="mt-3"
          >
            {!prod.inStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
