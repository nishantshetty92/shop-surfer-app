import React from "react";
import { ListGroup, Row, Col, Button, Image, Form } from "react-bootstrap";
import Rating from "./Rating";
import { AiFillDelete } from "react-icons/ai";
import { CartState } from "../context/Context";

const CartList = () => {
  const {
    state: { cart },
    dispatch,
  } = CartState();
  return (
    <ListGroup>
      {cart?.length === 0 ? (
        <span>Cart is empty!</span>
      ) : (
        cart.map((prod) => (
          <ListGroup.Item key={prod.id}>
            <Row>
              <Col md={2}>
                <Image src={prod.image} alt={prod.name} fluid rounded />
              </Col>
              <Col md={2}>
                <span>{prod.name}</span>
              </Col>
              <Col md={2}>₹ {prod.price}</Col>
              <Col md={2}>
                <Rating rating={prod.rating} onClick={() => {}} />
              </Col>
              <Col md={2}>
                <Form.Control
                  as="select"
                  value={prod.qty}
                  onChange={(e) =>
                    dispatch({
                      type: "CHANGE_CART_QTY",
                      payload: {
                        id: prod.id,
                        qty: e.target.value,
                      },
                    })
                  }
                >
                  {[...Array(prod.inStock)].map((_, x) => (
                    <option key={x + 1}>{x + 1}</option>
                  ))}
                </Form.Control>
              </Col>
              <Col md={2}>
                <Button
                  type="button"
                  variant="light"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: prod,
                    })
                  }
                >
                  <AiFillDelete fontSize="20px" />
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
};

export default CartList;
