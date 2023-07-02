import { React, useEffect, useState } from "react";
import { ListGroup, Card, Form } from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import useAuth from "../hooks/useAuth";
import useAddressPicker from "../hooks/useAddressPicker";
import AddressModal from "./AddressModal";
import { useNavigate } from "react-router-dom";

const AddressPicker = () => {
  const { auth, addressList } = useAuth();
  console.log("AddressPicker");

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    pin_code: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    is_default: false,
  });
  const [action, setAction] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openAddModal = (event) => {
    event.preventDefault();
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
    setAction("add");
    setShowModal(true);
  };

  const openEditModal = (event, payload) => {
    event.preventDefault();
    setFormData({ ...payload });
    setAction("edit");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();
  const picker = useAddressPicker();

  useEffect(() => {
    picker({ type: "GET_LIST" }, navigate);
  }, []);

  const selectAddress = (addressId) => {
    picker({ type: "SELECT_ADDRESS", payload: addressId }, navigate);
  };

  const submitAddress = (payload, action) => {
    action == "add" &&
      picker({ type: "ADD_ADDRESS", payload: payload }, navigate);
    action == "edit" &&
      picker({ type: "EDIT_ADDRESS", payload: payload }, navigate);
  };

  return (
    <>
      <ListGroup className="mb-4">
        <ListGroup.Item className="fw-bold" variant="primary">
          Shipping Address
        </ListGroup.Item>
        <ListGroup.Item>
          {addressList?.length == 0 && (
            <Card className="address-card mb-3">
              <Card.Body>No Addresses Found</Card.Body>
            </Card>
          )}
          {addressList.map((addr) => (
            <>
              <Card
                className={`address-card mb-3 ${
                  addr.is_selected ? "selected" : ""
                }`}
                key={addr.id}
              >
                <Card.Body onClick={() => selectAddress(addr.id)}>
                  <div className="address-item">
                    <Form.Check
                      type="radio"
                      name="shippingAddress"
                      id={`shippingAddress${addr.id}`}
                      value={addr.id}
                      label=""
                      className="radio-button"
                      checked={addr.is_selected}
                      onChange={() => {}}
                    />
                    <Card.Text>
                      <span className="mb-0">
                        <b>{addr.full_name}</b>, {addr.address1},{" "}
                        {addr.address2}, {addr.city}, {addr.state},{" "}
                        {addr.pin_code}, Phone number: {addr.mobile_number}
                      </span>
                    </Card.Text>
                  </div>
                </Card.Body>
                <span className="mb-2 mr-2 d-flex justify-content-end">
                  <a href="#" onClick={(event) => openEditModal(event, addr)}>
                    Edit address
                  </a>
                </span>
              </Card>
            </>
          ))}

          <a href="#" onClick={openAddModal}>
            <GrAdd style={{ color: "gray" }} /> Add a new address
          </a>
        </ListGroup.Item>
      </ListGroup>
      <AddressModal
        show={showModal}
        handleClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        submitAddress={submitAddress}
        action={action}
      />
    </>
  );
};

export default AddressPicker;
