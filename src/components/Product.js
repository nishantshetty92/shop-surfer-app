import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import Rating from "./Rating";
import Spinner from "react-bootstrap/Spinner";
import "./Product.css";

const Product = ({ prod }) => {
  const { cart } = useAuth();
  const [loading, setLoading] = useState(false);

  const getCartData = useCartData();

  const handleAction = async (cartAction) => {
    setLoading(true);
    await getCartData(cartAction);
    setLoading(false);
  };
  return (
    <Card className="product-card">
      <div className="product-image-container">
        <Card.Img
          variant="top"
          src={prod.image}
          alt={prod.name}
          className="product-image"
        />
      </div>

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
            onClick={() =>
              handleAction({
                type: "REMOVE_FROM_CART",
                payload: [prod.id],
              })
            }
            className="mt-3"
            disabled={loading}
          >
            Remove from Cart{"  "}
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        ) : (
          <Button
            onClick={() =>
              handleAction({
                type: "ADD_TO_CART",
                payload: prod,
              })
            }
            disabled={!prod.in_stock || loading}
            className="mt-3"
          >
            Add to Cart{"  "}
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
