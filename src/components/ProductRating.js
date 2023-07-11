import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProductRating = ({ rating, onClick }) => {
  return (
    <span className="rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} onClick={() => onClick(i)}>
          {rating > i ? (
            <AiFillStar fontSize="15px" className="mb-1" />
          ) : (
            <AiOutlineStar fontSize="15px" className="mb-1" />
          )}
        </span>
      ))}
    </span>
  );
};

export default ProductRating;
