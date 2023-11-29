import "./App.css";
import { Button, DatePicker, Space, version } from "antd";

function App() {
  return (
    <>
      <p className="text-red-600">hello react</p>
      <div style={{ padding: "0 24px" }}>
        <h1>antd version: {version}</h1>
        <Space>
          <DatePicker />
          <Button type="primary">Primary Button</Button>
        </Space>
      </div>
    </>
  );
}

export default App;
