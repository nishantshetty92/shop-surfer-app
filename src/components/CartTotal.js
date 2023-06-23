import { React, useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CartTotal = ({ products }) => {
  const {
    state: { cart },
  } = useAuth();
  const [total, setTotal] = useState();

  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price) * curr.qty, 0)
    );
  }, [cart]);
  return (
    <Container className="bg-dark">
      <Card
        className="text-center bg-dark text-light"
        style={{ border: "none" }}
      >
        <Card.Body>
          <Card.Title>Subtotal ({cart.length}) items</Card.Title>
          <Card.Text>Total: ₹ {total}</Card.Text>
          <Button
            type="button"
            disabled={cart.length === 0}
            className="w-100"
            as={Link}
            to="/checkout"
          >
            Proceed to Checkout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CartTotal;
