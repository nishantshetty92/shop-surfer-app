import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

const ProductRating = ({ rating, onClick }) => {
  const ratingParts = rating.split(".");
  const wholeNumber = Number(ratingParts[0]);
  const decimalPlace = Number(ratingParts[1]);

  const remainingNumber = 5 - wholeNumber;
  return (
    <span className="rating">
      {[...Array(wholeNumber)].map((_, i) => (
        <BsStarFill fontSize="14px" className="mb-1" key={i} />
      ))}

      {remainingNumber > 0 && (
        <>
          {decimalPlace <= 2 ? (
            <BsStar fontSize="14px" className="mb-1" />
          ) : decimalPlace > 2 && decimalPlace <= 7 ? (
            <BsStarHalf fontSize="14px" className="mb-1" />
          ) : (
            <BsStarFill fontSize="14px" className="mb-1" />
          )}

          {[...Array(remainingNumber - 1)].map((_, i) => (
            <BsStar fontSize="14px" className="mb-1" key={i} />
          ))}
        </>
      )}
    </span>
  );
};

export default ProductRating;
