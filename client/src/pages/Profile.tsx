import React, { useEffect, useState } from "react";
import { Card, Avatar, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/Context";
import axios from "axios";
import Logo from "../assets/Logo.png";
import useBackendAPIClient from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  department: string;
}

const backendURl = import.meta.env.VITE_BACKEND_URL;

const Profile: React.FC = () => {
  const { accessToken } = useAuth();
  const { unauthorizedBackendAPIClient, backendAPIClient } =
    useBackendAPIClient();
  const [user, setUser] = useState<RegisterFormState>({
    username: "",
    email: "",
    password: "",
    department: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (backendAPIClient) {
          const res = await backendAPIClient.get(`${backendURl}/auth/profile`);

          setUser(res.data);
        } else {
          console.error("backendAPIClient is undefined");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [backendAPIClient]);

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${backendURl}/auth/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      window.location.replace("/");
    } catch (error) {
      console.error(error);
    }
    setDeleting(false);
  };

  const handleUpdatePassword = async () => {
    setOpenModel(true);
  };

  const sendEmail = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className=" relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <img
        src={Logo}
        alt="logo"
        className="w-20 h-20 absolute top-5 left-5 rounded-lg"
        onClick={() => {
          window.location.href = "/";
        }}
      />
      <Card
        className="w-full max-w-lg shadow-lg rounded-lg dark:bg-gray-800"
        hoverable
      >
        <div className="flex flex-col items-center space-y-4">
          <Avatar size={100} icon={<UserOutlined />} className="bg-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {user.username}
          </h2>
          <div className="w-full space-y-3">
            <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <MailOutlined className="text-lg text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <ApartmentOutlined className="text-lg text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.department}
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <LockOutlined className="text-lg text-red-500" />
              <span className="text-gray-700 dark:text-gray-300">********</span>
            </div>

            <div className="flex items-center space-x-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <span className="text-gray-700 dark:text-gray-300">
                Joined on
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date().toDateString()}
              </span>
            </div>

            <button
              className="w-full bg-white border-2 border-blue-500 p-3 rounded-md cursor-pointer"
              onClick={handleUpdatePassword}
            >
              Forgot Password
            </button>

            <button
              className="w-full bg-blue-500 text-white p-3 rounded-md cursor-pointer"
              onClick={deleteAccount}
              disabled={deleting}
            >
              {deleting && (
                <FaSpinner
                  className={`animate-spin ${
                    deleting ? "block" : "hidden"
                  } text-white`}
                />
              )}
              {deleting ? "Deleting Account..." : "Delete Account"}
            </button>
          </div>
        </div>
      </Card>
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
            className="bg-blue-500 text-white p-3 rounded-md cursor-pointer"
            onClick={sendEmail}
          >
            {loading && (
              <FaSpinner
                className={`animate-spin ${
                  loading ? "block" : "hidden"
                } text-white`}
              />
            )}
            {loading ? "Sending Email..." : "Send Email"}
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Profile;
