// import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Register from "./pages/auth/Signup";
import Login from "./pages/auth/Signin";
import Videos from "./pages/upload/Videos";
import Upload from "./pages/upload/Upload";


function App() {
  return (
    <>
    <BrowserRouter>    
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
