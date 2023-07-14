import React, { useEffect, useState } from "react";
import { Container, Card, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import NumberFormatter from "./NumberFormatter";
import "./Confirmation.css";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Getting order details sent on redirection after order placement in checkout page
  const orderDetails = location.state;
  console.log(orderDetails);

  useEffect(() => {
    if (!orderDetails?.order_id) {
      // redirecting to checkout page if order details not found
      setLoading(false);
      navigate("/checkout", { replace: true });
    } else {
      setLoading(false);
    }
  }, []);

  const subItems = orderDetails?.order_items?.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );

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
              <h2 className="mb-4 order-title">Your Order Is Placed</h2>
              <h6>
                Thank you for shopping at{" "}
                <b>
                  <span style={{ color: "#5f5b5b" }}>ShopSurfer</span>
                </b>
                !
              </h6>
              {/* <hr /> */}
              <Row className="ml-0 mr-0 mt-4 mb-5 order-summary">
                <Col md={6} className="border p-3">
                  <Row className="text-left font-weight-bold">
                    <Col className="mb-1">Summary:</Col>
                  </Row>
                  <Row className="text-left mb-1">
                    <Col xs={4} md={3}>
                      Order #:
                    </Col>
                    <Col xs={8} md={9}>
                      {orderDetails?.order_id}
                    </Col>
                  </Row>
                  <Row className="text-left mb-1">
                    <Col xs={4} md={3}>
                      Order Date:
                    </Col>
                    <Col xs={8} md={9}>
                      {orderDetails?.created_at}
                    </Col>
                  </Row>
                  <Row className="text-left mb-1">
                    <Col xs={4} md={3}>
                      Order Total:
                    </Col>
                    <Col xs={8} md={9}>
                      ₹ <NumberFormatter number={orderDetails?.total_amount} />
                    </Col>
                  </Row>
                  <Row className="text-left">
                    <Col xs={4} md={3}>
                      Payment:
                    </Col>
                    <Col xs={8} md={9}>
                      Credit Card
                    </Col>
                  </Row>
                </Col>
                <Col
                  md={6}
                  className="border border-left-0 p-3 shipping-address"
                >
                  <Row className="text-left font-weight-bold">
                    <Col className="mb-1">Shipping Address:</Col>
                  </Row>
                  <Row className="text-left">
                    <Col>{orderDetails?.shipping_address}</Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mb-3 mt-3 font-weight-bold">
                <Col xs={4} md={5} className="text-left">
                  Items Shipped
                </Col>
                <Col xs={3} className="text-right">
                  Qty
                </Col>
                <Col xs={5} md={4} className="text-right">
                  Price
                </Col>
              </Row>
              <hr />

              {orderDetails?.order_items.map((item) => (
                <React.Fragment key={item.product_id}>
                  <Row className="mb-4 order-item">
                    <Col
                      xs={4}
                      md={5}
                      className="text-left item-name"
                      as={Link}
                      to={`/product/${item.product_slug}`}
                    >
                      {item.product_name}
                    </Col>
                    <Col xs={3} className="text-right">
                      {item.quantity}
                    </Col>
                    <Col xs={5} md={4} className="text-right">
                      ₹ <NumberFormatter number={item.price} />
                    </Col>
                  </Row>
                  {/* <hr /> */}
                </React.Fragment>
              ))}
              <hr />

              <React.Fragment className="total-summary">
                <Row className="mb-3">
                  <Col xs={7} md={8} className="text-right">
                    Subtotal ({subItems} Item
                    {subItems > 1 && "s"})
                  </Col>
                  <Col xs={5} md={4} className="text-right">
                    ₹ <NumberFormatter number={orderDetails?.sub_total} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={7} md={8} className="text-right">
                    Estimated Tax
                  </Col>
                  <Col xs={5} md={4} className="text-right">
                    ₹ <NumberFormatter number={10} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={7} md={8} className="text-right font-weight-bold">
                    Order Total
                  </Col>
                  <Col xs={5} md={4} className="text-right">
                    ₹ <NumberFormatter number={orderDetails?.total_amount} />
                  </Col>
                </Row>
              </React.Fragment>
            </Card.Body>
          </Card>
          <div className="mt-4 mb-4 text-center">
            {/* <h4 className="text-center">Thank you for shopping with us!</h4> */}
            <Button
              as={Link}
              to="/"
              variant="primary"
              className="font-weight-bold"
            >
              Continue Shopping
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Confirmation;
