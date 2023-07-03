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
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useCartData from "../hooks/useCartData";
import AddressPicker from "./AddressPicker";
import Spinner from "react-bootstrap/Spinner";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, addressList, user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const getCartData = useCartData();

  const isLogged = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.accessToken && user?.email) {
      console.log("CHECKOUT SESSION EXPIRED");
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      return true;
    }
    return false;
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("auth");
    isLogged();
  };

  useEffect(() => {
    const selectCount = cart.filter((item) => item.is_selected).length;
    selectCount === 0 && navigate("/cart", { replace: true });
  }, []);

  const subTotal = cart.reduce(
    (acc, item) =>
      item.is_selected ? acc + Number(item.product.price) * item.quantity : acc,
    0
  );

  const tax = 10;
  const total = subTotal + tax;
  const paymentMethod = "Credit Card";

  const placeOrder = async () => {
    const result = isLogged();
    if (result) {
      setLoading(true);
      const selectedAddress = addressList.find((addr) => addr.is_selected);
      const shippingAddress = `${selectedAddress.full_name}, ${selectedAddress.address1}, ${selectedAddress.address2}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pin_code}, Phone number: ${selectedAddress.mobile_number}`;

      const orderItems = cart
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

        const orderDetails = orderResponse?.data;
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
    <div className="page-container">
      <Navbar bg="dark" variant="dark" className="navbar-container">
        <Navbar.Brand className="mx-auto">
          <RiShoppingCartLine className="navbar-icon" /> Checkout
        </Navbar.Brand>
      </Navbar>
      <Container className="mt-3">
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
                Order Summary
              </ListGroup.Item>
              <ListGroup.Item>
                {cart.map(
                  (item) =>
                    item.is_selected && (
                      <React.Fragment key={item.product.id}>
                        <div className="d-flex justify-content-between mb-2">
                          <span>{item.product.name}</span>
                          <span>
                            ₹ {(item.quantity * item.product.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Quantity:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <hr />
                      </React.Fragment>
                    )
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">Subtotal:</span>
                  <span>₹ {subTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">Tax:</span>
                  <span>₹ {tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total:</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col lg={4} md={12}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>₹ {subTotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Tax:</span>
                      <span>₹ {tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold">₹ {total.toFixed(2)}</span>
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
      </Container>
    </div>
  );
};

export default Checkout;
