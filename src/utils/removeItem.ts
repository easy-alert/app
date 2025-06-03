export const removeItem = <T>(list: T[], index: number): T[] => {
  const updatedList = [...list];
  updatedList.splice(index, 1);

  return updatedList;
};
