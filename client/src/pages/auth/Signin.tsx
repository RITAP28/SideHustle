import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SigninSuccess } from "../../redux/Slices/user.slice";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      navigate(`/`);
      console.log(res.data);
      dispatch(SigninSuccess(res.data.user));
    } catch (error: unknown) {
      console.error("Error while logging in: ", error);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="w-full h-screen bg-black flex justify-center items-center absolute">
        <div className="text-white">
          <form
            action=""
            className="p-4 border-2 border-white w-[30rem] mx-auto"
            onSubmit={handleLogin}
          >
            <div className="font-Code flex justify-center text-lg font-semibold pt-[1rem] w-full">
              Log in to your account
            </div>
            <div className="font-Code flex justify-center text-sm w-full">
              No account?{" "}
              <a href="/register">
                <span className="underline">Register</span>
              </a>
            </div>
            <div className="flex justify-center pt-[2rem]">
              <div className="flex flex-row w-[80%]">
                <div className="basis-1/2 flex justify-end pr-4">
                  <div className="flex-col flex items-center">
                  <FaGoogle className="text-[2rem] text-white hover:cursor-pointer" />
                  <p className="text-white text-sm">Google</p>
                  </div>
                </div>
                <div className="basis-1/2 flex justify-start pl-4">
                <div className="flex-col flex items-center">
                  <FaGithub className="text-[2rem] text-white hover:cursor-pointer" />
                  <p className="text-white text-sm">Github</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full py-3 flex flex-row items-center">
              <div className="basis-2/5 flex justify-end"><hr className="w-[70%] border-1 border-slate-600" /></div>
              <div className="basis-1/5 flex justify-center">OR</div>
              <div className="basis-2/5 flex justify-start"><hr className="w-[70%] border-1 border-slate-600" /></div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col pt-[2rem] pb-2 w-[80%]">
                <label htmlFor="" className="font-Code">
                  Email:
                </label>
                <input
                  type="email"
                  className="font-Code text-sm px-2 py-2 text-black"
                  id="email"
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col pt-2 pb-8 w-[80%]">
                <label htmlFor="" className="font-Code">
                  Password:
                </label>
                <input
                  type="password"
                  className="font-Code text-sm px-2 py-2 text-black"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                />
                <p className="text-[0.7rem] pt-2 underline hover:cursor-pointer font-Code">
                  Forgot Password?
                </p>
              </div>
            </div>
            <div className="mb-[2rem] flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="font-Code flex justify-center bg-white text-black px-[1.5rem] py-2 font-bold"
              >
                {loading ? "Signing you in..." : "Sign-In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
