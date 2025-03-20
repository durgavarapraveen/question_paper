import React, { useState } from "react";
import { UploadFile } from "antd/es/upload/interface";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  DatePicker,
  Progress,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../context/Context";
import { btechDepartments, Semester } from "../confid";
import NavBar from "../Components/NavBar";
import useBackendAPIClient from "../api";

const { Option } = Select;
const backendURl = import.meta.env.VITE_BACKEND_URL;

const UploadExamForm: React.FC = () => {
  const { accessToken } = useAuth();
  const [form] = Form.useForm(); // Use Ant Design Form instance
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [solutionFileList, setSolutionFileList] = useState<UploadFile[]>([]);

  const { backendAPIClient } = useBackendAPIClient();

  const onSubmit = async (values: any) => {
    try {
      if (!fileList.length) {
        message.error("Please upload the Exam PDF.");
        return;
      }

      const formData = new FormData();
      formData.append("examName", values.examName);
      formData.append("examDescription", values.examDescription);
      formData.append("examTerm", values.examTerm);
      formData.append("examSemester", values.examSemester);
      formData.append("examDate", values.examDate.format("YYYY-MM-DD"));
      formData.append("examProfessor", values.examProfessor);
      formData.append("department", values.department);
      if (fileList[0]?.originFileObj) {
        formData.append("examPdf", fileList[0].originFileObj);
      } else {
        throw new Error("Exam PDF file is missing.");
      }
      if (solutionFileList.length) {
        if (solutionFileList[0]?.originFileObj) {
          formData.append("examSolution", solutionFileList[0].originFileObj);
        }
      }

      setUploadStatus("Uploading...");
      setProgress(0);

      if (!backendAPIClient) {
        throw new Error("Backend API client is undefined");
      }

      const res = await backendAPIClient.post(
        `${backendURl}/papers/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded / (progressEvent.total || 1)) * 100
            );
            setProgress(percent);
          },
        }
      );

      console.log("Upload response:", res.data);

      message.success("Upload successful!");
      form.resetFields(); // Reset form fields after successful upload
      setFileList([]);
      setSolutionFileList([]);
      setUploadStatus(null);
      setProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload failed. Please try again.");
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <NavBar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Upload Exam Paper
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          className="space-y-4"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <Form.Item
              name="examName"
              label="Subject Name"
              rules={[
                { required: true, message: "Please input Subject Name!" },
              ]}
            >
              <Input placeholder="Enter Subject Name" />
            </Form.Item>
            <Form.Item
              name="examProfessor"
              label="Professor Name"
              rules={[
                { required: true, message: "Please input Professor Name!" },
              ]}
            >
              <Input placeholder="Enter Professor Name" />
            </Form.Item>
          </div>

          <Form.Item
            name="examDescription"
            label="Exam Description"
            rules={[
              { required: true, message: "Please input Exam Description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter Exam Description" />
          </Form.Item>

          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <Form.Item
              name="examTerm"
              label="Exam Term"
              rules={[{ required: true, message: "Please select Exam Term!" }]}
            >
              <Select placeholder="Select Exam Term">
                <Option value="Minor">Minor</Option>
                <Option value="Major">Major</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="examSemester"
              label="Exam Semester"
              rules={[
                { required: true, message: "Please select Exam Semester!" },
              ]}
            >
              <Select placeholder="Select Exam Semester">
                {Semester.map((semester) => (
                  <Option key={semester.key} value={semester.key}>
                    {semester.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <Form.Item
              name="examDate"
              label="Exam Date"
              rules={[{ required: true, message: "Please select Exam Date!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select Department!" }]}
            >
              <Select placeholder="Select Department">
                {btechDepartments.map((dept) => (
                  <Option key={dept.key} value={dept.key}>
                    {dept.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <Form.Item
              label="Upload Exam PDF (Max 5MB)"
              required
              rules={[{ required: true, message: "Please upload Exam PDF!" }]}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept="application/pdf"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Exam PDF</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Upload Exam Solution (Optional, Max 5MB)">
              <Upload
                beforeUpload={() => false}
                fileList={solutionFileList}
                onChange={({ fileList }) => setSolutionFileList(fileList)}
                accept="application/pdf"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Solution PDF</Button>
              </Upload>
            </Form.Item>
          </div>

          {progress > 0 && <Progress percent={progress} />}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={progress > 0}
            >
              Upload
            </Button>
          </Form.Item>
          {uploadStatus && <p className="text-center mt-3">{uploadStatus}</p>}
        </Form>
      </div>
    </div>
  );
};

export default UploadExamForm;
