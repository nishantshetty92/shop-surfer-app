import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import useUserLogged from "../hooks/useUserLogged";
import Spinner from "react-bootstrap/Spinner";
import HomeBanner from "./HomeBanner";
import CategoryCarousel from "./CategoryCarousel";
import "./Home.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLogged = useUserLogged();

  const topCategories = [
    {
      id: 1,
      name: "Mobiles",
      slug: "mobiles",
      items: [
        { id: 1, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 2, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 3, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 4, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 5, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 6, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 7, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 8, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 9, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 10, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
      ],
    },
    {
      id: 2,
      name: "Clothing",
      slug: "clothing",
      items: [
        { id: 1, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 2, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 3, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 4, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 5, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 6, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 7, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 8, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 9, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 10, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
      ],
    },
    {
      id: 3,
      name: "Home Appliances",
      slug: "home-appliances",
      items: [
        { id: 1, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 2, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 3, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 4, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 5, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 6, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 7, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
        { id: 8, name: "Moto G 5", price: 10500, seller: "Motorola" },
        { id: 9, name: "Samsung Galaxy S3", price: 12500, seller: "Samsung" },
        { id: 10, name: "IPhone 13 Pro", price: 80000, seller: "Apple" },
      ],
    },
  ];

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
    <Container fluid className="pt-2 pl-2 pr-2 pb-2">
      <HomeBanner />
      {loading ? (
        <Container fluid className="pt-4">
          <Col className="text-center">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />{" "}
            Loading Top Categories...
          </Col>
        </Container>
      ) : (
        <Container fluid className="mt-0 p-3">
          {topCategories.map((category) => (
            <Container
              fluid
              style={{ backgroundColor: "white" }}
              className="mb-4"
              key={category?.id}
            >
              <Row>
                <Col md={2} className="border p-0">
                  <Container
                    fluid
                    className="d-flex align-items-center justify-content-center h-100 category-set"
                  >
                    <Row>
                      <Col
                        className="text-center pt-3 pb-2"
                        style={{ color: "white" }}
                      >
                        <h4>Best of {category?.name}</h4>
                        <Button
                          variant="success"
                          as={Link}
                          to={`/category/${category?.slug}`}
                          className="mt-2 view-button"
                        >
                          View All
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                <Col md={10} className="p-0">
                  <CategoryCarousel items={category?.items} />
                </Col>
              </Row>
            </Container>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default Home;
