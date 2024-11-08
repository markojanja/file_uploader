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

    // console.log(folder);

    const filesAndFolders = [...folder.folders, ...folder.files];
    const sortedData = sortFilesAndFolders(filesAndFolders);

    res.render("dash", { title: folder.name, data: sortedData, parentId: id });
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
    if (parentId === null) {
      return res.redirect("/dashboard");
    }
    res.redirect(`/dashboard/${parentId}`);
  } catch (error) {
    console.log(error);
  }
};

export const folderEdit = async (req, res) => {
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
    console.log(error);
  }
};

export const folderEditPost = async (req, res) => {
  const { id } = req.params || null;
  const { name } = req.body;

  try {
    console.log(name);
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
    console.log(error);
  }
};

export const folderDeletePost = async (req, res) => {
  const id = req.params.id;

  try {
    const folder = await prisma.folder.delete({
      where: {
        id: id,
      },
    });

    console.log("f to del", folder);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
