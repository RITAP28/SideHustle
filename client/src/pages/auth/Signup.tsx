import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SignUpInitial, SignupSuccess } from "../../redux/Slices/user.slice";
import { useAppSelector } from "../../redux/hooks/hook";

let currentOTPIndex: number = 0;

export default function Register() {
  const { currentUser, isAuthenticated, isVerified } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState<number>(60);

  const [loading, setLoading] = useState<boolean>(false);

  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveIndex(currentOTPIndex - 1);
    else setActiveIndex(currentOTPIndex + 1);

    setOTP(newOTP);
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeIndex]);

  const handleVerifyOtp = async () => {
    setVerifyLoading(true);
    // e.preventDefault();
    const otpString = String(otp.join(""));
    console.log(otpString);
    try {
      const res = await axios.post(
        "http://localhost:7070/verify",
        { otp: otpString, email: currentUser?.email },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      dispatch(SignupSuccess(res.data.existingUser));
    } catch (error) {
      console.error("Error while verifying OTP: ", error);
    }
    setVerifyLoading(false);
  };

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
    try {
      const res = await axios.post("http://localhost:7070/register", formData, {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(SignUpInitial(res.data.user));
    } catch (error) {
      console.error("Error while registering: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [seconds]);

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
            {(isAuthenticated !== true && isVerified !== true) && (
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
                    disabled={isAuthenticated}
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
                    disabled={isAuthenticated}
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
                    disabled={isAuthenticated}
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={loading || isAuthenticated}
                    className="font-Code flex justify-center w-full"
                  >
                    {(loading ? "Sending OTP..." : "Register") || (isAuthenticated ? "You are registered" : "Register")}
                  </button>
                </div>
              </form>
            )}
            {isAuthenticated && !isVerified && (
              <form
                action=""
                className="p-4 px-[3rem]"
              >
                <div className="flex flex-col">
                  <div className="font-Code flex justify-center pt-[1rem] text-sm">
                    Enter OTP sent to
                  </div>
                  <div className="font-Code flex justify-center font-bold text-lg">
                    {currentUser?.email}
                  </div>
                  <div className="py-[2rem] flex flex-row gap-2 justify-center">
                    {otp.map((_, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div className="">
                            <input
                              ref={activeIndex === index ? inputRef : null}
                              type="number"
                              className={
                                "w-10 h-10 border-2 bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-slate-300 focus:border-white focus:text-white text-slate-200 transition"
                              }
                              onChange={handleOnChange}
                              onKeyDown={(e) => handleOnKeyDown(e, index)}
                              value={otp[index]}
                            />
                            {index === otp.length - 1 ? null : (
                              <span className={"w-2 py-0.5"} />
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="flex justify-center font-Code py-4">
                    Resend OTP in {seconds}
                  </div>
                  <div className="w-full flex justify-center pb-[2rem]">
                    <button
                      type="button"
                      className="w-full bg-black text-white py-2 font-Code font-bold border-2 border-white hover:bg-white hover:text-black transition ease-linear duration-100 hover:cursor-pointer"
                      disabled={verifyLoading || seconds == 0}
                      onClick={handleVerifyOtp}
                    >
                      {verifyLoading ? "Verifying OTP..." : "Verify"}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isAuthenticated && isVerified && (
              <div className="font-Code">
                <div className="flex justify-center pt-[2rem]">
                  Your email
                </div>
                <div className="flex justify-center font-bold text-xl py-1">
                {currentUser?.email} 
                </div>
                <div className="flex justify-center pb-[2rem]">
                has been verified!
                </div>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
