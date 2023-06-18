import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { RiStarFill } from "react-icons/ri";

const ProductList = () => {
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
    {
      id: 1,
      name: "Product 1",
      price: 10.99,
      rating: 4,
      image: "product1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 19.99,
      rating: 3.5,
      image: "product2.jpg",
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-dark text-light p-4">
          {/* Side Menu */}
          <h5 className="mb-3">Filters</h5>
          <Form.Group>
            <Form.Label>Price Range</Form.Label>
            <Form.Control type="range" min={0} max={100} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <Form.Control as="select">
              <option value="">All</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" className="mt-3">
            Apply Filters
          </Button>
        </Col>
        <Col md={9} className="p-4">
          {/* Product Grid */}
          <Row>
            {products.map((product) => (
              <Col md={4} key={product.id}>
                <Card className="mb-4">
                  <Card.Img variant="top" src={product.image} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Card.Text>
                      Rating: {product.rating}{" "}
                      <RiStarFill className="text-warning" />
                    </Card.Text>
                    <Button variant="primary">Add to Cart</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
