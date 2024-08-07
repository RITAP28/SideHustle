const FilesSidebar = ({ fileTree }: { fileTree: object }) => {
  console.log(fileTree);
  return (
    <>
    {(Object.keys(fileTree).length === 0) ? (
      <p className="">Loading...</p>
    ) : (
      <RenderNode fileName="/" path="" nodes={fileTree} />
    )}
    </>
  );
};

export default FilesSidebar;

const RenderNode = ({
  fileName,
  path,
  nodes,
}: {
  fileName: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes?: Record<string , any>;
}) => {
  const isDirectory = !!nodes;
  return (
    <>
      <div
        className=""
        onClick={(e) => {
          e.stopPropagation();
          if (isDirectory) return;
        }}
      >
        <p className={isDirectory ? "text-white" : "text-red-400"}>
          {fileName}
        </p>
        {isDirectory && (
          <ul className="">
            {Object.keys(nodes).map(([childName, childNode], index) => (
              <li key={index}>
                <RenderNode
                  fileName={childName}
                  path={`${path}/${childName}`}
                  nodes={nodes[childNode]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
