import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import Rating from "./Rating";

const ProductFilter = () => {
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
              onChange={() => {}}
              checked={false}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Descending"
              name="group1"
              type="radio"
              id={`inline-2`}
              onChange={() => {}}
              checked={true}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Include Out of Stock"
              name="group2"
              type="checkbox"
              id={`inline-3`}
              onChange={() => {}}
              checked={true}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              label="Fast Delivery Only"
              name="group2"
              type="checkbox"
              id={`inline-4`}
              onChange={() => {}}
              checked={false}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rating:</Form.Label>
            <Rating
              rating={4}
              onClick={(i) => {}}
              style={{ cursor: "pointer" }}
            />
          </Form.Group>
          <Button variant="light" className="w-100 mt-4">
            Clear Filters
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ProductFilter;
