import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

export const dashboardGet = async (req, res, next) => {
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
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      next(error);
    }

    const data = [...user.folders, ...user.files];

    const sortedData = sortFilesAndFolders(data, "dsc");
    res.render("dash", {
      title: `${user.username}`,
      folderId: null,
      data: sortedData,
      parentId: null,
    });
  } catch (error) {
    next(error);
  }
};
