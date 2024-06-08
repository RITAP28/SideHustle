import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post("http://localhost:7070/login", formData, {
        withCredentials: true,
      });
      navigate("/upload");
      console.log(res.data);
    } catch (error) {
      console.error("Error while logging in: ", error);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="">
        <div className="">
          <form action="" className="p-4" onSubmit={handleLogin}>
            <div className="">
              <label htmlFor="">Email:</label>
              <input
                type="email"
                className=""
                id="email"
                placeholder="Enter your email"
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label htmlFor="">Password:</label>
              <input
                type="password"
                className=""
                id="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Signing you in..." : "Sign-In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
