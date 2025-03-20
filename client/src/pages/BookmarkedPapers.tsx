import { useEffect, useState } from "react";
import useBackendAPIClient from "../api";
import { Papers } from "../confid";
import NavBar from "../Components/NavBar";
import PaperCard from "../Components/PaperCard";

const backendURl = import.meta.env.VITE_BACKEND_URL;

function BookmarkedPapers() {
  const { backendAPIClient } = useBackendAPIClient();

  const [bookmarkedPapers, setBookmarkedPapers] = useState<Papers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await backendAPIClient?.get(
          `${backendURl}/papers/get-bookmarks`
        );
        if (res) {
          setBookmarkedPapers(res.data);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetch();
  }, [backendAPIClient]);

  return (
    <div>
      <NavBar />
      <div className="p-3">
        <div className="flex row justify-between">
          <p className="text-2xl font-bold">Bookmarked Papers</p>
        </div>
        <div className="flex flex-wrap justify-start">
          {loading && <div>Loading...</div>}
          {!loading && bookmarkedPapers.length === 0 && (
            <div>No Papers Found</div>
          )}{" "}
          {!loading &&
            bookmarkedPapers.map((paper) => (
              <PaperCard paper={paper} key={paper.id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarkedPapers;
