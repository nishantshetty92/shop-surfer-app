import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { RiShoppingCartLine, RiUserLine, RiStore2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link to="/">
        <Navbar.Brand className="d-flex align-items-center">
          <RiShoppingCartLine className="navbar-icon" />
          <span className="ml-2">ShopSurfer</span>
        </Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto align-items-center">
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search products"
              className="mr-2"
              aria-label="Search"
            />
          </Form>
          <Nav.Link className="d-flex align-items-center">
            <Link to="/products">
              <RiStore2Line className="navbar-icon" />
              <span className="link-text ml-2">Products</span>
            </Link>
          </Nav.Link>

          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              id="profile-dropdown"
              className="d-flex align-items-center"
            >
              <RiUserLine className="mr-1" />
              <span className="link-text">Account</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#profile">Profile</Dropdown.Item>
              <Dropdown.Item href="#orders">Orders</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        <Nav className="align-items-center">
          <Nav.Link href="cart" className="d-flex align-items-center">
            <RiShoppingCartLine />
            <span className="link-text ml-2 mr-1">Cart</span>
            <Badge variant="info">{5}</Badge>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
