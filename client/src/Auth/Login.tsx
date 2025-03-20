import { Button, Form, FormProps, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../assets/Logo.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/Context";
import useBackendAPIClient from "../api";
import { FaSpinner } from "react-icons/fa";

interface LoginFormState {
  email: string;
  password: string;
}

const backendURl = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC = () => {
  const { setUser, setTokens } = useAuth();

  const { unauthorizedBackendAPIClient } = useBackendAPIClient();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFinish: FormProps<LoginFormState>["onFinish"] = async () => {
    setLoading(true);
    try {
      const res = await unauthorizedBackendAPIClient.post(
        `${backendURl}/auth/login`,
        formData
      );

      if (res.status === 200) {
        setTokens(res.data.access_token, res.data.refresh_token);
        setUser(res.data.username, res.data.user_id, res.data.department);

        window.location.replace("/");
      } else {
        alert(res.data.datails);
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

  const onFinishFailed: FormProps<LoginFormState>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const sendEmail = async () => {
    setSending(true);
    console.log(email);
    try {
      const res = await unauthorizedBackendAPIClient?.post(
        `${backendURl}/auth/send-email`,
        {
          email,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res) {
        toast.success("Email sent successfully");
        setOpenModel(false);
      }
    } catch (error) {
      console.error(error);
    }
    setSending(false);
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
            Login
          </Typography.Title>
        </div>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item<LoginFormState>
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
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item<LoginFormState>
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
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
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form.Item>

          <div>
            <Typography.Text>
              Forgot your password?{" "}
              <button
                onClick={() => setOpenModel(true)}
                className="text-blue-500"
              >
                Reset
              </button>
            </Typography.Text>
          </div>

          <Form.Item>
            <Typography.Text>
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500">
                Register
              </a>
            </Typography.Text>
          </Form.Item>
        </Form>
        <ToastContainer />
      </div>
      <Modal
        open={openModel}
        title="Send Password Reset Email"
        className="w-full max-w-md"
        onCancel={() => setOpenModel(false)}
        footer={null}
      >
        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md border-2 border-gray-200 dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white p-3 rounded-md cursor-pointer flex row items-center justify-center"
            onClick={sendEmail}
          >
            {sending && (
              <FaSpinner
                className={`animate-spin ${
                  sending ? "block" : "hidden"
                } text-white`}
              />
            )}
            {sending ? "Sending Email..." : "Send Email"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
