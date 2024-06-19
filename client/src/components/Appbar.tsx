import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hook";
import { UserNotExist } from "../redux/Slices/user.slice";

const Appbar = () => {
  const { isAuthenticated, currentUser } = useAppSelector(
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
    <div className="flex flex-row bg-black pt-[1rem] pb-2">
      <div className="basis-1/3 flex justify-start">
        {isAuthenticated ? (
          <div className="font-bold text-white ml-[6rem] text-lg underline">
            {currentUser?.name}
          </div>
        ) : (
          <div>
            <div className="font-bold text-white ml-[1rem] text-lg underline">
              You are not authenticated
            </div>
          </div>
        )}
      </div>
      <div className="basis-1/3 flex justify-center">
        <p className="text-white font-bold text-xl flex items-center">
          onlyDevs
        </p>
      </div>
      <div className="basis-1/3 flex justify-end">
        {isAuthenticated ? (
          <div className="mr-[1rem]">
            <button
            type="button"
            className="px-4 py-1 bg-black text-white rounded-md hover:cursor-pointer"
            onClick={handleLogout}
          >
            {loading ? "Logging you out..." : "Logout"}
          </button>
          </div>
        ) : (
          <>
            <div className="">
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
            <div className="mr-4">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Appbar;
