/* eslint-disable react/prop-types */
import { Button } from "antd";

const CustomButton = ({ children, onClick, ...rest }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: "#FBD232",
        borderColor: "#FBD232",
        color: "black",
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
