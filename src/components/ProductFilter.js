import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import Rating from "./Rating";
import useAuth from "../hooks/useAuth";

const ProductFilter = () => {
  const {
    filter: { byStock, byFastDelivery, byPrice, byRating },
    filterDispatch,
  } = useAuth();
  return (
    <div className="pt-3">
      <Container fluid className="p-4 bg-dark text-light">
        <h5 className="mb-4">Filters</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              label="Ascending"
              name="group1"
              type="radio"
              id={`inline-1`}
              onChange={() =>
                filterDispatch({
                  type: "SORT_BY_PRICE",
                  payload: "lowToHigh",
                })
              }
              checked={byPrice === "lowToHigh" ? true : false}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Descending"
              name="group1"
              type="radio"
              id={`inline-2`}
              onChange={() =>
                filterDispatch({
                  type: "SORT_BY_PRICE",
                  payload: "highToLow",
                })
              }
              checked={byPrice === "highToLow" ? true : false}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Include Out of Stock"
              name="group2"
              type="checkbox"
              id={`inline-3`}
              onChange={() =>
                filterDispatch({
                  type: "FILTER_BY_STOCK",
                })
              }
              checked={byStock}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Fast Delivery Only"
              name="group2"
              type="checkbox"
              id={`inline-4`}
              onChange={() =>
                filterDispatch({
                  type: "FILTER_BY_DELIVERY",
                })
              }
              checked={byFastDelivery}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rating:</Form.Label>
            <Rating
              rating={byRating}
              onClick={(i) =>
                filterDispatch({
                  type: "FILTER_BY_RATING",
                  payload: i + 1,
                })
              }
              style={{ cursor: "pointer" }}
            />
          </Form.Group>
          <Button
            variant="light"
            className="w-100 mt-4"
            onClick={() =>
              filterDispatch({
                type: "CLEAR_FILTERS",
              })
            }
          >
            Clear Filters
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ProductFilter;
