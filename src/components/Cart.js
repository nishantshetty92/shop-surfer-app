import { React, useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import useUserLogged from "../hooks/useUserLogged";
import CartList from "./CartList";
import CartTotal from "./CartTotal";
import Spinner from "react-bootstrap/Spinner";

const Cart = () => {
  // const products = [...Array(7)].map((_, i) => ({
  //   id: i,
  //   name: "Product 2",
  //   price: "19.00",
  //   rating: 2,
  //   image: "http://placeimg.com/640/480/cats",
  //   fastDelivery: true,
  //   qty: 0,
  // }));

  // const { auth } = useAuth();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [loading, setLoading] = useState(false);
  const getCartData = useCartData();
  const isLogged = useUserLogged();

  const updateCart = async () => {
    setLoading(true);
    auth?.accessToken && (await getCartData({ type: "UPDATE_CART" }));
    setLoading(false);
  };

  useEffect(() => {
    isLogged();
    let isMounted = true;

    isMounted && updateCart();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container fluid className="pt-4">
      {loading ? (
        <Col className="text-center mt-5">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          Loading Cart...
        </Col>
      ) : (
        <Row className="h-100">
          <Col md={9}>
            <CartList />
          </Col>
          <Col md={3}>
            <CartTotal />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
