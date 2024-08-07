const FilesSidebar = ( { fileTree, onSelect } : {
  fileTree: Node;
  onSelect: (x: string) => void
} ) => {
  return (
    <RenderNode onSelect={onSelect} fileName="/" path="" nodes={fileTree} />
  )
}

export default FilesSidebar;

const RenderNode = ({ fileName, path, onSelect, nodes } : {
  fileName: string;
  path: string;
  onSelect: (x: string) => void;
  nodes: Node | null;
}) => {
  const isDirectory = !!nodes;
  return (
    <>
    <div className="" onClick={(e) => {
      e.stopPropagation();
      if(isDirectory) return;
      onSelect(path)
    }}>
      <p className={isDirectory ? "text-white" : "text-red-400"}>
        {fileName}
      </p>
      {nodes && fileName === 'node_modules' && (
        <ul className="">
          {Object.keys(nodes).map((child) => (
            <li key={child} className="">
              <RenderNode
                fileName={child}
                path={`${path}/${child}`}
                onSelect={onSelect}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  )
}
