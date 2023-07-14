import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import ProductRating from "./ProductRating";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import "./ProductDetail.css";
import NumberFormatter from "./NumberFormatter";
import useUserLogged from "../hooks/useUserLogged";

const ProductDetail = () => {
  const isLogged = useUserLogged();
  const navigate = useNavigate();
  const { cart, setBuyItem } = useAuth();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { slug } = useParams(); // gets product slug from url

  // Checks if product is in the cart, returns cart item if found
  const cartItem = cart.find((cartItem) => cartItem.product.id === product.id);

  useEffect(() => {
    isLogged();
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
    // This function handles any updates to the cart
    e.preventDefault();
    setBtnLoading(true);
    if (cartAction.type === "ADD_TO_CART") {
      /*Adding key addQty with selected quantity to indicate it is cart quantity not product quantity,
       db has field quantity for both cartitem and product, need to change field name later*/
      // Sending selected quantity while adding product to cart
      cartAction.payload = {
        ...cartAction.payload,
        addQty: quantity,
      };
    } else {
      // resetting quantity value in app state
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
    // This function adds product to cart before redirecting to checkout page
    e.preventDefault();
    setBuyNowLoading(true);
    const buyItem = {
      is_selected: true,
      quantity: cartItem ? cartItem?.quantity : quantity, // using selected cart item quantity if product in cart
      product: product,
    };
    buyItem.product = {
      ...buyItem.product,
      addQty: cartItem ? cartItem?.quantity : quantity, // adding addQty to indicate it is cart item quantity not product quantity
    };

    // This endpoint ensures the product has updated quantity if it already exists in cart
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
        <Col className="text-center mt-5">
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
              <Card.Body className="p-0" style={{ backgroundColor: "#eaeded" }}>
                <Row className="mt-3 mb-3">
                  <Col
                    xs={7}
                    className="text-right p-2 pr-3 font-weight-bold"
                    style={{ color: "#4e4e4e" }}
                  >
                    Quantity:
                  </Col>
                  <Col xs={5}>
                    {/* If product is already in cart, dropdown shows selected cart item quantity
                     Else it shows app state value for quantity */}
                    <Form.Control
                      as="select"
                      value={
                        cartItem?.product?.id === product.id
                          ? cartItem?.quantity
                          : quantity
                      }
                      // if product is in cart then it updates cart item quantity else it updates app state quantity
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
                      disabled={
                        !product.in_stock || btnLoading || buyNowLoading
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {[...Array(product.quantity)].map((_, x) => (
                        <option key={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>

                <Row className="mb-0">
                  <Col md={6} className="mb-3">
                    {cartItem?.product?.id === product.id ? (
                      <Button
                        variant="danger"
                        className="font-weight-bold w-100 pt-3 pb-3"
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
                        className="font-weight-bold w-100 pt-3 pb-3"
                        onClick={(e) =>
                          handleAction(e, {
                            type: "ADD_TO_CART",
                            payload: product,
                          })
                        }
                        disabled={
                          !product.in_stock || btnLoading || buyNowLoading
                        }
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
                  <Col md={6} className="mb-0">
                    <Button
                      variant="success"
                      className="font-weight-bold w-100 pt-3 pb-3"
                      onClick={buyNow}
                      disabled={
                        !product.in_stock || buyNowLoading || btnLoading
                      }
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
              </Card.Body>
            </Card>
          </Col>
          <Col md={7} className="product-details mt-4 mb-4 pl-2">
            <Card>
              <Card.Body>
                <Col className="font-weight-bold mb-3">
                  <h2>{product.name}</h2>
                </Col>
                <Col className="mb-3">
                  <span className="ratingNumber">{product.rating}</span>
                  {product?.rating && (
                    <ProductRating
                      rating={product.rating}
                      onClick={(e) => {}}
                      className="rating"
                    />
                  )}
                  {"  "}
                  {product.in_stock ? (
                    <span className="availability-green">In Stock</span>
                  ) : (
                    <span className="availability-red">Out of Stock</span>
                  )}
                </Col>
                <Col className="mb-3 price">
                  <h3>
                    <sup className="rupee">₹</sup>
                    <NumberFormatter number={product?.price} />
                  </h3>
                </Col>
                <Col className="mb-3 ml-3">
                  <ul style={{ paddingLeft: "0" }}>
                    {product.description?.map((line, x) => (
                      <li key={x}>{line}</li>
                    ))}
                  </ul>
                </Col>
                <Col className="mb-3">
                  <span>Sold by: {product.seller}</span>
                </Col>
                <Col className="mb-3">
                  <span>
                    {product.fast_delivery
                      ? "Fast Delivery"
                      : "Delivery in 4 days"}
                  </span>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail;
