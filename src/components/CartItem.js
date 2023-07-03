import { ListGroup, Row, Col, Button, Image, Form } from "react-bootstrap";
import Rating from "./Rating";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import "./CartItem.css";

const CartItem = ({ cartItem, updateItem, disableAll }) => {
  const [loading, setLoading] = useState(false);

  const handleItem = async (event, itemData) => {
    event.preventDefault();
    setLoading(true);
    await updateItem(itemData);
    setLoading(false);
  };

  const cartItemClass =
    loading || disableAll ? "cartItem itemLoading" : "cartItem";

  return (
    <ListGroup.Item disabled={loading || disableAll} className={cartItemClass}>
      <Row>
        <Col md={1}>
          <Form.Check
            type="checkbox"
            checked={cartItem.is_selected}
            onChange={(e) =>
              handleItem(e, {
                type: "SELECT_ITEM",
                payload: {
                  id: cartItem.product.id,
                  is_selected: !cartItem.is_selected,
                },
              })
            }
            className="cartCheck"
          />
        </Col>
        <Col md={2}>
          <Image
            src={cartItem.product.image}
            alt={cartItem.product.name}
            fluid
            rounded
          />
        </Col>
        <Col md={2}>
          <span>{cartItem.product.name}</span>
        </Col>
        <Col md={2}>₹ {cartItem.product.price}</Col>
        <Col md={2}>
          <Rating rating={cartItem.product.rating} onClick={() => {}} />
        </Col>
        <Col md={2}>
          <Form.Control
            as="select"
            value={cartItem.quantity}
            onChange={(e) =>
              handleItem(e, {
                type: "CHANGE_CART_QTY",
                payload: {
                  id: cartItem.product.id,
                  quantity: e.target.value,
                },
              })
            }
            className="cartSelect"
          >
            {[...Array(cartItem.product.quantity)].map((_, x) => (
              <option key={x + 1}>{x + 1}</option>
            ))}
          </Form.Control>
        </Col>
        <Col md={1}>
          <Button
            type="button"
            variant="light"
            onClick={(e) =>
              handleItem(e, {
                type: "REMOVE_FROM_CART",
                payload: [cartItem.product.id],
              })
            }
          >
            <AiFillDelete fontSize="20px" />
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default CartItem;
