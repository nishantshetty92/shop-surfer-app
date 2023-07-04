import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Dropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { RiShoppingCartLine, RiUserLine, RiStore2Line } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import { googleLogout } from "@react-oauth/google";

const Header = () => {
  const { cart, user, filterDispatch, loginType, setLoginType } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const logOut = useLogout();

  const signOut = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    await logOut();
    loginType === "google" && googleLogout();
    setLoginType(null);
    navigate("/login", { state: { location }, replace: true });
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand className="d-flex align-items-center" as={Link} to="/">
        <RiShoppingCartLine />
        <span className="ml-1">ShopSurfer</span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto align-items-center">
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search products"
              className="mr-2"
              aria-label="Search"
              onChange={(e) => {
                filterDispatch({
                  type: "FILTER_BY_SEARCH",
                  payload: e.target.value,
                });
              }}
            />
          </Form>
          <Nav.Link
            className="d-flex align-items-center"
            as={Link}
            to="/products"
          >
            <RiStore2Line />
            <span className="link-text ml-1">Products</span>
          </Nav.Link>
        </Nav>

        <Nav className="align-items-center">
          {user?.email ? (
            <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                id="profile-dropdown"
                className="d-flex align-items-center"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="Profile Picture"
                    roundedCircle
                    className="mr-1"
                    style={{ width: "24px", height: "24px" }}
                  />
                ) : (
                  <RiUserLine className="mr-1" />
                )}

                <span className="link-text">{user?.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#orders">Orders</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link
              className="d-flex align-items-center"
              as={Link}
              to="/login"
            >
              <RiUserLine />
              <span className="link-text ml-1">Sign In</span>
            </Nav.Link>
          )}
          <Nav.Link className="d-flex align-items-center" as={Link} to="/cart">
            <RiShoppingCartLine />
            <span className="link-text ml-1 mr-1">Cart</span>
            <Badge variant="info">{cart.length}</Badge>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
