import React from "react";
import { Container, Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import uuid from "react-uuid";

const Home = () => {
  const products = [
    {
      id: uuid(),
      name: "laptop",
      price: 80,
      image: "http://placeimg.com/640/480/cats",
      inStock: 1,
      fastDelivery: false,
      rating: 2,
    },
    {
      id: uuid(),
      name: "mobile",
      price: 20,
      image: "http://placeimg.com/640/480/cats",
      inStock: 3,
      fastDelivery: true,
      rating: 4,
    },
    {
      id: uuid(),
      name: "television",
      price: 1000,
      image: "http://placeimg.com/640/480/cats",
      inStock: 50,
      fastDelivery: false,
      rating: 3,
    },
    {
      id: uuid(),
      name: "earphones",
      price: 200,
      image: "http://placeimg.com/640/480/cats",
      inStock: 10,
      fastDelivery: true,
      rating: 4,
    },
  ];

  return (
    <>
      <Container fluid>
        <Card className="text-center home-banner">
          <Card.Body>
            <Card.Title>Welcome to ShopSurfer</Card.Title>
            <Card.Text>Discover amazing products and shop with ease.</Card.Text>
            <Button variant="primary" as={Link} to="/products">
              Shop Now
            </Button>
          </Card.Body>
        </Card>
      </Container>
      <Container fluid className="pt-4">
        <Row>
          {products.map((prod) => (
            <Col md={4} key={prod.id}>
              <Card className="mb-4">
                <Card.Img variant="top" src={prod.image} alt={prod.name} />
                <Card.Body>
                  <Card.Title>{prod.name}</Card.Title>
                  <Card.Subtitle style={{ paddingBottom: 10 }}>
                    <span>₹ {prod.price}</span>
                  </Card.Subtitle>
                  <Card.Subtitle>
                    <span>
                      <Rating
                        rating={prod.rating}
                        onClick={(i) => {}}
                        style={{ cursor: "pointer" }}
                      />
                    </span>
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
