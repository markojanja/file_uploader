import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

export const folderGet = async (req, res) => {
  const { id } = req.params || null;

  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: id,
      },
      include: {
        folders: true,
        files: true,
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    const filesAndFolders = [...folder.folders, ...folder.files];
    const sortedData = sortFilesAndFolders(filesAndFolders);

    res.render("dash", { data: sortedData, parentId: id });
  } catch (error) {
    console.log(error);
  }
};

export const folderCreateGet = (req, res) => {
  const { id } = req.params || null;

  res.render("create-form", { parentId: id });
};

export const folderCreate = async (req, res) => {
  const parentId = req.params.id || null;

  const { folderName } = req.body;
  try {
    await prisma.folder.create({
      data: {
        folderId: parentId || null,
        ownerId: req.user.id,
        name: folderName,
      },
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
