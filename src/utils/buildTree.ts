import { FolderData } from "../types/Folder";
import { sortByName } from "./sortByName";

export const buildTree = (
  data: Array<FolderData>,
  parentId: number | null = null
) => {
  const tree: Array<FolderData> = [];
  data
    .filter((node) => node.parent === parentId)
    .sort(sortByName)
    .forEach((node) => {
      const children = buildTree(data, node.id);
      if (children.length > 0) {
        node.children = children.sort(sortByName);
      }
      tree.push(node);
    });
  return tree;
};
