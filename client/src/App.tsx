// import { lazy } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/common/Home";
import Register from "./pages/auth/Signup";
import Login from "./pages/auth/Signin";
import Videos from "./pages/upload/Videos";
import Upload from "./pages/upload/Upload";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import Appbar from "./components/Appbar";
import Profile from "./pages/common/Profile";
import Editor from "./pages/common/Editor";
import Landing from "./pages/common/Landing";
import { useAppSelector } from "./redux/hooks/hook";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const hideAppBarRoutes = ["/", "/login", "register"];
  return (
    <>
      {!hideAppBarRoutes.includes(location.pathname) && <Appbar />}
      <Routes>
        {!isAuthenticated && (
          <>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Navigate to='/' />} />
          </>
        )}
        {isAuthenticated && (
          <>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" />} />
          </>
        )}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/videos"
          element={
            <ProtectedRoutes>
              <Videos />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoutes>
              <Upload />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoutes>
              <Editor />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
