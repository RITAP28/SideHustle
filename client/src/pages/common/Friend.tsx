import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { RxAvatar } from "react-icons/rx";
import { useToast } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks/hook";

interface Friend {
  id: number;
  name: string;
  email: string;
}

const Friend = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const toast = useToast();

  const [friend, setFriend] = useState<Friend>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [follow, setFollow] = useState<boolean>(false);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

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

  const handleIsFollowed = useCallback(async () => {
    try {
        const res = await axios.post(`http://localhost:7070/isFollowed?id=${id}`, {
            id: currentUser?.id
        }, {
            withCredentials: true
        });
        if(!res.data.success){
            console.log(res.data.success);
            setIsFollowing(res.data.success);
        }
        console.log(res.data.success);
        setIsFollowing(res.data.success);
    } catch (error) {
        console.error("Error while checking following: ", error);
    }
  }, [currentUser?.id, id]);

  useEffect(() => {
    handleIsFollowed();
  }, [handleIsFollowed]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7070/follow?id=${friend?.id}`,
        {
          id: currentUser?.id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setFollow(true);
      toast({
          title: `You are following ${friend?.name}`,
          description: `Now you can invite ${friend?.name} to your rooms for collaboration`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
    } catch (error) {
      console.error("Error while following: ", error);
      toast({
        title: `Failed to follow ${friend?.name}`,
        description: `Something went wrong when you tried to follow ${friend?.name}. Please try again. If the issue persists, please try again later.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleCountFollow = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:7070/followCount?id=${friend?.id}`, {
        withCredentials: true
      });
      console.log(res.data);
      setFollowers(res.data.followers);
      setFollowing(res.data.following);
    } catch (error) {
      console.error("Error while fetching follow count: ", error);
    }
  }, [friend?.id]);

  useEffect(() => {
    handleCountFollow();
  }, [handleCountFollow]);

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
                  <div className="flex flex-row font-Code">
                    <div className="basis-1/2 flex justify-start">
                      Followers: {followers}
                    </div>
                    <div className="basis-1/2 flex justify-start">
                      Following: {following}
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      className="w-[100%] px-2 py-2 rounded-md border-2 text-white bg-black border-white font-Code hover:bg-white hover:text-black disabled:hover:cursor-pointer"
                      onClick={handleFollow}
                      disabled={isFollowing}
                    >
                      {isFollowing ? "Following" : (
                        follow ? (<span className="font-bold">
                            Following
                          </span>) : "Follow"
                      )}
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
