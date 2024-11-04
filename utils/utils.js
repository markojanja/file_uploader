export const sortFilesAndFolders = (data, option) => {
  if (option === "asc") {
    return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  if (option === "dsc") return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return data;
};
