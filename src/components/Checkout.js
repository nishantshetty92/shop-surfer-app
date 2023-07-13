import { useEffect, useState } from "react";
import React from "react";
import {
  Container,
  ListGroup,
  Card,
  Button,
  Col,
  Row,
  Navbar,
} from "react-bootstrap";
import { RiShoppingCartLine } from "react-icons/ri";
import { BsArrowLeftSquare } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useCartData from "../hooks/useCartData";
import AddressPicker from "./AddressPicker";
import Spinner from "react-bootstrap/Spinner";
import NumberFormatter from "./NumberFormatter";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cart,
    addressList,
    user,
    setAddressList,
    cleanData,
    buyItem,
    setBuyItem,
  } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  let activeCart;

  // fetching ?buynow=1 param from url when user clicks Buy Now for a product
  const urlParams = new URLSearchParams(window.location.search);
  const buyNow = urlParams.get("buynow");

  const verifyCart = () => {
    let itemIsFound;
    // checking for url param buynow and the buy product info in app state
    if (buyNow && buyItem) {
      console.log(buyItem, "CHECKOUT BUYITEM FOUND");
      itemIsFound = cart.find(
        (cartItem) =>
          cartItem.product.id === buyItem?.product?.id && cartItem.is_selected
      );
      // if buy now product is found in cart, checkout for only that product else checkout the whole cart
      activeCart = itemIsFound ? [buyItem] : cart;
    } else {
      console.log("CHECKOUT BUYITEM NOT FOUND");
      activeCart = cart;
    }
    !itemIsFound && localStorage.removeItem("buyItem");
  };

  const getCartData = useCartData();

  const isLogged = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      console.log("CHECKOUT SESSION EXPIRED");
      setAddressList([]);
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      return true;
    }
    return false;
  };

  verifyCart();

  const handleUnauthorized = () => {
    cleanData();
    isLogged();
  };

  useEffect(() => {
    console.log("CHECKOUT");
    const selectedCount = activeCart.filter((item) => item.is_selected).length;
    selectedCount === 0 && navigate("/cart", { replace: true });
  }, [activeCart]);

  const subTotal = activeCart.reduce(
    (acc, item) =>
      item.is_selected ? acc + Number(item.product.price) * item.quantity : acc,
    0
  );

  const subItems = activeCart.reduce(
    (acc, item) => (item.is_selected ? acc + Number(item.quantity) : acc),
    0
  );

  const tax = 10;
  const total = subTotal + tax;
  const paymentMethod = "Credit Card";

  const placeOrder = async () => {
    // This function places the order

    const result = isLogged();
    if (result) {
      setLoading(true);
      const selectedAddress = addressList.find((addr) => addr.is_selected);
      const shippingAddress = `${selectedAddress.full_name}, ${selectedAddress.address1}, ${selectedAddress.address2}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pin_code}, Phone number: ${selectedAddress.mobile_number}`;

      const orderItems = activeCart
        .filter((item) => item.is_selected)
        .map((item) => ({
          product_id: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        }));

      const orderPayload = {
        order: {
          total_amount: Number(total.toFixed(2)),
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
        },
        order_items: orderItems,
      };
      console.log(JSON.stringify(orderPayload));

      try {
        const orderResponse = await axiosPrivate.post(
          "/api/order/place/",
          JSON.stringify(orderPayload)
        );
        console.log(JSON.stringify(orderResponse?.data));

        let orderDetails = orderResponse?.data;
        orderDetails.sub_total = subTotal;
        const orderProductIds = orderDetails?.order_items.map(
          (item) => item.product_id
        );

        if (orderProductIds?.length > 0) {
          const response = await getCartData({
            type: "REMOVE_FROM_CART",
            payload: orderProductIds,
          });
        }
        setLoading(false);

        // Once buy now product order is placed, removing buy now product info from app state
        setBuyItem(null);
        localStorage.removeItem("buyItem");

        orderDetails &&
          navigate("/confirmation", {
            state: orderDetails,
            replace: true,
          });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response");
        } else if (err.response?.status === 401) {
          handleUnauthorized();
        } else {
          setErrMsg("Order Failed");
        }
      }
    }
  };
  return (
    <div className="app-container">
      <div className="content-container">
        <Navbar bg="dark" variant="dark" className="navbar-container">
          <Navbar.Brand className="d-flex" as={Link} to="/cart">
            <BsArrowLeftSquare />
          </Navbar.Brand>
          <Navbar.Brand className="mx-auto">
            <RiShoppingCartLine className="navbar-icon" /> Checkout
          </Navbar.Brand>
        </Navbar>
        <Container className="mt-3">
          {activeCart.filter((item) => item.is_selected).length === 0 ? (
            <Col lg={8} md={12}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {"  "}
              Verifying Cart...
            </Col>
          ) : (
            <Row>
              <Col lg={8} md={12}>
                <AddressPicker />
                <ListGroup className="mb-4">
                  <ListGroup.Item className="fw-bold" variant="primary">
                    Payment Method
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="mb-0">Credit Card</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="mb-0">**** **** **** 1234</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="mb-0">Expiry: 12/24</span>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup className="mb-4">
                  <ListGroup.Item className="fw-bold" variant="primary">
                    Item Summary
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {activeCart.map(
                      (item, x) =>
                        item.is_selected && (
                          <React.Fragment key={item.product.id}>
                            <Col className="mb-2 pl-0">
                              <Link
                                to={`/product/${item.product.slug}`}
                                className="item-summary-title"
                              >
                                {item.product.name}
                              </Link>
                            </Col>
                            <Row className="mb-2">
                              <Col>Qty: {item.quantity}</Col>
                              <Col className="text-right">
                                ₹{" "}
                                <NumberFormatter
                                  number={item.quantity * item.product.price}
                                />
                              </Col>
                            </Row>
                            <hr />
                          </React.Fragment>
                        )
                    )}

                    <Row className="mb-2">
                      <Col>
                        Subtotal ({subItems} Item{subItems > 1 && "s"}):
                      </Col>
                      <Col className="text-right">
                        ₹ <NumberFormatter number={subTotal} />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col lg={4} md={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-left pl-3">
                      Order Summary
                    </Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <span>Subtotal:</span>
                          <span>
                            ₹ <NumberFormatter number={subTotal} />
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Tax:</span>
                          <span>₹ {tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Total:</span>
                          <span className="fw-bold">
                            ₹ <NumberFormatter number={total} />
                          </span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                    <div className="text-center">
                      <Button
                        disabled={addressList?.length === 0 || loading}
                        variant="primary"
                        className="mt-3"
                        onClick={placeOrder}
                      >
                        Place Order{"  "}
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
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Checkout;
