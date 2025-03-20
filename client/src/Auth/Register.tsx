import { Button, Form, FormProps, Input, Select, Typography } from "antd";
import React, { useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Logo from "../assets/Logo.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { btechDepartments } from "../confid";
import useBackendAPIClient from "../api";

interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  department: string;
}

const backendURl = import.meta.env.VITE_BACKEND_URL;

const Register: React.FC = () => {
  const { unauthorizedBackendAPIClient } = useBackendAPIClient();

  const [formData, setFormData] = useState<RegisterFormState>({
    username: "",
    email: "",
    password: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  const onFinish: FormProps<RegisterFormState>["onFinish"] = async () => {
    try {
      setLoading(true);
      const res = await unauthorizedBackendAPIClient.post(
        `${backendURl}/auth/register`,
        formData
      );

      if (res.status === 200) {
        window.location.replace("/login");
        toast.success(res.data.detail);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  const onFinishFailed: FormProps<RegisterFormState>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: 400,
        }}
      >
        <div
          style={{ textAlign: "center", marginBottom: 20 }}
          className="flex row items-center"
        >
          <img
            onClick={() => window.location.replace("/")}
            src={Logo}
            alt="Logo"
            style={{ width: 80, marginBottom: 10 }}
            className="rounded-xl"
          />
          <Typography.Title className="ml-12" level={1}>
            Register
          </Typography.Title>
        </div>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<RegisterFormState>
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={100}
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item<RegisterFormState>
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={100}
              type="email"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item<RegisterFormState>
            name="department"
            label="Department"
            rules={[
              { required: true, message: "Please select your department!" },
            ]}
          >
            <Select
              placeholder="Select your department"
              value={formData.department}
              onChange={handleDepartmentChange}
              prefix={<BookOutlined />}
            >
              {btechDepartments.map((dept) => (
                <Select.Option key={dept.key} value={dept.key}>
                  {dept.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<RegisterFormState>
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              minLength={6}
              maxLength={20}
              name="password"
              value={formData.password}
              onChange={handleChange}
              prefix={<LockOutlined />}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Typography.Text>
              Already have an account?{" "}
              <a href="/login" className="text-blue-500">
                Login
              </a>
            </Typography.Text>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
