import { UserOutlined, TableOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { removeUserInfo } from "./utils/authService";
const { Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    removeUserInfo("accessToken");

    navigate("/login");
  };

  const sideBarItems = [
    {
      label: <Link to="/items">Items</Link>,
      icon: <TableOutlined />,
      key: "/items",
    },
    {
      label: <Link to="/users">Users</Link>,
      icon: <UserOutlined />,
      key: "/users",
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "logOut",
      onClick: logOut,
    },
  ];

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
    <Layout>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <Layout className="mt-5" style={{ padding: "0 24px 24px" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "sticky",
              left: 0,
              top: 0,
              bottom: 0,
            }}
            width={250}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["/"]}
              defaultOpenKeys={["/"]}
              theme="dark"
              style={{
                height: "100%",
              }}
              items={sideBarItems}
            />
          </Sider>
          <Content
            style={{
              padding: 24,
              minHeight: 400,
              overflow: "initial",
              background: "white",
            }}
          >
            <div className="text-lg ">Arraytics shopping app</div>
            <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Arraytics ©2023 Created by AB
      </Footer>
    </Layout>
  );
};
export default App;
