import { FolderStructure } from "../types/Folder";

const folderPath = "/data/response.json";

export const getFolderStructure = async (): Promise<FolderStructure> => {
  const response = await fetch(folderPath);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return data;
};
