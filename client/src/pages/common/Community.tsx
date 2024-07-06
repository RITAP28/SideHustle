import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Friends {
  id: number;
  name: string;
  email: string;
}

const Community = () => {
  const navigate = useNavigate();
  const [suggestedFriends, setSuggestedFriends] = useState<Friends[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("id"));

  const handleGetFriends = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:7070/getallfriends?id=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setSuggestedFriends(res.data.users);
    } catch (error) {
      console.error("Error while searching for friends: ", error);
    }
  }, [userId]);

  useEffect(() => {
    handleGetFriends();
  }, [handleGetFriends]);

  return (
    <div className="pt-[5rem] w-full bg-black min-h-screen flex flex-row">
      <div className="basis-1/6">
        <Sidebar />
      </div>
      <div className="basis-5/6">
        <div className="w-full flex justify-center">
          <p className="text-white font-Code font-bold text-[1.3rem]">
            Create a Community here!
          </p>
        </div>
        <div className="w-full font-Code font-semibold flex justify-center pt-[2rem] items-center">
          <p className="text-white pr-2">Search your coding partners:</p>
          <input
            type="search"
            name=""
            className="w-[18rem] ml-2 px-2 py-2 bg-black border-2 border-white text-white"
            placeholder="enter his/her name"
          />
        </div>
        <div className="text-red-400 font-Code flex justify-center pt-6 underline">
          here are some suggestions:
        </div>
        <div className="w-[100%] flex justify-center mt-[2rem]">
          <div className="grid grid-cols-3 gap-4">
            {suggestedFriends.map((friend, index) => (
              <div
                className="text-white font-Code border-2 border-white p-4"
                key={index}
              >
                <div className="flex justify-center">
                  <p className="">Username: {friend.name}</p>
                </div>
                <div className="flex justify-center">
                  <p className="">Email: {friend.email}</p>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    className="w-[80%] px-4 py-2 bg-black text-white border-2 border-slate-700 rounded-md hover:bg-white hover:text-black font-bold"
                    onClick={() => {
                        navigate(`/friend?name=${friend.name}&id=${friend.id}`);
                    }}
                  >
                    {`Visit ${friend.name}`}
                  </button>
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    className="w-[80%] px-4 py-2 bg-black text-white border-2 border-slate-700 rounded-md hover:bg-white hover:text-black font-bold"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
