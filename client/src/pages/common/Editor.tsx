import Editortopbar from "../../components/Editor.topbar"
import AllFiles from "../../components/EditorComponents/AllFiles"
import CodeEditor from "../../components/EditorComponents/CodeEditor"

const Editor = () => {
  return (
    <>
    <div className="w-full min-h-screen">
    <div className="bg-black">
      <Editortopbar />
    </div>
    <div className="flex flex-row bg-black">
        <div className="basis-1/6">
          <AllFiles />
        </div>
        <div className="basis-5/6">
          <CodeEditor />
        </div>
    </div>
    </div>
    </>
  )
}

export default Editor