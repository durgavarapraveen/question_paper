import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadExamForm from "./pages/UploadPaper";
import Home from "./pages/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import UploadedPapers from "./pages/UploadedPapers";
import Profile from "./pages/Profile";
import PaperView from "./pages/PaperView";
import BookmarkedPapers from "./pages/BookmarkedPapers";
import EditPaper from "./pages/EditPaper";
import ResetPassword from "./Auth/ResetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/upload-papers" element={<UploadExamForm />} />
          <Route path="/uploaded-papers" element={<UploadedPapers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/paper/:id" element={<PaperView />} />
          <Route path="/bookmarked-papers" element={<BookmarkedPapers />} />
          <Route path="/edit-paper/:id" element={<EditPaper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
