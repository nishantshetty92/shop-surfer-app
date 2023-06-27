import { React, useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  Card,
  Button,
  Col,
  Row,
  Navbar,
  Form,
} from "react-bootstrap";
import { RiShoppingCartLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useCartData from "../hooks/useCartData";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const getCartData = useCartData();

  useEffect(() => {
    const selectCount = cart.filter((item) => item.is_selected).length;
    selectCount === 0 && navigate("/cart", { replace: true });

    setAddressList([
      {
        id: 1,
        name: "Nishant Shetty",
        mobile_number: "9833166313",
        pincode: "421202",
        address1: "403, Sundara Palace, Bldg No.2",
        address2: "Near Railway Crossing",
        city: "Dombivli(W)",
        state: "Maharashtra",
      },
      {
        id: 2,
        name: "Deepak Singh",
        mobile_number: "9833166313",
        pincode: "421202",
        address1: "1106, Balaji Residency, Bldg No.2",
        address2: "Near Railway Crossing",
        city: "Dombivli(E)",
        state: "Maharashtra",
      },
    ]);
  }, []);

  const updateAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const selectedAddress = addressList.find(
    (addr) => addr.id === selectedAddressId
  );

  const subTotal = cart.reduce(
    (acc, item) =>
      item.is_selected ? acc + Number(item.product.price) * item.quantity : acc,
    0
  );

  const tax = 10;
  const total = subTotal + tax;
  const paymentMethod = "Credit Card";

  console.log(selectedAddressId);
  console.log(selectedAddress);

  const placeOrder = async () => {
    const shippingAddress = `${selectedAddress.name}, ${selectedAddress.address1}, ${selectedAddress.address2},
     ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}, Phone number: ${selectedAddress.mobile_number}`;

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

      orderDetails &&
        navigate("/confirmation", {
          state: orderDetails,
          replace: true,
        });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Order Failed");
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
            <ListGroup className="mb-4">
              <ListGroup.Item className="fw-bold" variant="primary">
                Shipping Address
              </ListGroup.Item>
              <ListGroup.Item>
                {addressList.map((addr) => (
                  <Card
                    className={`address-card mb-3 ${
                      selectedAddressId === Number(addr.id) ? "selected" : ""
                    }`}
                    key={addr.id}
                    onClick={() => updateAddress(addr.id)}
                  >
                    <Card.Body>
                      <div className="address-item">
                        <Form.Check
                          type="radio"
                          name="shippingAddress"
                          id={`shippingAddress${addr.id}`}
                          value={addr.id}
                          label=""
                          className="radio-button"
                          checked={selectedAddressId === Number(addr.id)}
                          onChange={() => {}}
                        />
                        <Card.Text>
                          <span className="mb-0">
                            <b>{addr.name}</b>, {addr.address1}, {addr.address2}
                            , {addr.city}, {addr.state}, {addr.pincode}, Phone
                            number: {addr.mobile_number}
                          </span>
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </ListGroup.Item>
            </ListGroup>
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
                      <>
                        <div
                          className="d-flex justify-content-between mb-2"
                          key={item.product.id}
                        >
                          <span>{item.product.name}</span>
                          <span>
                            ₹ {(item.quantity * item.product.price).toFixed(2)}
                          </span>
                        </div>
                        <div
                          className="d-flex justify-content-between mb-2"
                          key={item.product.id}
                        >
                          <span>Quantity:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <hr />
                      </>
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
                    // as={Link}
                    // to="/confirmation"
                    variant="primary"
                    className="mt-3"
                    onClick={placeOrder}
                  >
                    Place Order
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
