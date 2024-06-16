import axios from "axios";
import { useState } from "react";

interface formdata {
    title: string;
    video: File | null;
    thumbnail: File | null;
}

const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<formdata>({
        title: "",
        video: null,
        thumbnail: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null){
            const file: File = e.target.files[0];
            setFormData({
                ...formData,
                video: file
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null){
            const file: File = e.target.files[0];
            setFormData({
                ...formData,
                thumbnail: file
            })
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            title: e.target.value
        })
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        console.log(formData);
        try {
            const res = await axios.post("http://localhost:7070/upload", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(res.data);
        } catch (error) {
            console.error("Error while uploading: ", error);
        }
        setLoading(false);
    };

  return (
    <div>
        <div className="m-8">
            <form action="/pages/upload" method="post" onSubmit={handleFormSubmit}>
                <div className="">
                    <label htmlFor="">
                        Title
                    </label>
                    <input type="text" className="border-2 border-black pl-2 py-2 ml-4" onChange={handleTitleChange} />
                </div>
                <div className="my-4">
                <label htmlFor="">
                    Upload File:
                </label>
                <input type="file" name="video" accept="video/*" id="video" className="mx-2" onChange={handleFileChange} />
                </div>
                <div className="my-4">
                    <label htmlFor="">
                        Thumbnail
                    </label>
                    <input type="file" name="thumbnail" accept="image/*" id="thumbnail" className="mx-2" onChange={handleImageChange} />
                </div>
                <button type="submit">
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default Upload