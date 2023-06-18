import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import CartList from "./CartList";
import CartTotal from "./CartTotal";

const Cart = () => {
  const products = [...Array(7)].map((_, i) => ({
    id: i,
    name: "Product 2",
    price: "19.00",
    rating: 2,
    image: "http://placeimg.com/640/480/cats",
    fastDelivery: true,
    qty: 0,
  }));
  return (
    <Container fluid className="pt-4">
      <Row className="h-100">
        <Col md={9}>
          <CartList products={products} />
        </Col>
        <Col md={3}>
          <CartTotal products={products} />
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
