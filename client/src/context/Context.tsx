import { createContext, useContext, useState, useEffect } from "react";

interface ContextProps {
  accessToken: string;
  refreshToken: string;
  setTokens: (accessToken: string, refreshToken: string) => void;
  username: string;
  setUsername: (username: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  setUser: (username: string, userId: string, department: string) => void;
  clearAuth: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  semesterFilter: string;
  setSemesterFilter: (semester: string) => void;
  majorFilter: string;
  setMajorFilter: (major: string) => void;
  searchFilter: string;
  setSearchFilter: (search: string) => void;
}

const AuthContext = createContext<ContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [majorFilter, setMajorFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Load from storage only once on mount
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken") || "");
    setRefreshToken(localStorage.getItem("refreshToken") || "");
    setUsername(localStorage.getItem("username") || "");
    setUserId(localStorage.getItem("userId") || "");
    setDepartment(localStorage.getItem("department") || "");
    setOpen(localStorage.getItem("open") === "true");
    setDepartmentFilter(localStorage.getItem("departmentFilter") || "");
    setSemesterFilter(localStorage.getItem("semesterFilter") || "");
    setMajorFilter(localStorage.getItem("majorFilter") || "");
    setSearchFilter(localStorage.getItem("searchFilter") || "");
  }, []);

  // Wrapped setter functions to update storage efficiently
  const setTokens = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const setUser = (username: string, userId: string, department: string) => {
    setUsername(username);
    setUserId(userId);
    setDepartment(department);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("department", department);
  };

  const setOpenState = (open: boolean) => {
    setOpen(open);
    localStorage.setItem("open", open.toString());
  };

  const setDepartmentFilterState = (department: string) => {
    setDepartmentFilter(department);
    localStorage.setItem("departmentFilter", department);
  };

  const setSemesterFilterState = (semester: string) => {
    setSemesterFilter(semester);
    localStorage.setItem("semesterFilter", semester);
  };

  const setMajorFilterState = (major: string) => {
    setMajorFilter(major);
    localStorage.setItem("majorFilter", major);
  };

  const setSearchFilterState = (search: string) => {
    setSearchFilter(search);
    localStorage.setItem("searchFilter", search);
  };

  const clearAuth = () => {
    setAccessToken("");
    setRefreshToken("");
    setUsername("");
    setUserId("");
    setDepartment("");
    setOpen(false);
    setDepartmentFilter("");
    setSemesterFilter("");
    setMajorFilter("");
    setSearchFilter("");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("department");
    localStorage.removeItem("open");
    localStorage.removeItem("departmentFilter");
    localStorage.removeItem("semesterFilter");
    localStorage.removeItem("majorFilter");
    localStorage.removeItem("searchFilter");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setTokens,
        username,
        setUsername,
        userId,
        setUserId,
        department,
        setDepartment,
        setUser,
        clearAuth,
        open,
        setOpen: setOpenState,
        departmentFilter,
        setDepartmentFilter: setDepartmentFilterState,
        semesterFilter,
        setSemesterFilter: setSemesterFilterState,
        majorFilter,
        setMajorFilter: setMajorFilterState,
        searchFilter,
        setSearchFilter: setSearchFilterState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
