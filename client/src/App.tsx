// import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Register from "./pages/auth/Signup";
import Login from "./pages/auth/Signin";


function App() {
  return (
    <>
    <BrowserRouter>    
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
