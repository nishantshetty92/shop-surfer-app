import { React, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useCartData from "../hooks/useCartData";
import CartList from "./CartList";
import CartTotal from "./CartTotal";

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
  const getCartData = useCartData();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // const getLatestCart = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/api/cart/");
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error("Error fetching cart data:", error);
    //   }
    // };
    // auth?.accessToken && getLatestCart();
    auth?.accessToken && getCartData({ type: "UPDATE_CART" });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Container fluid className="pt-4">
      <Row className="h-100">
        <Col md={9}>
          <CartList />
        </Col>
        <Col md={3}>
          <CartTotal />
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
