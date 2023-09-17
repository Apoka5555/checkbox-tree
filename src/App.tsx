import { useCallback, useEffect, useState } from "react";
import FolderItem from "./components/FolderItem/FolderItem";
import { api } from "./api/api";
import { FolderData } from "./types/Folder";
import { getFoldersData } from "./utils/getFoldersData";
import { buildTree } from "./utils/buildTree";
import { isExpandedByDefault } from "./utils/isExpandedByDefault";
import "./App.css";

function App() {
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(false);
  const [foldersTree, setFoldersTree] = useState<Array<FolderData>>([]);

  const getFolders = async () => {
    const folderStructure = await api.getFolderStructure();
    const data = getFoldersData(folderStructure);
    const tree = buildTree(data);
    setFoldersTree(tree);
  };

  const toggleIncludeSubfolders = useCallback((value: boolean) => {
    setIncludeSubfolders(value);
  }, []);

  const updateObjectById = useCallback(
    (
      tree: FolderData[],
      targetId: number,
      value: boolean,
      includeSubfolders: boolean = false
    ): FolderData[] => {
      const updatedTree: FolderData[] = [...tree];

      function recursiveUpdate(
        node: FolderData,
        toBeUpdated: boolean = false
      ): FolderData {
        if (node.id === targetId || toBeUpdated) {
          if (includeSubfolders) {
            return {
              ...node,
              checked: value,
              children:
                node.children.length > 0
                  ? node.children.map((child) => recursiveUpdate(child, true))
                  : node.children,
            };
          } else {
            return { ...node, checked: value };
          }
        }

        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: node.children.map((child) =>
              recursiveUpdate(child, toBeUpdated)
            ),
          };
        }

        return node;
      }

      const updatedTreeWithUpdates: FolderData[] = updatedTree.map((node) =>
        recursiveUpdate(node)
      );

      return updatedTreeWithUpdates;
    },
    []
  );

  const updateFolderTree = useCallback(
    (value: boolean, id: number) => {
      setFoldersTree((previousFolderTree) =>
        updateObjectById(previousFolderTree, id, value)
      );
    },
    [updateObjectById]
  );

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div className="App">
      <FolderItem
        name="Including subfolders"
        className="toggle-subfolders"
        onChange={toggleIncludeSubfolders}
        defaultChecked={includeSubfolders}
      />

      {foldersTree.map((folderData) => (
        <FolderItem
          key={folderData.id}
          id={folderData.id}
          name={folderData.name}
          children={folderData.children}
          defaultChecked={folderData.checked}
          defaultExpanded={isExpandedByDefault(folderData.created)}
          onChange={updateFolderTree}
        />
      ))}
    </div>
  );
}

export default App;
