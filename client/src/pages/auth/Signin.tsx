import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SigninSuccess } from "../../redux/Slices/user.slice";

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
            className="p-4 border-2 border-white max-w-sm mx-auto px-[3rem]"
            onSubmit={handleLogin}
          >
            <div className="font-Code flex justify-center text-2xl font-bold pt-4 w-full">
              NexusCode
            </div>
            <div className="font-Code flex justify-center text-lg font-semibold pt-[1rem] w-full">
              Log in to your account
            </div>
            <div className="font-Code flex justify-center text-sm w-full">
              No account?<span>Register here</span>
            </div>
            <div className="flex flex-col pt-[2rem] pb-2">
              <label htmlFor="" className="font-Code">
                Email:
              </label>
              <input
                type="email"
                className="font-Code text-sm px-2 py-2"
                id="email"
                placeholder="Enter your email"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col pt-2 pb-8">
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
            </div>
            <div className="">
              <button
                type="submit"
                disabled={loading}
                className="font-Code flex justify-center w-full"
              >
                {loading ? "Signing you in..." : "Sign-In"}
              </button>
            </div>
            <div className="pt-4 pb-4">
              <button type="button" className="font-Code flex justify-center w-full">
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
