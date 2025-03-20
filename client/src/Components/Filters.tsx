import { useState } from "react";
import { useAuth } from "../context/Context";
import { btechDepartments, Semester } from "../confid";

function Filters() {
  const {
    departmentFilter,
    setDepartmentFilter,
    semesterFilter,
    setSemesterFilter,
    majorFilter,
    setMajorFilter,
  } = useAuth();

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const closeFilters = () => {
    setShowFilters(false);
  };

  return (
    <div className="w-11/12 mx-auto mt-4">
      {/* Small Screen: Show Button */}
      <div className="sm:hidden flex justify-between">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
          onClick={toggleFilters}
        >
          Filters
        </button>
      </div>

      {/* Filters for larger screens */}
      <div className="hidden sm:flex flex-wrap md:gap-5 sm:gap-2 gap-1">
        <FilterFields
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
          majorFilter={majorFilter}
          setMajorFilter={setMajorFilter}
        />
      </div>

      {/* Mobile Popup Filters */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:hidden"
          onClick={closeFilters} // Close when clicking outside
        >
          <div
            className="bg-white p-5 rounded-lg shadow-lg w-10/12 max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-xl font-semibold mb-3">Select Filters</h2>

            <FilterFields
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              semesterFilter={semesterFilter}
              setSemesterFilter={setSemesterFilter}
              majorFilter={majorFilter}
              setMajorFilter={setMajorFilter}
            />

            {/* Apply Filters Button */}
            <button
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md"
              onClick={closeFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const FilterFields: React.FC<{
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  semesterFilter: string;
  setSemesterFilter: (value: string) => void;
  majorFilter: string;
  setMajorFilter: (value: string) => void;
}> = ({
  departmentFilter,
  setDepartmentFilter,
  semesterFilter,
  setSemesterFilter,
  majorFilter,
  setMajorFilter,
}) => {
  return (
    <div className="flex flex-wrap gap-3 w-full">
      {/* Department Filter */}
      <div>
        <label htmlFor="department" className="font-medium text-gray-700">
          Department
        </label>
        <select
          id="department"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          value={departmentFilter || ""}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="" disabled>
            Select your department
          </option>
          <option value="">All Departments</option>
          {btechDepartments.map((dept) => (
            <option key={dept.key} value={dept.key}>
              {dept.value}
            </option>
          ))}
        </select>
      </div>

      {/* Semester Filter */}
      <div>
        <label htmlFor="semester" className="font-medium text-gray-700">
          Semester
        </label>
        <select
          id="semester"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          value={semesterFilter || ""}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="" disabled>
            Select your semester
          </option>
          <option value="">All Semesters</option>
          {Semester.map((sem) => (
            <option key={sem.key} value={sem.key}>
              {sem.value}
            </option>
          ))}
        </select>
      </div>

      {/* Major/Minor Filter */}
      <div>
        <label htmlFor="major" className="font-medium text-gray-700">
          Major/Minor
        </label>
        <select
          id="major"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          value={majorFilter || ""}
          onChange={(e) => setMajorFilter(e.target.value)}
        >
          <option value="" disabled>
            Select Major/Minor
          </option>
          <option value="">All</option>
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
