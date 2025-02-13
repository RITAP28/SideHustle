import axios from "axios";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Textarea } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import { useDispatch } from "react-redux";
import { UserBecomesCreator } from "../../redux/Slices/user.slice";

interface formdata {
  title: string;
  description: string;
  video: File | null;
  thumbnail: File | null;
}

const Upload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<formdata>({
    title: "",
    description: "",
    video: null,
    thumbnail: null,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file: File = e.target.files[0];
      setFormData({
        ...formData,
        video: file,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file: File = e.target.files[0];
      setFormData({
        ...formData,
        thumbnail: file,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post("http://localhost:7070/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(currentUser?.role != "CREATOR"){
        try {
          const becomingCreator = await axios.post(`http://localhost:7070/rolecreator?id=${userId}`, null, {
            withCredentials: true,
          });
          dispatch(UserBecomesCreator());
          console.log(becomingCreator.data);
        } catch (error) {
          console.log("Error while becoming a creator: ", error);
        }
      }
      
      console.log(res.data);
    } catch (error) {
      console.error("Error while uploading: ", error);
    }
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="pt-[5rem] flex flex-row min-h-screen">
      <div className="basis-1/6 bg-black">
        <Sidebar />
      </div>
      <div className="basis-5/6 p-8 bg-black text-white">
        <div className="flex justify-center">
          <div className="border-2 border-white w-[80%]">
            <div className="flex justify-center">
              <p className="text-white pt-6 text-lg font-bold font-Code">
                Upload a video here!
              </p>
            </div>
            <form
              action="/pages/upload"
              method="post"
              className=" py-[4rem]"
              onSubmit={handleFormSubmit}
            >
              <div className="flex flex-row w-full">
                <div className="basis-1/2 flex flex-col py-4">
                  <label
                    htmlFor=""
                    className="w-full font-Code font-bold flex justify-start pl-4"
                  >
                    Title
                    <span className="text-sm font-semibold flex items-center">
                      (required)
                    </span>
                    :
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="border-2 border-black text-black font-Code text-sm font-bold pl-2 py-2 ml-4 w-[80%] focus:border-black"
                    placeholder="Add a Title which describes your video"
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="basis-1/2 flex flex-col py-4">
                  <label
                    htmlFor=""
                    className="w-full font-Code font-bold flex justify-start pl-4"
                  >
                    Upload File:
                  </label>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    id="video"
                    className="mx-2 text-sm font-Code py-2"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full">
                <div className="basis-1/2 w-full flex flex-col py-4">
                  <label
                    htmlFor=""
                    className="w-full font-Code font-bold flex justify-start pl-4"
                  >
                    Description
                    <span className="text-sm font-semibold flex items-center">
                      (required)
                    </span>
                    :
                  </label>
                  {/* <textarea
                    name=""
                    className="w-[80%] border-2 border-black text-black font-Code text-sm font-bold pl-2 py-2 ml-4"
                    placeholder="Tell learners about what you are teaching"
                    rows={6}
                  /> */}
                  <Textarea
                  name="description"
                    placeholder="Tell learners about what you are teaching"
                    size="sm"
                    variant={"filled"}
                    width={"80%"}
                    className="ml-4 font-Code focus:text-white text-black font-semibold"
                    resize={"none"}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="basis-1/2 flex flex-col py-4">
                  <label
                    htmlFor=""
                    className="w-full font-Code font-bold flex justify-start pl-4"
                  >
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    id="thumbnail"
                    className="mx-2 text-sm font-Code py-2"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="flex justify-center pt-[3rem]">
                <button type="submit" className="flex justify-center px-12 font-Code font-bold py-2 bg-white text-black">
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
