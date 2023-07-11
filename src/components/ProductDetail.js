import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "./Rating";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import "./ProductDetail.css";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { cart, setBuyItem } = useAuth();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { slug } = useParams();

  const cartItem = cart.find((cartItem) => cartItem.product.id === product.id);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/product/${slug}/`, {
          signal: controller.signal,
        });
        setLoading(false);
        console.log(response.data);
        if (isMounted) {
          setProduct(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getProduct();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug]);

  const getCartData = useCartData();

  const handleAction = async (e, cartAction) => {
    e.preventDefault();
    setBtnLoading(true);
    if (cartAction.type === "ADD_TO_CART") {
      cartAction.payload = {
        ...cartAction.payload,
        addQty: quantity,
      };
    } else {
      setQuantity(1);
    }
    await getCartData(cartAction);
    setBtnLoading(false);
  };

  const updateQuantity = (e) => {
    e.preventDefault();
    setQuantity(e.target.value);
  };

  const buyNow = async (e) => {
    e.preventDefault();
    setBuyNowLoading(true);
    const buyItem = {
      is_selected: true,
      quantity: cartItem ? cartItem?.quantity : quantity,
      product: product,
    };
    buyItem.product = {
      ...buyItem.product,
      addQty: cartItem ? cartItem?.quantity : quantity,
    };

    const response = await getCartData({
      type: "MERGE_CART",
      payload: [buyItem],
    });
    setBuyItem(buyItem);
    localStorage.setItem("buyItem", JSON.stringify(buyItem));
    setBuyNowLoading(false);
    response &&
      navigate("/checkout?buynow=1", {
        replace: true,
      });
  };

  return (
    <Container className="product-detail" style={{ maxWidth: "90%" }}>
      {loading ? (
        <Col>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          Loading Product...
        </Col>
      ) : (
        <Row>
          <Col md={5} className="product-image mt-4">
            <Card className="border-0">
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.name}
                // height="300px"
              />
            </Card>
          </Col>
          <Col md={7} className="product-details mt-4 mb-4">
            <Card>
              <Card.Body>
                <Col className="title font-weight-bold mb-3">
                  {product.name}
                </Col>
                <Col className="mb-3">
                  <Rating rating={product.rating} onClick={(e) => {}} />
                  {"  "}
                  {product.rating}
                  {"  "}
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </Col>
                <Col className="mb-3">₹ {product.price}</Col>
                <Col className="mb-3">{product.description}</Col>
                <Col className="mb-3">
                  <span>Sold by: {product.seller}</span>
                </Col>
                <hr />
                <Row>
                  <Col md={3} className="mb-2">
                    <Form.Control
                      as="select"
                      value={
                        cartItem?.product?.id === product.id
                          ? cartItem?.quantity
                          : quantity
                      }
                      onChange={(e) =>
                        cartItem?.product?.id === product.id
                          ? handleAction(e, {
                              type: "CHANGE_CART_QTY",
                              payload: {
                                id: product.id,
                                quantity: e.target.value,
                              },
                            })
                          : updateQuantity(e)
                      }
                      disabled={btnLoading || buyNowLoading}
                      style={{ cursor: "pointer" }}
                    >
                      {[...Array(product.quantity)].map((_, x) => (
                        <option key={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={9}>
                    <Row>
                      <Col md={6} className="mb-2">
                        {cartItem?.product?.id === product.id ? (
                          <Button
                            variant="danger"
                            className="font-weight-bold w-100"
                            onClick={(e) =>
                              handleAction(e, {
                                type: "REMOVE_FROM_CART",
                                payload: [product.id],
                              })
                            }
                            disabled={btnLoading || buyNowLoading}
                          >
                            Remove from Cart{"  "}
                            {btnLoading && (
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
                            variant="primary"
                            className="font-weight-bold w-100"
                            onClick={(e) =>
                              handleAction(e, {
                                type: "ADD_TO_CART",
                                payload: product,
                              })
                            }
                            disabled={btnLoading || buyNowLoading}
                          >
                            Add to Cart
                            {"  "}
                            {btnLoading && (
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
                      </Col>
                      <Col md={6} className="mb-2">
                        <Button
                          variant="success"
                          className="font-weight-bold w-100"
                          onClick={buyNow}
                          disabled={buyNowLoading || btnLoading}
                        >
                          Buy Now{"  "}
                          {buyNowLoading && (
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
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail;
