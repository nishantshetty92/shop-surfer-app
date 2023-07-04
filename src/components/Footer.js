import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light overflow-hidden">
      <Container fluid className="py-3">
        <Row className="justify-content-center">
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>About</h5>
            <p>
              Welcome to ShopSurfer! Shop with confidence and enjoy a seamless
              experience from start to finish. Happy shopping with us!
            </p>
          </Col>
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>Contact</h5>
            <p>Email: info@shopsurfer.com</p>
            <p>Phone: +919833166313</p>
          </Col>
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>Follow Us</h5>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href="#">
                  <FaTwitter size={20} style={{ color: "white" }} />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#">
                  <FaInstagram size={20} style={{ color: "white" }} />
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#">
                  <FaLinkedin size={20} style={{ color: "white" }} />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center pb-3 bg-dark">
        &copy; {new Date().getFullYear()} ShopSurfer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
