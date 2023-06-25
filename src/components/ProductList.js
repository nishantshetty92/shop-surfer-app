import { React, useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Product from "./Product";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const ProductList = () => {
  const {
    filter: { byPrice, byStock, byFastDelivery, byRating, searchQuery },
  } = useAuth();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProducts = async () => {
      try {
        const response = await axios.get("/api/products/1/", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const transformProducts = () => {
    let sortedProducts = products;

    if (byPrice) {
      sortedProducts = sortedProducts.sort((a, b) =>
        byPrice === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }

    if (!byStock) {
      sortedProducts = sortedProducts.filter((prod) => prod.in_stock);
    }

    if (byFastDelivery) {
      sortedProducts = sortedProducts.filter((prod) => prod.fast_delivery);
    }

    if (byRating) {
      sortedProducts = sortedProducts.filter((prod) => prod.rating >= byRating);
    }

    if (searchQuery) {
      sortedProducts = sortedProducts.filter((prod) =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sortedProducts;
  };
  return (
    <Container fluid className="pt-4">
      <Row>
        {transformProducts()?.length === 0 ? (
          <span>No Products Found</span>
        ) : (
          transformProducts().map((prod) => (
            <Col md={4} key={prod.id}>
              <Product prod={prod} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ProductList;
