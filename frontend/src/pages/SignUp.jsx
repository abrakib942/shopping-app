import { Col, Row, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import CustomForm from "../components/CustomForm";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/FormInput";
import CustomButton from "../components/CustomButton";
import signupImage from "../assets/signup.png";
import { useUserSignUpMutation } from "../redux/api/authApi";
import { signUpSchema } from "../schemas/yupSchemas";

const SignUp = () => {
  const [userSignUp, { isLoading }] = useUserSignUpMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await userSignUp(data);

      console.log("res", response);

      if (response?.data) {
        message.success({
          content: "Account Created successfully!",
          key: "login-loading",
          duration: 2,
        });
        navigate("/login");
      }

      if (response?.error) {
        message.error(response?.error?.data?.message);
      }

      console.log(data);
    } catch (error) {
      //
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
      }}
    >
      <Col sm={12} md={8} lg={8}>
        <h1
          style={{
            margin: "15px 0px",
          }}
        >
          Register an Account
        </h1>
        <div>
          <CustomForm
            submitHandler={onSubmit}
            resolver={yupResolver(signUpSchema)}
          >
            <div>
              <FormInput
                name="name"
                type="text"
                size="large"
                label="Name"
                required
              />
            </div>
            <div>
              <FormInput
                name="email"
                type="email"
                size="large"
                label="Email"
                required
              />
            </div>
            <div
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="password"
                type="password"
                size="large"
                label="Password"
                required
              />
            </div>
            <CustomButton htmlType="submit">Sign UP</CustomButton>
          </CustomForm>
        </div>
        <div>
          <p>
            Already have an Account? Please{" "}
            <Link to="/login" style={{ fontWeight: "bold" }}>
              Login
            </Link>{" "}
          </p>
        </div>
      </Col>
      <Col sm={12} md={16} lg={10}>
        <img src={signupImage} width={400} alt="signUP image" />
      </Col>
    </Row>
  );
};

export default SignUp;
