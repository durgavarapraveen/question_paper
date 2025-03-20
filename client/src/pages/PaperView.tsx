import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Papers, Semester } from "../confid";
import useBackendAPIClient from "../api";
import NavBar from "../Components/NavBar";
import { IoBookmark } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/Context";
import { FaEdit } from "react-icons/fa";

const backendURl = import.meta.env.VITE_BACKEND_URL;

function PaperView() {
  const { id } = useParams();
  const { accessToken, userId } = useAuth();
  console.log(userId);

  const [paper, setPaper] = useState<Papers | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { unauthorizedBackendAPIClient, backendAPIClient } =
    useBackendAPIClient();

  useEffect(() => {
    const fetch = async () => {
      const url = accessToken ? backendAPIClient : unauthorizedBackendAPIClient;

      try {
        if (url) {
          const res = await url.post(`${backendURl}/papers/get-paper/${id}`, {
            ...(accessToken && { accessToken }),
          });
          setPaper(res.data.paper);
          console.log(res.data.paper);
          setIsBookmarked(res.data.is_bookmarked);
        } else {
          console.error("URL is undefined");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [id, unauthorizedBackendAPIClient, backendAPIClient, accessToken]);

  const markBookmark = async () => {
    if (!accessToken) {
      toast.error("Please login to bookmark the paper");
      return;
    }

    try {
      await backendAPIClient?.post(
        `${backendURl}/papers/bookmark-paper/${id}`,
        {
          paper_id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );

      toast.success(
        `Paper ${paper?.examName} ${
          isBookmarked ? "unbookmarked" : "bookmarked"
        } successfully`
      );
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error(error);
    }
  };

  const EditUploadPaper = async () => {
    window.location.href = `/edit-paper/${id}`;
  };

  return (
    <div>
      <NavBar />
      <div className="relative flex !flex-col justify-center ">
        <div className="absolute top-10 right-10 flex row justify-center items-center">
          <IoBookmark
            onClick={markBookmark}
            className={`w-5 h-5 cursor-pointer ${
              isBookmarked ? "text-amber-400" : ""
            } `}
          />
          {userId === String(paper?.createdBy) && (
            <FaEdit
              className="w-6 h-6  cursor-pointer ml-5"
              onClick={EditUploadPaper}
            />
          )}
        </div>
        <div className=" flex flex-col mt-10 p-5 h-full items-start justify-self-start">
          <p className="text-3xl font-semibold text-gray-800 mb-2">
            {paper?.examName}
          </p>
          <p className="text-gray-600 text-sm mb-3">{paper?.examDescription}</p>
          <div className="text-gray-700 text-sm">
            <div className="flex flex-row justify-self-auto">
              <p className="font-normal">
                {
                  Semester.filter(
                    (semester) => semester.key === paper?.examSemester
                  )[0]?.value
                }{" "}
                {paper?.examTerm} paper by -{" "}
                <span className="text-gray-900 font-semibold">
                  {paper?.examProfessor}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto p-5 grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="col-span-1 flex flex-col justify-center">
            <p className="text-gray-500 text-xs m-2">Question Paper</p>
            <iframe
              src={paper?.examPdf}
              title={paper?.examName}
              className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
            />
            <a href={paper?.examPdf} target="_blank" rel="noreferrer">
              <button className="mt-5 bg-blue-500 text-white px-3 py-2 rounded-lg">
                View PDF
              </button>
            </a>
          </div>

          <div className="col-span-1 flex flex-col justify-between">
            {paper?.examSolution && (
              <p className="text-gray-500 text-xs m-2">Solution Available</p>
            )}
            {paper?.examSolution && (
              <iframe
                src={paper?.examSolution}
                title={paper?.examName}
                className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
              />
            )}
            {paper?.examSolution && (
              <a href={paper?.examSolution} target="_blank" rel="noreferrer">
                <button className="mt-5 bg-blue-500 text-white px-3 py-2 rounded-lg ">
                  View Solution
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PaperView;
