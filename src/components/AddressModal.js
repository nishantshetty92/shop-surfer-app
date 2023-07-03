import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const AddressModal = ({
  show,
  handleClose,
  formData,
  setFormData,
  submitAddress,
  action,
}) => {
  const [loading, setLoading] = useState(false);
  const resetFormData = () => {
    setFormData({
      full_name: "",
      mobile_number: "",
      pin_code: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      is_default: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(JSON.stringify(formData));
    // Handle form submission logic here
    await submitAddress(formData, action);
    setLoading(false);
    resetFormData();
    handleClose();
  };

  const stateOptions = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {action === "add" ? "Add a new address" : "Edit your address"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-4">
            <Form.Label>
              <strong>Full Name</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMobile" className="mb-4">
            <Form.Label>
              <strong>Mobile Number</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPinCode" className="mb-4">
            <Form.Label>
              <strong>Pin Code</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              placeholder="6 digits [0-9] PIN code"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress1" className="mb-4">
            <Form.Label>
              <strong>Flat, House no., Building, Company, Apartment</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress2" className="mb-4">
            <Form.Label>
              <strong>Area, Street, Sector, Village</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-4">
            <Col>
              <Form.Group controlId="formCity">
                <Form.Label>
                  <strong>City</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formState">
                <Form.Label>
                  <strong>State</strong>
                </Form.Label>
                <Form.Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select a state</option>
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-end">
            <Button variant="primary" type="submit" className="mr-2">
              Use Address{" "}
              {loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </Button>
            {/* <Button variant="danger" onClick={handleClose}>
              Cancel
            </Button> */}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddressModal;
