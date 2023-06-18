import React from "react";
import { Container, Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartState } from "../context/Context";
import Rating from "./Rating";

const Home = () => {
  const {
    state: { products },
  } = CartState();

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
