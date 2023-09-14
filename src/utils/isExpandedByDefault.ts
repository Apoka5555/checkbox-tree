// Folders which are created before this date should be *expanded* by default
const EXPANDED_DATE_STRING = "2023-05-01";

const expandedDate = new Date(EXPANDED_DATE_STRING);

export const isExpandedByDefault = (date: Date) => {
  return date < expandedDate;
};
