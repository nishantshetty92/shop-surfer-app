import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Button, Card } from "react-bootstrap";
import NumberFormatter from "./NumberFormatter";
import "./CategoryCarousel.css";

const CategoryCarousel = ({ products }) => {
  return (
    <Carousel
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      infiniteLoop={false}
      centerMode={true}
      centerSlidePercentage={25}
      swipeScrollTolerance={5}
      emulateTouch={true}
      selectedItem={0}
      interval={3000}
      transitionTime={500}
      showIndicators={false}
      width="100%"
      className="category-carousel"
    >
      {products.map((prod) => (
        <div
          key={prod?.id}
          style={{
            paddingRight: "20px",
            paddingTop: "20px",
          }}
          className="category-carousel-item"
        >
          <Card className="border-0">
            <Link to={`/product/${prod.slug}`}>
              <Card.Img
                variant="top"
                src={prod?.image}
                alt={prod.name}
                style={{ marginBottom: "8px" }}
              />
            </Link>
          </Card>

          <p
            className="carousel-item-info"
            style={{ fontWeight: "bold", lineHeight: "30px" }}
          >
            <a href={`/product/${prod?.slug}`} className="title">
              {prod?.name}
            </a>
            <Button className="rating ml-2">
              {prod?.rating} <FaStar className="mb-1" />
            </Button>
            <br />
            <span className="price">
              ₹ <NumberFormatter number={prod?.price} />
            </span>
            <br />
            <span className="seller">{prod?.seller}</span>
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default CategoryCarousel;
