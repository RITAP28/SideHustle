import AllFiles from "../../components/EditorComponents/AllFiles"
import CodeEditor from "../../components/EditorComponents/CodeEditor"

const Editor = () => {
  return (
    <div className="w-full min-h-screen flex flex-row bg-black pt-[5rem]">
        <div className="basis-1/6">
          <AllFiles />
        </div>
        <div className="basis-5/6">
          <CodeEditor />
        </div>
    </div>
  )
}

export default Editor