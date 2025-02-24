import axios from "axios";
import React, { useState } from "react";
import OTPComponent from "../../components/OTP";
import { AuthServiceUrl } from "../../utils/constants";
import Verified from "../../components/auth/Verified";

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialRegistered, setInitialRegistered] = useState<boolean>(false);
  const [fullyRegistered, setFullyRegistered] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    console.log("register url: ", AuthServiceUrl);
    try {
      const res = await axios.post(
        `${AuthServiceUrl}/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        setInitialRegistered(true);
      }
    } catch (error) {
      console.error("Error while registering: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-black flex flex-row absolute">
        <div className="basis-1/2 pt-[5rem] text-white w-full">
          <div className="w-full font-Dmserif text-[8rem] justify-center pt-[3rem]">
            <div className="w-full flex flex-col justify-center">
              <p className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent pl-[7rem]">
                Namaste,
              </p>
              <p className="w-full text-[4rem] font-Dmserif flex justify-start pl-[7rem]">
                coder.
              </p>
            </div>
          </div>
        </div>
        <div className="basis-1/2 flex justify-center items-center">
          <div className="border-2 border-white w-[22rem] mx-auto text-white">
            <div className="font-Code flex justify-center text-2xl font-bold pt-4 w-full">
              NexusCode
            </div>
            <div className="font-Code flex justify-center text-lg font-semibold pt-[1rem] w-full">
              Create your account
            </div>
            <div className="font-Code flex justify-center text-sm w-full">
              Have an account?
              <a href="/login">
                <span>Login</span>
              </a>
            </div>

            {/* Registration form */}
            {!initialRegistered && (
              <form
                action=""
                className="p-4 px-[3rem]"
                onSubmit={handleRegister}
              >
                <div className="flex flex-col pt-[2rem] pb-2">
                  <label htmlFor="" className="font-Code">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="font-Code text-sm px-2 py-2 text-black"
                    id="name"
                    placeholder="Enter your username"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col pt-2 pb-2">
                  <label htmlFor="" className="font-Code">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="font-Code text-sm px-2 py-2 text-black"
                    id="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col pt-2 pb-8">
                  <label htmlFor="">Password:</label>
                  <input
                    type="password"
                    className="font-Code text-sm px-2 py-2 text-black"
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-Code flex justify-center w-full"
                  >
                    {loading ? "Sending OTP..." : "Register"}
                  </button>
                </div>
              </form>
            )}
            {initialRegistered && !fullyRegistered && (
              <OTPComponent
                email={formData.email}
                fullyRegistered={fullyRegistered}
                setFullyRegistered={setFullyRegistered}
              />
            )}
            {fullyRegistered && <Verified />}
          </div>
        </div>
      </div>
    </>
  );
}
