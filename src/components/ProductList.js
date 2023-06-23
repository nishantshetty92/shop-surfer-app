import { React } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Product from "./Product";
import useAuth from "../hooks/useAuth";

const ProductList = () => {
  const {
    state: { products },
    filterState: { byPrice, byStock, byFastDelivery, byRating, searchQuery },
  } = useAuth();

  // console.log(byPrice, byStock, byFastDelivery, byRating, searchQuery);
  // console.log(products);

  const transformProducts = () => {
    let sortedProducts = products;

    if (byPrice) {
      sortedProducts = sortedProducts.sort((a, b) =>
        byPrice === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }

    if (!byStock) {
      sortedProducts = sortedProducts.filter((prod) => prod.inStock);
    }

    if (byFastDelivery) {
      sortedProducts = sortedProducts.filter((prod) => prod.fastDelivery);
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
