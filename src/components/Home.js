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
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLogged = useUserLogged();

  useEffect(() => {
    isLogged();
    let isMounted = true;
    const controller = new AbortController();

    const getTopCategories = async () => {
      try {
        const response = await axios.get("/api/top_categories/", {
          signal: controller.signal,
        });
        setLoading(false);
        console.log(response.data);
        isMounted && setTopCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getTopCategories();

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
          {topCategories.map(
            (category) =>
              category?.products?.length > 0 && (
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
                      <CategoryCarousel products={category?.products} />
                    </Col>
                  </Row>
                </Container>
              )
          )}
        </Container>
      )}
    </Container>
  );
};

export default Home;
