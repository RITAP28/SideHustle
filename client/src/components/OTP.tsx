import axios from "axios";
import { useAppSelector } from "../redux/hooks/hook";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { SignupSuccess } from "../redux/Slices/user.slice";
import { AuthServiceUrl } from "../utils/constants";
import { IUserProps } from "../utils/interface";

let currentOTPIndex: number = 0;

const OTPComponent = ({
  email,
  fullyRegistered,
  setFullyRegistered,
}: {
  email: string;
  fullyRegistered: boolean;
  setFullyRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const [otp, setOTP] = useState(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [seconds, setSeconds] = useState<number>(60);

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
    setVerificationError(null);
    const otpString = String(otp.join(""));
    try {
      const res = await axios.post(
        `${AuthServiceUrl}/verify`,
        { otp: otpString, email: email },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const registeredUser = res.data.newVerifiedUser as IUserProps;
        console.log("User registered successfully: ", registeredUser);
        setFullyRegistered(true);
        dispatch(
          SignupSuccess({
            user: {
              id: registeredUser.id,
              name: registeredUser.name,
              email: registeredUser.email,
              role: registeredUser.role,
            },
          })
        );
      }
    } catch (error) {
      console.error("Error while verifying OTP: ", error);
      setVerificationError("Error while verifying OTP");
    } finally {
      setVerifyLoading(false);
    }
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
      <form action="" className="p-4 px-[3rem]">
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
          {verificationError && (
            <div className="text-red-500 font-semibold">
              {verificationError}
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default OTPComponent;
