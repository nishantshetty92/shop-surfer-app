import React, { useState } from "react";
import { Card, Button, Form, Col, Row } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import Rating from "./Rating";
import Spinner from "react-bootstrap/Spinner";
import { FaStar } from "react-icons/fa";
import NumberFormatter from "./NumberFormatter";
import "./Product.css";
import { Link } from "react-router-dom";

const Product = ({ prod }) => {
  const { cart } = useAuth();
  const [loading, setLoading] = useState(false);

  const getCartData = useCartData();

  const cartItem = cart.find((cartItem) => cartItem.product.id === prod.id);

  const handleAction = async (cartAction) => {
    setLoading(true);
    await getCartData(cartAction);
    setLoading(false);
  };

  return (
    <Card className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${prod.slug}`}>
          <Card.Img
            variant="top"
            src={prod.image}
            alt={prod.name}
            className="product-image"
          />
        </Link>
      </div>

      <Card.Body>
        <Card.Title>
          <Col
            className="prod-title pl-0 mb-3 align-items-left"
            as={Link}
            to={`/product/${prod?.slug}`}
          >
            {prod.name}
          </Col>
        </Card.Title>
        <Card.Subtitle>
          <Col className="pl-0 mb-2 align-items-left">
            <span>
              ₹ <NumberFormatter number={prod?.price} />
            </span>
            <Button className="prod-rating ml-2">
              {prod.rating} <FaStar className="mb-1" />
            </Button>
          </Col>
          <Col className="pl-0 mb-3 align-items-left">
            {prod.fast_delivery ? (
              <div>Fast Delivery</div>
            ) : (
              <div>4 days delivery</div>
            )}
          </Col>
        </Card.Subtitle>
        {cartItem?.product?.id === prod.id ? (
          <Row>
            <Col className="pr-0">
              <Form.Control
                as="select"
                value={cartItem.quantity}
                onChange={(e) =>
                  handleAction({
                    type: "CHANGE_CART_QTY",
                    payload: {
                      id: cartItem.product.id,
                      quantity: e.target.value,
                    },
                  })
                }
                disabled={loading}
                style={{ cursor: "pointer" }}
              >
                {[...Array(cartItem.product.quantity)].map((_, x) => (
                  <option key={x + 1}>{x + 1}</option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Button
                variant="danger"
                onClick={() =>
                  handleAction({
                    type: "REMOVE_FROM_CART",
                    payload: [prod.id],
                  })
                }
                disabled={loading}
              >
                Remove{"  "}
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
            </Col>
          </Row>
        ) : prod.in_stock ? (
          <Button
            onClick={() =>
              handleAction({
                type: "ADD_TO_CART",
                payload: prod,
              })
            }
            disabled={loading}
            className="mt-0"
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
        ) : (
          <div style={{ color: "#e92c2c", fontWeight: "bold" }}>
            Out of Stock
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
