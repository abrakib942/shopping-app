/* eslint-disable react/prop-types */
import { Button } from "antd";

const CustomButton = ({ children, onClick, ...rest }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: "rgb(22,119,255)",
        borderColor: "rgb(22,119,255)",
        color: "white",
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
