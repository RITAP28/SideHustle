import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <>
      <div className="w-full flex flex-row bg-black pt-[5rem] min-h-screen">
        <div className="basis-1/6">
          <Sidebar />
        </div>
        <div className="basis-5/6">
          <div className="flex justify-center">
            <div className="text-white border-2 border-white w-[30%] font-Code">
              <div className="flex justify-center pt-4 font-bold underline">
                Profile
              </div>
              {isAuthenticated ? (
                <>
                  <div className="flex justify-center pt-[2rem]">
                    Username:
                    <span className="font-semibold">{currentUser?.name}</span>
                  </div>
                  <div className="flex justify-center">
                    Email:
                    <span className="font-semibold">{currentUser?.email}</span>
                  </div>
                  <div className="flex justify-center">
                    <span className="font-semibold">
                      Followers: 0
                    </span>
                  </div>
                  <div className="flex justify-center pb-[2rem]">
                    <span className="font-semibold">
                      Following: 0
                    </span>
                  </div>
                </>
              ) : (
                <>
                <div className="flex justify-center pt-[2rem] pb-2">what are you waiting for?</div>
                <div className="flex justify-center pt-4 pb-[2rem] font-bold">
                  <button type="button" className="px-8 py-2 bg-white text-black" onClick={() => {
                    navigate("/login")
                  }}>
                    Go fckin log in
                  </button>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
