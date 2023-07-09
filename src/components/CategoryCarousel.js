import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import "./CategoryCarousel.css";

const CategoryCarousel = ({ items }) => {
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
      {items.map((item) => (
        <div
          key={item?.id}
          style={{
            paddingRight: "20px",
            paddingTop: "20px",
          }}
          className="category-carousel-item"
        >
          <img
            src="https://shopsurfer.s3.amazonaws.com/products/motogpro_zXeee1u.jpg"
            // height="350px"
            style={{ marginBottom: "6px" }}
          />
          <p
            className="carousel-item-info"
            style={{ fontWeight: "bold", lineHeight: "30px" }}
          >
            <span className="title">{item.name}</span>
            <br />
            <span className="price">₹ {item.price}</span>
            <br />
            <span className="seller">{item.seller}</span>
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default CategoryCarousel;
