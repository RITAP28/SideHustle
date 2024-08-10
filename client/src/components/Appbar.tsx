import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hook";
import { UserNotExist } from "../redux/Slices/user.slice";

const Appbar = () => {
  const { isAuthenticated } = useAppSelector(
    (state) => state.user
  );
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7070/logout", {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(UserNotExist());
    } catch (error) {
      console.error("Error while logging out: ", error);
    }
    setLoading(false);
  };
  return (
    <div className="absolute z-20 w-full flex flex-row bg-black pt-[1rem] pb-2 h-[5rem] font-Code">
      <div className="basis-1/3 flex justify-start pl-8">
        <p className="text-white font-bold text-xl flex items-center hover:cursor-pointer" onClick={() => {
          navigate('/');
        }}>
          NexusCode
        </p>
      </div>
      {/* <div className="basis-1/3 flex justify-center"></div> */}
      <div className="basis-2/3 flex justify-end">
        <div className="flex flex-row w-[45rem]">
          <div className="basis-1/4 flex justify-center">
            <button
              type="button"
              className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
            >
              Create a course
            </button>
          </div>
          <div className="basis-1/4 flex justify-center">
            <button
              type="button"
              className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
            >
              Features
            </button>
          </div>
          <div className="basis-1/4 flex justify-center">
            <button
              type="button"
              className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
            >
              Pricing
            </button>
          </div>
          {isAuthenticated ? (
            <div className="basis-1/4 flex justify-center">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
                onClick={handleLogout}
              >
                {loading ? "Logging you out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="basis-1/4 flex justify-center">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appbar;
