const Comments = () => {
  return (
    <>
      <div className="w-full flex justify-start">
        <p className="text-white font-Code font-bold text-xl">Reviews:</p>
      </div>
      <div className="w-full pt-[1rem]">
        <div className="w-full">
          <textarea
            name=""
            className="w-full bg-black text-white font-Code border-b-2 border-white text-sm resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
            placeholder="What's your review of the above video?"
          />
        </div>
        <div className="">
          <button
            type="button"
            className="px-4 py-2 border-2 border-white hover:bg-white hover:text-black font-Code font-bold text-white"
          >
            Comment
          </button>
        </div>
      </div>
    </>
  );
};

export default Comments;
