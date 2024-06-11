import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { checkAuth } from "../../state/atoms/authAtom";
import { emailState, userNameState } from "../../state/atoms/userAtom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [, setIsAuthenticated] = useRecoilState(checkAuth);
  const setUsername = useSetRecoilState(userNameState);
  const setEmail = useSetRecoilState(emailState);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post("http://localhost:7070/register", formData, {
        withCredentials: true,
      });
      navigate(`/`);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      console.log(res.data);
      setUsername(res.data.newUser.name);
      setEmail(res.data.newUser.email);
      localStorage.setItem("username", res.data.newUser.name);
      localStorage.setItem("email", res.data.newUser.email);
    } catch (error) {
      console.error("Error while registering: ", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="">
        <div className="">
          <form action="" className="p-4" onSubmit={handleRegister}>
            <div className="">
              <label htmlFor="">Username:</label>
              <input
                type="text"
                className=""
                id="name"
                placeholder="Enter your username"
                onChange={handleInputChange}
              />
            </div>
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
