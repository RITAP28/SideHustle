import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";

const Verified = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="font-Code">
      <div className="flex justify-center pt-[2rem]">Your email</div>
      <div className="flex justify-center font-bold text-xl py-1">
        {currentUser?.email}
      </div>
      <div className="flex justify-center pb-[2rem]">has been verified!</div>
      <div className="pb-[2rem] w-full flex justify-center">
        <button
          type="button"
          className="w-[80%] py-2 border-2 border-white hover:cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Verified;
