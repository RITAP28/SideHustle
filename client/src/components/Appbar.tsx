import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks/hook";

const Appbar = () => {
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7070/logout", {
        withCredentials: true,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error while logging out: ", error);
    }
    setLoading(false);
  };
  return (
    <div>
      {isAuthenticated ? (
        <div className="flex flex-row bg-slate-400">
          <div className="m-4"></div>
          <div className="flex justify-end">
            <div className="m-4">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer ml-4"
                onClick={() => {
                  navigate("/upload");
                }}
              >
                Upload a video
              </button>
            </div>
            <div className="m-4">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
                onClick={handleLogout}
              >
                {loading ? "Logging you out..." : "Logout"}
              </button>
            </div>
            <div className="m-4">
              <button type="button" className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer" onClick={() => {
                navigate(`/profile`);
              }}>
                Profile
              </button>
            </div>
            <div>
              Username: {currentUser?.name}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="">You are not authenticated</div>
          <div className="m-4">
            <button
              type="button"
              className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign-In
            </button>
          </div>
          <div className="m-4">
            <button
              type="button"
              className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appbar;
