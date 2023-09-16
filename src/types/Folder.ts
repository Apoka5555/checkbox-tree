export interface FolderData {
  id: number;
  name: string;
  parent: number | null;
  created: Date;
  children: Array<FolderData>;
  checked?: boolean;
}

export interface Column {
  id: string;
  type: string;
  nullable: boolean;
}

export interface FolderStructure {
  columns: Array<Column>;
  data: Array<[number, string, number | null, string]>;
}
