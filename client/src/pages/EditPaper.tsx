import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Context";
import { btechDepartments, Papers, Semester } from "../confid";
import NavBar from "../Components/NavBar";
import useBackendAPIClient from "../api";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const backendURl = import.meta.env.VITE_BACKEND_URL;

const EditPaper: React.FC = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [paper, setPaper] = useState<Papers | null>(null);
  const [deleteing, setDeleteing] = useState<boolean>(false);

  const { backendAPIClient, unauthorizedBackendAPIClient } =
    useBackendAPIClient();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!file && !paper?.examPdf) {
        alert("Please upload the Exam PDF.");
        return;
      }

      const formData = new FormData();
      formData.append("examName", paper?.examName || "");
      formData.append("examDescription", paper?.examDescription || "");
      formData.append("examTerm", paper?.examTerm || "");
      formData.append("examSemester", paper?.examSemester || "");
      formData.append("examDate", paper?.examDate || "");
      formData.append("examProfessor", paper?.examProfessor || "");
      formData.append("department", paper?.department || "");
      if (file) {
        formData.append("examPdf", file);
      }
      if (solutionFile) {
        formData.append("examSolution", solutionFile);
      }

      setUploadStatus("Uploading...");
      setProgress(0);

      if (!backendAPIClient) {
        throw new Error("Backend API client is undefined");
      }

      await backendAPIClient.put(
        `${backendURl}/papers/edit-paper/${id}`,
        formData,
        {
          headers: {
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

      alert("Upload successful!");
      setFile(null);
      setSolutionFile(null);
      setUploadStatus(null);
      setProgress(0);
      window.location.href = `/paper/${id}`;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const url = accessToken ? backendAPIClient : unauthorizedBackendAPIClient;
      try {
        if (url) {
          const res = await url.post(`${backendURl}/papers/get-paper/${id}`, {
            ...(accessToken && { accessToken }),
          });
          setPaper(res.data.paper);
        } else {
          console.error("URL is undefined");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [id, unauthorizedBackendAPIClient, backendAPIClient, accessToken]);

  const handleDelete = async () => {
    setDeleteing(true);
    try {
      const res = await backendAPIClient?.delete(
        `${backendURl}/papers/delete-paper/${id}`
      );

      if (res?.status === 200) {
        toast.success("Paper deleted successfully");
        window.location.href = "/";
      } else {
        toast.error("Failed to delete paper");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message || "Failed to delete paper");
      } else {
        toast.error("Failed to delete paper");
      }
    }
    setDeleteing(false);
  };

  return (
    <div className="w-full bg-gray-100">
      <NavBar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Info</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <div className="flex flex-col">
              <label>Subject Name *</label>
              <input
                type="text"
                placeholder="Enter Subject Name"
                value={paper?.examName || ""}
                onChange={(e) =>
                  setPaper({ ...paper, examName: e.target.value } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Professor Name *</label>
              <input
                type="text"
                placeholder="Enter Professor Name"
                value={paper?.examProfessor || ""}
                onChange={(e) =>
                  setPaper({
                    ...paper,
                    examProfessor: e.target.value,
                  } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <label>Exam Description *</label>
          <textarea
            placeholder="Enter Exam Description"
            value={paper?.examDescription || ""}
            onChange={(e) =>
              setPaper({ ...paper, examDescription: e.target.value } as Papers)
            }
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-0">
            <div className="flex flex-col">
              <label>Exam Term *</label>
              <select
                value={paper?.examTerm || ""}
                onChange={(e) =>
                  setPaper({ ...paper, examTerm: e.target.value } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Exam Term</option>
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>Exam Semester *</label>
              <select
                value={paper?.examSemester || ""}
                onChange={(e) =>
                  setPaper({
                    ...paper,
                    examSemester: e.target.value,
                  } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              >
                {Semester.map((semester) => (
                  <option key={semester.key} value={semester.key}>
                    {semester.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label>Exam Date *</label>
              <input
                type="date"
                value={paper?.examDate || ""}
                onChange={(e) =>
                  setPaper({ ...paper, examDate: e.target.value } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Department *</label>
              <select
                value={paper?.department || ""}
                onChange={(e) =>
                  setPaper({ ...paper, department: e.target.value } as Papers)
                }
                className="w-full p-2 border rounded"
                required
              >
                {btechDepartments.map((dept) => (
                  <option key={dept.key} value={dept.key}>
                    {dept.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label>Upload Exam PDF (Max 5MB) *</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
              <iframe
                src={file ? URL.createObjectURL(file) : paper?.examPdf}
                title={paper?.examName}
                className="w-full h-48 rounded-lg border border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <label>Upload Exam Solution (Optional, Max 5MB)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSolutionFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
              {paper?.examSolution && (
                <iframe
                  src={
                    solutionFile
                      ? URL.createObjectURL(solutionFile)
                      : paper?.examSolution
                  }
                  title={paper?.examName}
                  className="w-full h-48 rounded-lg border border-gray-300 shadow-sm"
                />
              )}
            </div>
          </div>
          {progress > 0 && (
            <progress value={progress} max="100" className="w-full"></progress>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={progress > 0 || deleteing}
          >
            Upload
          </button>
          {uploadStatus && <p className="text-center mt-3">{uploadStatus}</p>}
        </form>
        <button
          className="w-full p-2 bg-red-500 text-white rounded mt-5"
          onClick={handleDelete}
          disabled={deleteing || progress > 0}
        >
          {deleteing ? "Deleting..." : "Delete Paper"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditPaper;
