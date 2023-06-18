import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light overflow-hidden">
      <Container fluid className="py-3">
        <Row className="justify-content-center">
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>About</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse condimentum magna eget lacinia commodo.
            </p>
          </Col>
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>Contact</h5>
            <p>Email: info@example.com</p>
            <p>Phone: 123-456-7890</p>
          </Col>
          <Col className="text-center p-3">
            {/* Add padding class p-3 */}
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
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
