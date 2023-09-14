import { useEffect, useState } from "react";
import "./App.css";
import FolderItem from "./components/FolderItem/FolderItem";
import { api } from "./api/api";
import { FolderData } from "./types/Folder";
import { getFoldersData } from "./utils/getFoldersData";
import { buildTree } from "./utils/buildTree";
import { isExpandedByDefault } from "./utils/isExpandedByDefault";

function App() {
  const [foldersTree, setFoldersTree] = useState<Array<FolderData>>([]);
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(false);

  const getFolders = async () => {
    const folderStructure = await api.getFolderStructure();
    const data = getFoldersData(folderStructure);
    const tree = buildTree(data);
    setFoldersTree(tree);
  };

  const toggleIncludeSubfolders = (value: boolean) => {
    setIncludeSubfolders(value);
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div className="App">
      <FolderItem
        name="Including subfolders"
        className="toggle-subfolders"
        onChange={toggleIncludeSubfolders}
      />

      {foldersTree.map((folderData) => (
        <FolderItem
          key={folderData.id}
          id={folderData.id}
          name={folderData.name}
          children={folderData.children}
          checkSubfolders={includeSubfolders}
          defaultExpanded={isExpandedByDefault(folderData.created)}
        />
      ))}
    </div>
  );
}

export default App;
