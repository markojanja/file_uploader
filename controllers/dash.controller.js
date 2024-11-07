import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

export const dashboardGet = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: {
          where: {
            folderId: null,
          },
        },
        files: {
          where: {
            folderId: null,
          },
        },
      },
    });

    const data = [...user.folders, ...user.files];

    const sortedData = sortFilesAndFolders(data, "dsc");
    res.render("dash", { title: `${user.username}'s dashboard`, data: sortedData, parentId: null });
  } catch (error) {
    console.log(error);
  }
};
