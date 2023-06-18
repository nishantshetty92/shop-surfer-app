import React from "react";
import { Container, Button, Card } from "react-bootstrap";

const CartTotal = ({ products }) => {
  return (
    <Container className="bg-dark">
      <Card
        className="text-center bg-dark text-light"
        style={{ border: "none" }}
      >
        <Card.Body>
          <Card.Title>Subtotal ({products.length}) items</Card.Title>
          <Card.Text>Total: ₹ {20}</Card.Text>
          <Button
            type="button"
            disabled={products.length === 0}
            className="w-100"
          >
            Proceed to Checkout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CartTotal;
