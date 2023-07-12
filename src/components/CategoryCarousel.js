import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import NumberFormatter from "./NumberFormatter";
import "./CategoryCarousel.css";

const CategoryCarousel = ({ products }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [isFirstItem, setIsFirstItem] = useState(true);
  const [isLastItem, setIsLastItem] = useState(false);

  const CustomPrevArrow = (props) => (
    <GrFormPrevious
      {...props}
      className={`slick-nav slick-arrow slick-prev ${
        isHovered ? "" : "arrows-hidden"
      }`}
      style={{ opacity: isFirstItem ? 0.5 : 1 }}
      onClick={() => {
        if (!isFirstItem) {
          props.onClick();
        }
      }}
    ></GrFormPrevious>
  );

  const CustomNextArrow = (props) => (
    <GrFormNext
      {...props}
      className={`slick-nav slick-arrow slick-next ${
        isHovered ? "" : "arrows-hidden"
      }`}
      style={{ opacity: isLastItem ? 0.5 : 1 }}
      onClick={() => {
        if (!isLastItem) {
          props.onClick();
        }
      }}
    ></GrFormNext>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992, // Adjust the breakpoint as per your needs
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Adjust the breakpoint as per your needs
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    beforeChange: (currentSlide, nextSlide) => {
      //   console.log(nextSlide);
      //   console.log(currentSlide);
      //   console.log(slidesToShow);
      setIsFirstItem(nextSlide === 0);
      setIsLastItem(nextSlide === products.length - slidesToShow);
    },
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 992) {
      setSlidesToShow(4);
    } else if (windowWidth >= 768) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(1);
    }
    // adjustArrowFlags();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Container fluid className="pl-3 pr-0 pt-3">
      <div
        className="carousel-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Slider {...settings}>
          {products.map((prod) => (
            <div className="category-carousel-item" key={prod.id}>
              <Card className="border-0 mr-3">
                <div className="carousel-image-container">
                  <div className="carousel-image-wrapper">
                    <Link to={`/product/${prod.slug}`}>
                      <Card.Img
                        variant="top"
                        src={prod?.image}
                        alt={prod.name}
                        style={{ marginBottom: "8px" }}
                      />
                    </Link>
                  </div>
                </div>

                <Card.Body>
                  <Card.Title className="text-center mb-3">
                    <Col
                      className="prod-title pl-0"
                      as={Link}
                      to={`/product/${prod?.slug}`}
                    >
                      {prod.name}
                    </Col>
                  </Card.Title>
                  <Card.Subtitle className="text-center">
                    <Col className="pl-0 mb-2">
                      <span className="price">
                        ₹ <NumberFormatter number={prod?.price} />
                      </span>
                      <Button className="rating ml-2">
                        {prod.rating} <FaStar className="mb-1" />
                      </Button>
                    </Col>
                    <Col className="pl-0 mb-0 seller">{prod.seller}</Col>
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </Container>
  );
};

export default CategoryCarousel;
