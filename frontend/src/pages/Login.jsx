/* eslint-disable react/no-unescaped-entities */

import { Col, Row, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import loginImage from "../assets/Login.png";
import { loginSchema } from "../schemas/yupSchemas";
import CustomForm from "../components/CustomForm";
import FormInput from "../components/FormInput";
import CustomButton from "../components/CustomButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserLoginMutation } from "../redux/api/authApi";
import { storeUserInfo } from "../utils/authService";

const Login = () => {
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await userLogin({ ...data });

      if (res?.data?.token) {
        message.success({
          content: "Login successful!",
          key: "login-loading",
          duration: 2,
        });
        navigate("/items");
      }

      storeUserInfo({ accessToken: res?.data?.token });

      if (res?.error) {
        message.error(res?.error?.data?.message);
      }
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
      <Col sm={12} md={16} lg={10}>
        <img src={loginImage} width={400} alt="login image" />
      </Col>
      <Col sm={12} md={8} lg={8}>
        <h1
          style={{
            margin: "15px 0px",
          }}
        >
          login your Account
        </h1>
        <div>
          <CustomForm
            submitHandler={onSubmit}
            resolver={yupResolver(loginSchema)}
          >
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
            <CustomButton htmlType="submit">Login</CustomButton>
          </CustomForm>
        </div>
        <div>
          <p>
            Don't have any Account? Please{" "}
            <Link to="/signup" style={{ fontWeight: "bold" }}>
              SignUp
            </Link>{" "}
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
