import { FolderData, FolderStructure } from "../types/Folder";
import { isValidDate } from "./isValidDate";

export const getFoldersData = (folderStructure: FolderStructure) => {
  const data: Array<FolderData> = folderStructure.data.reduce(
    (result: Array<FolderData>, item) => {
      const createdDate = new Date(item[3]);

      if (isValidDate(createdDate)) {
        result.push({
          id: item[0],
          name: item[1],
          parent: item[2],
          created: createdDate,
          checked: false,
          children: [],
        });
      }

      return result;
    },
    []
  );

  return data;
};
