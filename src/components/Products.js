import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

const Products = () => {
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
