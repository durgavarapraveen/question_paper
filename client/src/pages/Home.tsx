import { useEffect, useState } from "react";
import { Papers } from "../confid";
import PaperCard from "../Components/PaperCard";
import Filters from "../Components/Filters";
import { useAuth } from "../context/Context";
import useBackendAPIClient from "../api";
import { useDebounce } from "use-debounce";
import HomeNavBar from "../Components/HomeNavbar";
const backendURl = import.meta.env.VITE_BACKEND_URL;

function Home() {
  const { unauthorizedBackendAPIClient } = useBackendAPIClient();

  const { departmentFilter, semesterFilter, majorFilter, searchFilter } =
    useAuth();

  const [debouncedSearchFilter] = useDebounce(searchFilter, 1000);

  const [papers, setPapers] = useState<Papers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      const queryParams = new URLSearchParams();
      if (departmentFilter) {
        queryParams.append("department", departmentFilter);
      } else {
        console.log("No Department Filter");
      }
      if (semesterFilter) queryParams.append("examSemester", semesterFilter);
      if (majorFilter) queryParams.append("examTerm", majorFilter);
      if (debouncedSearchFilter)
        queryParams.append("search", debouncedSearchFilter);

      try {
        const res = await unauthorizedBackendAPIClient.get(
          `${backendURl}/papers/get-papers?${queryParams}`
        );
        setPapers(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchPapers();
  }, [
    departmentFilter,
    semesterFilter,
    majorFilter,
    unauthorizedBackendAPIClient,
    debouncedSearchFilter,
  ]);

  return (
    <div>
      <HomeNavBar />
      <Filters />
      <div className="p-4">
        <div className="flex flex-wrap justify-start">
          {loading && <div>Loading...</div>}
          {!loading && papers?.length === 0 && <div>No Papers Found</div>}{" "}
          {!loading &&
            papers.map((paper) => <PaperCard paper={paper} key={paper.id} />)}
        </div>
      </div>
    </div>
  );
}

export default Home;
