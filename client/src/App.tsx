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
import Rooms from "./pages/common/Rooms";
import Community from "./pages/common/Community";
import Friend from "./pages/common/Friend";
import IndividualRoom from "./pages/common/IndividualRoom";
import Files from "./pages/common/Files";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const hideAppBarRoutes = ["/", "/login", "register", "/editor"];
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
        <Route path="/files" element={
          <ProtectedRoutes>
            <Files />
          </ProtectedRoutes>
        } />
        <Route
          path="/rooms"
          element={
            <ProtectedRoutes>
              <Rooms />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoutes>
              <IndividualRoom />
            </ProtectedRoutes>
          } />
        <Route
          path="/community"
          element={
            <ProtectedRoutes>
              <Community />
            </ProtectedRoutes>
          }
        />
        <Route path="/friend" element={
          <ProtectedRoutes>
            <Friend />
          </ProtectedRoutes>
        } />
      </Routes>
    </>
  );
}

export default App;
