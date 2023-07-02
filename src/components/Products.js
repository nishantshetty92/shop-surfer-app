import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useUserLogged from "../hooks/useUserLogged";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

const Products = () => {
  const isLogged = useUserLogged();
  useEffect(() => {
    isLogged();
  }, []);

  return (
    <Container fluid>
      <Row className="h-100">
        <Col md={3}>
          <ProductFilter />
        </Col>
        <Col md={9}>
          <ProductList />
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
