import { Button } from "antd";
import NavBar from "../Components/NavBar";
import { Papers } from "../confid";
import { useEffect, useState } from "react";
import PaperCard from "../Components/PaperCard";
import useBackendAPIClient from "../api";

const backendURl = import.meta.env.VITE_BACKEND_URL;

function UploadedPapers() {
  const [allPapers, setAllPapers] = useState<Papers[]>([]);
  const [loading, setLoading] = useState(true);

  const { backendAPIClient } = useBackendAPIClient();

  useEffect(() => {
    const fetchPapers = async () => {
      if (backendAPIClient === undefined) return;
      try {
        const res = await backendAPIClient.get(
          `${backendURl}/papers/get-user-papers`
        );

        setAllPapers(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchPapers();
  }, [backendAPIClient]);

  return (
    <div>
      <NavBar />
      <div className="p-3">
        <div className="flex row justify-between">
          <p className="text-2xl font-bold">Uploaded Papers</p>
          <Button
            type="primary"
            onClick={() => {
              window.location.href = "/upload-papers";
            }}
          >
            Upload Paper
          </Button>
        </div>
        <div className="flex flex-wrap justify-start">
          {loading && <div>Loading...</div>}
          {!loading && allPapers.length === 0 && (
            <div>No Papers Found</div>
          )}{" "}
          {!loading &&
            allPapers.map((paper) => (
              <PaperCard paper={paper} key={paper.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UploadedPapers;
