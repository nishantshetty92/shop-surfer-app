import React, { useState, useEffect } from "react";
import { Container, Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useUserLogged from "../hooks/useUserLogged";
import Spinner from "react-bootstrap/Spinner";
import "./Category.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLogged = useUserLogged();

  useEffect(() => {
    isLogged();
    let isMounted = true;
    const controller = new AbortController();

    const getCategories = async () => {
      try {
        const response = await axios.get("/api/categories/", {
          signal: controller.signal,
        });
        setLoading(false);
        console.log(response.data);
        isMounted && setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getCategories();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

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
        {loading ? (
          <Col className="text-center">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Loading Categories...
          </Col>
        ) : (
          <Row>
            {categories.map((category) => (
              <Col md={4} key={category.id} className="mb-4">
                <Card className="category-card">
                  <div className="category-image-container">
                    <Card.Img
                      variant="top"
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                  </div>

                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                    {/* <Card.Subtitle style={{ paddingBottom: 10 }}>
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
                  </Card.Subtitle> */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;
