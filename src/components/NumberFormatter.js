const NumberFormatter = ({ number }) => {
  const formattedNumber = Number(Number(number).toFixed(2)).toLocaleString();

  return <>{formattedNumber}</>;
};

export default NumberFormatter;
