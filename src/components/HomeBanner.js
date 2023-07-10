import { Container, Carousel, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomeBanner = () => {
  return (
    <Container fluid className="pt-3 mb-2">
      <Carousel
        indicators={false}
        nextIcon={
          <span
            aria-hidden="true"
            className="carousel-control-next-icon"
            style={{ backgroundColor: "black" }}
          />
        }
        nextLabel=""
        prevIcon={
          <span
            aria-hidden="true"
            className="carousel-control-prev-icon"
            style={{ backgroundColor: "black" }}
          />
        }
        prevLabel=""
        className="banner-carousel"
      >
        <Carousel.Item>
          <Card className="text-center home-banner">
            <Card.Body>
              <Card.Title>Welcome to ShopSurfer</Card.Title>
              <Card.Text>
                Discover amazing products and shop with ease.
              </Card.Text>
              <Button variant="primary" as={Link} to="/category/mobiles">
                Shop Now
              </Button>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card className="text-center home-banner">
            <Card.Body>
              <Card.Title>Get Amazing Deals</Card.Title>
              <Card.Text>Discover our exclusive Mobile collection</Card.Text>
              <Button variant="primary" as={Link} to="/category/mobiles">
                Shop Now
              </Button>
            </Card.Body>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card className="text-center home-banner">
            <Card.Body>
              <Card.Title>Unleashing The Monster</Card.Title>
              <Card.Text>Checkout the latest IPhone 13 Pro</Card.Text>
              <Button variant="primary" as={Link} to="/product/iphone-13-pro">
                Buy Now
              </Button>
            </Card.Body>
          </Card>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default HomeBanner;
