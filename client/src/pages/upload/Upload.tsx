import axios from "axios";
import { useState } from "react";

interface formdata {
    title: string;
    file: File | null;
}

const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<formdata>({
        title: "",
        file: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null){
            const file: File = e.target.files[0];
            setFormData({
                ...formData,
                file: file
            });
        }
    };

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
            const res = await axios.post("http://localhost:7070/pages/upload", formData, {
                withCredentials: true
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
            <form action="" onSubmit={handleFormSubmit}>
                <div className="">
                    <label htmlFor="">
                        Title
                    </label>
                    <input type="text" className="border-2 border-black pl-2 py-2" onChange={handleTitleChange} />
                </div>
                <div className="">
                <label htmlFor="">
                    Upload File:
                </label>
                <input type="file" accept="video/*" className="mx-2" onChange={handleFileChange} />
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