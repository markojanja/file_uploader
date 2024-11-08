import prisma from "../db/prisma.js";
import url from "url";
import path from "path";
import fs from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadGet = (req, res) => {
  const { id } = req.params || null;
  res.render("upload-form", { parentId: id });
};

export const uploadCreatePost = async (req, res) => {
  const { id } = req.params || null;
  const { name } = req.body;
  const userId = req.user.id;
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const newFile = await prisma.file.create({
      data: {
        name: name,
        ownerId: userId,
        url: fileUrl,
        folderId: id,
      },
    });

    const newurl = newFile.id;
    console.log(newurl);

    res.redirect(`/dashboard`);
  } catch (error) {
    console.log(error);
  }
};

export const downloadFile = async (req, res) => {
  const id = req.params.id;
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });
    const filepath = path.join(__dirname, "..", "public", file.url);

    res.download(filepath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (req, res) => {
  const id = req.params.id;

  try {
    const file = await prisma.file.delete({
      where: {
        id: id,
      },
    });

    fs.unlink(path.join(__dirname, "..", "public", file.url), (err) => {
      if (err) throw err;
    });

    console.log("deleted file", file);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
