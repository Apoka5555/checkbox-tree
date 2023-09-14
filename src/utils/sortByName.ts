import { FolderData } from "../types/Folder";

export const sortByName = (a: FolderData, b: FolderData) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};
