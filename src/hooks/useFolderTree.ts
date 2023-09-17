import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import { FolderData } from "../types/Folder";
import { buildTree } from "../utils/buildTree";
import { getFoldersData } from "../utils/getFoldersData";

export function useFolderTree() {
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
      tree: Array<FolderData>,
      targetId: number,
      value: boolean
    ): Array<FolderData> => {
      const updatedTree: Array<FolderData> = [...tree];

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

      const updatedTreeWithUpdates: Array<FolderData> = updatedTree.map(
        (node) => recursiveUpdate(node)
      );

      return updatedTreeWithUpdates;
    },
    [includeSubfolders]
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

  return {
    foldersTree,
    includeSubfolders,
    toggleIncludeSubfolders,
    updateFolderTree,
  };
}
