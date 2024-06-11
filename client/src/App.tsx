// import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Register from "./pages/auth/Signup";
import Login from "./pages/auth/Signin";
import Videos from "./pages/upload/Videos";
import Upload from "./pages/upload/Upload";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import Appbar from "./components/Appbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Appbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
