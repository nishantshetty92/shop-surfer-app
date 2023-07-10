import React, { useEffect, useState } from "react";
import { Container, Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "./Confirmation.css";
import NumberFormatter from "./NumberFormatter";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const orderDetails = location.state;
  console.log(orderDetails);

  useEffect(() => {
    if (!orderDetails?.order_id) {
      setLoading(false);
      navigate("/checkout", { replace: true });
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <Container>
      {loading ? (
        <Col className="mt-3">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          Verifying Order Details...
        </Col>
      ) : (
        <>
          <Card className="mt-3">
            <Card.Body className="text-center">
              <RiCheckDoubleLine className="order-icon" />
              <h2 className="mb-4">Order Confirmation</h2>
              <p>Your order has been successfully placed.</p>
              <p>Order ID: {orderDetails?.order_id}</p>
              <h4>Order Details</h4>
              <ul className="order-details-list">
                <li>
                  <span>Date:</span>
                  <span>{orderDetails?.created_at}</span>
                </li>
                <li>
                  <span>Payment Method:</span>
                  <span>{orderDetails?.payment_method}</span>
                </li>
                <li>
                  <span style={{ textAlign: "left" }}>Shipping Address:</span>
                  <span
                    style={{
                      width: "400px",
                      textAlign: "right",
                    }}
                  >
                    {orderDetails?.shipping_address}
                  </span>
                </li>
              </ul>
              <hr />
              <h4>Order Summary</h4>

              <ul className="order-details-list">
                {orderDetails?.order_items.map((item) => (
                  <React.Fragment key={item.product_id}>
                    <li>
                      <span>Product:</span>
                      <span>{item.product_name}</span>
                    </li>
                    <li>
                      <span>Price:</span>
                      <span>
                        ₹ <NumberFormatter number={item.price} />
                      </span>
                    </li>
                    <li>
                      <span>Quantity:</span>
                      <span>{item.quantity}</span>
                    </li>
                    <hr />
                  </React.Fragment>
                ))}

                <li>
                  <span>Total:</span>
                  <span>
                    ₹ <NumberFormatter number={orderDetails?.total_amount} />
                  </span>
                </li>
              </ul>
            </Card.Body>
          </Card>
          <div className="mt-4 mb-4 text-center">
            <h4 className="text-center">Thank you for shopping with us!</h4>
            <Button as={Link} to="/" variant="primary" className="mt-3">
              Continue Shopping
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Confirmation;
