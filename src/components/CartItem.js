import {
  ListGroup,
  Row,
  Col,
  Button,
  Image,
  Form,
  Container,
} from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import NumberFormatter from "./NumberFormatter";
import "./CartItem.css";
import { Link } from "react-router-dom";
import ProductRating from "./ProductRating";

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
        <Col>
          <Row>
            <Col md={3} className="mt-1 mb-1">
              <div className="product-image-container">
                <div className="product-image-wrapper">
                  <Link to={`/product/${cartItem.product.slug}`}>
                    <Image
                      src={cartItem.product.image}
                      alt={cartItem.product.name}
                      fluid
                      rounded
                    />
                  </Link>
                </div>
              </div>
            </Col>
            <Col md={9}>
              <Container className="p-0 pt-3 pb-2">
                <Row className="mb-3">
                  <Col xs={6}>
                    <Link
                      to={`/product/${cartItem.product.slug}`}
                      className="title"
                    >
                      {cartItem.product.name}
                    </Link>
                  </Col>
                  <Col xs={6} className="text-right pr-1">
                    <Form.Check
                      inline
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
                </Row>
                <Col className="pl-0 mb-3 price">
                  ₹ <NumberFormatter number={cartItem.product.price} />
                </Col>
                <Col className="pl-0 mb-3">
                  <span className="ratingNumber">
                    {cartItem.product.rating}
                  </span>
                  <ProductRating
                    rating={cartItem.product.rating}
                    onClick={(e) => {}}
                    className="rating"
                  />
                </Col>
                <Col className="pl-0 mb-3 delivery">
                  {cartItem.product.fast_delivery
                    ? "Fast Delivery"
                    : "Delivery in 4 Days"}
                </Col>
                <Row className="text-left">
                  <Col xs={4} md={3}>
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
                  <Col xs={8} md={9}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={(e) =>
                        handleItem(e, {
                          type: "REMOVE_FROM_CART",
                          payload: [cartItem.product.id],
                        })
                      }
                      className="item-remove"
                    >
                      <AiFillDelete fontSize="20px" /> Remove
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default CartItem;
