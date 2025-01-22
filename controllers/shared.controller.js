import prisma from "../db/prisma.js";
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const shared = async (req, res, next) => {
  const { fileId, expireIn } = req.body;

  if (!fileId || !expireIn || isNaN(expireIn)) {
    const error = new Error("Invalid file ID or expiration time.");
    error.status = 400;
    return next(error);
  }

  try {
    const currentTime = new Date();
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      const error = new Error("File not found");
      error.status = 404;
      return next(error);
    }

    const existingShare = await prisma.sharedFile.findFirst({
      where: {
        fileId: fileId,
      },
      include: {
        share: true,
      },
    });

    if (existingShare) {
      if (existingShare.share.expiresAt > currentTime) {
        const error = new Error("You already shared this file");
        error.status = 400;
        return next(error);
      }

      await prisma.$transaction([
        prisma.sharedFile.delete({ where: { id: existingShare.id } }),
        prisma.share.delete({ where: { id: existingShare.shareId } }),
      ]);
    }

    const expirationDate = new Date(Date.now() + parseInt(expireIn) * 60 * 60 * 1000);

    const newShare = await prisma.share.create({
      data: {
        expiresAt: expirationDate,
        sharedFiles: {
          create: {
            fileId: file.id,
          },
        },
      },
    });

    const sharedFile = await prisma.sharedFile.findFirst({
      where: { shareId: newShare.id },
      include: { file: true },
    });

    const folderUrl = sharedFile.file.folderId || "";

    return res.redirect("/dashboard/" + folderUrl);
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

export const sharePublic = async (req, res, next) => {
  const { fileId } = req.params;

  try {
    const currentDate = new Date();

    const sharedFile = await prisma.sharedFile.findFirst({
      where: {
        fileId: fileId,
        share: {
          expiresAt: {
            gte: currentDate,
          },
        },
      },
      include: {
        share: true,
        file: true,
      },
    });

    if (!sharedFile) {
      await prisma.$transaction([prisma.sharedFile.delete({ where: { fileId: fileId } })]);
      const error = new Error("File not found or expired");
      error.status = 404;
      return next(error);
    }

    const filePath = path.join(__dirname, "..", "public", sharedFile.file.url);

    let fileSizeInBytes = 0;

    // Get file size
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);

      fileSizeInBytes = stats.size;
    } else {
      const error = new Error("File not found in storage");
      error.status = 404;
      return next(error);
    }

    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;

    const data = {
      id: sharedFile.file.id,
      name: sharedFile.file.name,
      url: sharedFile.file.url,
      ext: sharedFile.file.ext_name,
      createdAt: new Date(sharedFile.share.createdAt).toLocaleString(),
      expiresAt: new Date(sharedFile.share.expiresAt).toLocaleString(),
      fileSize: fileSizeInMB.toFixed(2),
    };

    return res.render("sharePublic", { data });
  } catch (error) {
    next(error);
  }
};
export const downloadFile = async (req, res, next) => {
  const id = req.params.fileId;
  console.log(req.params);
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
    next(error);
  }
};
