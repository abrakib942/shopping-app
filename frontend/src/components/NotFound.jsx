import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

const NotFound = () => {
  return (
    <div className="text-5xl text-center flex flex-col items-center justify-center">
      <p> Not Found</p>
      <Link to="/">
        <CustomButton>Back to Home</CustomButton>
      </Link>
    </div>
  );
};

export default NotFound;
