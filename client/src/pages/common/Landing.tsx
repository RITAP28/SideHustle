import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-black min-h-screen">
      {/* Kind of a navbar */}
      <div className="h-[5rem] w-full flex flex-row">
        <div className="basis-1/7 w-full flex justify-between items-center">
          <div className="basis-1/2 flex justify-center text-white font-Code">
            NexusCode
          </div>
          <div className="basis-1/2">
            <button type="button" className="font-Code text-white">
              About
            </button>
          </div>
        </div>
        <div className="basis-5/7 w-full flex justify-start"></div>
        <div className="basis-1/7 w-full flex justify-end mr-[2rem] items-center">
          <p
            className="font-Code text-white border-2 border-slate-400 py-1 px-3 hover:cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            Get Started
          </p>
        </div>
      </div>

      {/* the main punch line for our company */}
      <div className="w-full h-[18rem]">
        <div className="w-full text-white text-[3.5rem] font-Dmsans font-semibold h-[10rem] items-end flex justify-center">
          The new standard for
          <span className="pl-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            learning
          </span>
        </div>
        <div className="w-full h-[5rem] font-Philosopher font-bold text-white items-start text-[4rem] flex justify-center">
          'How to Code'
        </div>
        <div className="w-full h-[3rem] flex justify-center items-center">
          <p className="font-Code text-slate-500">
            a new approach to make developers more productive
          </p>
        </div>
      </div>

      {/* waitlist email */}
      <div className="w-full">
        <div className="flex justify-center">
          <div className="flex flex-row">
            <div className="w-full flex justify-end">
              <input
                type="text"
                size={25}
                className="pl-2 px-2 py-1.5 text-sm font-Dmserif font-bold"
                placeholder="email address..."
              />
            </div>
            <div className="pl-2 w-full">
              <button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-Dmserif px-2 py-1 rounded-sm"
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* main features */}
      <div className="w-full pt-[3rem] pb-[3rem]">
        <div className="flex justify-center w-full h-[10rem] items-center">
          <p className="text-white font-semibold text-[2.5rem]">
            What are the{" "}
            <span className="font-Code px-2 py-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{`<features>`}</span>{" "}
            you ask?
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-[80%] flex flex-row gap-4">
            <div className="basis-1/3 flex justify-center border-2 border-slate-500 text-white">
              <div className="flex flex-col">
                <div className="w-full flex justify-center py-5 font-Code font-bold text-[1.2rem]">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{`< Code on the way >`}</span>
                </div>
                <div className="flex justify-center">
                  <hr className="w-[70%] border-1 border-slate-500" />
                </div>
                <div className="flex justify-center items-center pb-[3rem] flex-col pt-[2rem]">
                  <p className="w-[80%] font-Philosopher text-lg">
                    With NexusCode, you can learn, write, test, and run your
                    code on the go.
                  </p>
                  <p className="w-[80%] font-Philosopher text-lg pt-2">
                    No need to juggle between different tabs, focus on just one.
                  </p>
                </div>
              </div>
            </div>
            <div className="basis-1/3 flex justify-center border-2 border-slate-500 text-white">
              <div className="flex flex-col">
                <div className="w-full flex justify-center py-5 font-Code font-bold text-[1.2rem]">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{`< Discuss with your people >`}</span>
                </div>
                <div className="flex justify-center">
                  <hr className="w-[70%] border-1 border-slate-500" />
                </div>
                <div className="flex justify-center items-center pb-[3rem] flex-col pt-[2rem]">
                  <p className="w-[80%] font-Philosopher text-lg">
                    We know it is important for you to be surrounded by the
                    right people.
                  </p>
                  <p className="w-[80%] font-Philosopher text-lg pt-2">
                    But many don't have those people, both offline and online.
                  </p>
                  <p className="w-[80%] font-Philosopher text-lg pt-2">
                    NexusCode makes it easy for you to connect with your people,
                    take part in open-room projects and develop with others.
                  </p>
                </div>
              </div>
            </div>
            <div className="basis-1/3 flex justify-center border-2 border-slate-500 text-white">
              <div className="flex flex-col">
                <div className="w-full flex justify-center py-5 font-Code font-bold text-[1.2rem]">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{`< Increase your productivity >`}</span>
                </div>
                <div className="flex justify-center">
                  <hr className="w-[70%] border-1 border-slate-500" />
                </div>
                <div className="flex justify-center items-center pb-[3rem] flex-col pt-[2rem]">
                  <p className="w-[80%] font-Philosopher text-lg">
                    Add Tags to videos, increasing productivity and also the
                    algorithm.
                  </p>
                  <p className="w-[80%] font-Philosopher text-lg pt-2">
                    Make notes on the platform, on the video itself and don't
                    worry it's not like Udemy!
                  </p>
                  <p className="w-[80%] font-Philosopher text-lg pt-2">
                    Ask your favourite creators both in live sessions and on
                    their platform emails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* creators features */}
      {/* <div className="w-full h-[20rem] text-white pt-[5rem]">
        <div className="flex justify-center w-full text-[3rem]">
          <p className="font-Dmserif"><span className="font-bold underline">Creator</span>: What's in here for us?</p>
        </div>
        <div className="w-full flex justify-center py-4">
          <p className="font-bold font-Dmsans text-[3rem] bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {`<At NexusCode, there is everything for everyone>`}
          </p>
        </div>
      </div> */}

      {/* experiences */}
      <div className="w-full pb-[4rem]">
        <div className="w-full pb-[2rem]">
          <p className="flex justify-center font-bold text-white text-[2.5rem]">
            What will you{" "}
            <span
              className={`bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-Code font-bold px-2`}
            >{`<experience>`}</span>{" "}
            here?
          </p>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-[60%] flex flex-row">
            <div className="basis-1/3 w-full flex justify-center items-center">
              <img
                src="sampleOne.jpeg"
                alt=""
                className="object-cover w-[90%] h-[90%]"
              />
            </div>
            <div className="basis-2/3 w-full">
              <div className="w-full pt-2 font-Code text-[1.3rem] font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                # Video-integrated Code Editor
              </div>
              <div className="text-slate-300 font-Dmsans items-center w-full">
                {`<p>`} <br />{" "}
                {` No need to juggle between different windows or tabs to write your code. It may be annoying to resize your windows everytime, we feel that! That is the reason we built this, to ensure that your focus remains on one screen, not multiple.`}{" "}
                <br /> {`</p>`}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-8">
        <hr className={`w-[50%] border-slate-700`} />
        </div>
        <div className="w-full flex justify-center">
          <div className="w-[60%] flex flex-row">
            <div className="basis-2/3 w-full">
                <div className="pt-2 font-Code text-[1.3rem] font-semibold flex justify-end bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent pr-4">
                  # Develop in Open Rooms
                </div>
                <div className="text-slate-300 font-Dmsans items-center">
                  {`<p>`} <br />{" "}
                  {` No need to juggle between different windows or tabs to write your code. It may be annoying to resize your windows everytime, we feel that! That is the reason we built this, to ensure that your focus remains on one screen, not multiple.`}{" "}
                  <br /> {`</p>`}
                </div>
            </div>
            <div className="basis-1/3 w-full flex justify-center items-center">
              <img
                src="sampleOne.jpeg"
                alt=""
                className="object-cover w-[90%] h-[90%]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center font-Code font-bold text-white py-[2rem] text-[1rem]">
        Join the waitlist to be the first to have this new experience...
      </div>
    </div>
  );
};

export default Landing;
