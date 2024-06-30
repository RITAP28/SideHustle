
const Landing = () => {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* Kind of a navbar */}
      <div className="h-[5rem] w-full flex flex-row">
        <div className="basis-1/7 w-full flex justify-between items-center">
          <div className="basis-1/2 flex justify-center text-white font-Code">
            NexusCode
          </div>
          <div className="basis-1/2">
            <button type="button" className="font-Code text-white">About</button>
          </div>
        </div>
        <div className="basis-5/7 w-full flex justify-start">
        </div>
        <div className="basis-1/7 w-full flex justify-end mr-[2rem] items-center">
          <p className="font-Code text-white border-2 border-slate-400 py-1 px-3 hover:cursor-pointer">Get Started</p>
        </div>
      </div>

      {/* the main punch line for our company */}
      <div className="w-full h-[18rem]">
        <div className="w-full text-white text-[3rem] font-Dmsans font-semibold h-[10rem] items-end flex justify-center">
          The new standard for teaching and learning
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
            <div className="">
              <input type="text" className="w-full px-2 py-1" placeholder="email address..." />
            </div>
            <div className="pl-2">
              <button type="button" className="bg-white text-black px-2 py-1">
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing