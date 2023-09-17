import FolderItem from "./components/FolderItem/FolderItem";
import { isExpandedByDefault } from "./utils/isExpandedByDefault";
import { useFolderTree } from "./hooks/useFolderTree";
import "./App.css";

function App() {
  const {
    foldersTree,
    includeSubfolders,
    toggleIncludeSubfolders,
    updateFolderTree,
  } = useFolderTree();

  return (
    <div className="App">
      <FolderItem
        name="Including subfolders"
        className="toggle-subfolders"
        onChange={toggleIncludeSubfolders}
        checked={includeSubfolders}
      />

      {foldersTree.map((folderData) => (
        <FolderItem
          key={folderData.id}
          id={folderData.id}
          name={folderData.name}
          children={folderData.children}
          checked={folderData.checked}
          defaultExpanded={isExpandedByDefault(folderData.created)}
          onChange={updateFolderTree}
        />
      ))}
    </div>
  );
}

export default App;
