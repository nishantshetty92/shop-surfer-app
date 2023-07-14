import { React } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NumberFormatter from "./NumberFormatter";

const CartTotal = () => {
  const { cart } = useAuth();
  const total = cart.reduce(
    (acc, cartItem) =>
      cartItem.is_selected
        ? acc + Number(cartItem.product.price) * Number(cartItem.quantity)
        : acc,
    0
  );
  const subItems = cart.reduce(
    (acc, cartItem) =>
      cartItem.is_selected ? acc + Number(cartItem.quantity) : acc,
    0
  );

  return (
    <Container className="bg-dark">
      <Card
        className="text-center bg-dark text-light"
        style={{ border: "none" }}
      >
        <Card.Body>
          <Card.Title>Subtotal ({subItems}) items</Card.Title>
          <Card.Text>
            Total: ₹ <NumberFormatter number={total.toFixed(2)} />
          </Card.Text>
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
