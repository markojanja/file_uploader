import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

export const folderGet = async (req, res, next) => {
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

    res.render("dash", {
      title: folder.name,
      folderId: folder.folderId,
      data: sortedData,
      parentId: id,
    });
  } catch (error) {
    next(error);
  }
};

export const folderCreateGet = (req, res, next) => {
  const { id } = req.params || null;

  res.render("create-form", { parentId: id });
};

export const folderCreate = async (req, res, next) => {
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
    if (parentId === null) {
      return res.redirect("/dashboard");
    }
    res.redirect(`/dashboard/${parentId}`);
  } catch (error) {
    next(error);
  }
};

export const folderEdit = async (req, res, next) => {
  const { id } = req.params;
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log(folder);

    res.render("edit-form", { parentId: id, folder });
  } catch (error) {
    next(error);
  }
};

export const folderEditPost = async (req, res, next) => {
  const { id } = req.params || null;
  const { name } = req.body;

  try {
    await prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    res.redirect(`/dashboard/${id}`);
  } catch (error) {
    next(error);
  }
};

export const folderDeletePost = async (req, res, next) => {
  const id = req.params.id;

  try {
    const folder = await prisma.folder.delete({
      where: {
        id: id,
      },
    });

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};
