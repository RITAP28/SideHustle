import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { RxAvatar } from "react-icons/rx";

interface Friend {
  id: number;
  name: string;
  email: string;
}

const Friend = () => {
  const [friend, setFriend] = useState<Friend>();
  const [loading, setLoading] = useState<boolean>(false);
  const [follow, setFollow] = useState<boolean>(false);
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const id = urlParams.get("id");

  const handleGetFriend = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:7070/getfriend?name=${name}&id=${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setFriend(res.data.user);
    } catch (error) {
      console.error(`Error while fetching ${name} with id ${id}: `, error);
    }
    setLoading(false);
  }, [name, id]);

  useEffect(() => {
    handleGetFriend();
  }, [handleGetFriend]);

  return (
    <div className="pt-[5rem] w-full bg-black min-h-screen flex flex-row">
      <div className="basis-1/6">
        <Sidebar />
      </div>
      <div className="basis-5/6">
        {loading ? (
          "Loading..."
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-[50%] border-2 border-white pr-2">
              <div className="flex flex-row py-2">
                <div className="basis-1/3 flex justify-center items-center">
                  <RxAvatar className="text-[6rem] text-white" />
                </div>
                <div className="basis-2/3 w-full text-white">
                  <div className="text-4xl font-Code font-bold">
                    {friend?.name}
                  </div>
                  <div className="font-Code pt-2">{friend?.email}</div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      className="w-[100%] px-2 py-2 rounded-md border-2 text-white bg-black border-white font-Code hover:bg-white hover:text-black"
                      onClick={() => {
                        setFollow(true);
                      }}
                    >
                      {follow ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend;
