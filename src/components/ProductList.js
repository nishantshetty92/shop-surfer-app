import React from "react";
import { Container, Card, Col, Row, Button } from "react-bootstrap";
import Rating from "./Rating";

const ProductList = () => {
  //   const products = [
  //     {
  //       id: 1,
  //       name: "Product 1",
  //       price: 10.99,
  //       rating: 4,
  //       image: "product1.jpg",
  //     },
  //     {
  //       id: 2,
  //       name: "Product 2",
  //       price: 19.99,
  //       rating: 3.5,
  //       image: "product2.jpg",
  //     },
  //     {
  //       id: 2,
  //       name: "Product 2",
  //       price: 19.99,
  //       rating: 3.5,
  //       image: "product2.jpg",
  //     },
  //     {
  //       id: 2,
  //       name: "Product 2",
  //       price: 19.99,
  //       rating: 3.5,
  //       image: "product2.jpg",
  //     },
  //   ];

  const products = [...Array(10)].map((_, i) => ({
    id: i,
    name: "Product 2",
    price: "19.00",
    rating: 2,
    image: "http://placeimg.com/640/480/cats",
    fastDelivery: true,
  }));
  return (
    <Container fluid className="pt-4">
      <Row>
        {products.map((prod) => (
          <Col md={4} key={prod.id}>
            <Card className="mb-4">
              <Card.Img variant="top" src={prod.image} alt={prod.name} />
              <Card.Body>
                <Card.Title>{prod.name}</Card.Title>
                <Card.Subtitle style={{ paddingBottom: 10 }}>
                  <span>₹ {prod.price.split(".")[0]}</span>
                  {prod.fastDelivery ? (
                    <div>Fast Delivery</div>
                  ) : (
                    <div>4 days delivery</div>
                  )}
                  <Rating
                    rating={prod.rating}
                    onClick={(i) => {}}
                    style={{ cursor: "pointer" }}
                  />
                </Card.Subtitle>
                <Button variant="primary" className="mt-3">
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductList;
