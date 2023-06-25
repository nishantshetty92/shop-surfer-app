import { React, useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CartTotal = () => {
  const { cart } = useAuth();
  const [total, setTotal] = useState();
  const [subItems, setSubItems] = useState();

  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, cartItem) =>
          cartItem.is_selected
            ? acc + Number(cartItem.product.price) * cartItem.quantity
            : acc,
        0
      )
    );

    setSubItems(
      cart.reduce(
        (acc, cartItem) =>
          cartItem.is_selected ? acc + cartItem.quantity : acc,
        0
      )
    );
  }, [cart]);
  return (
    <Container className="bg-dark">
      <Card
        className="text-center bg-dark text-light"
        style={{ border: "none" }}
      >
        <Card.Body>
          <Card.Title>Subtotal ({subItems}) items</Card.Title>
          <Card.Text>Total: ₹ {total}</Card.Text>
          <Button
            type="button"
            disabled={total === 0}
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
