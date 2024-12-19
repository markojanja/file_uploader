import prisma from "../db/prisma.js";

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

export const sharePublic = async (req, res) => {
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
      const error = new Error("File not found or expired");
      error.status = 404;
      return next(error);
    }

    const data = {
      name: sharedFile.file.name,
      url: sharedFile.file.url,
      ext: sharedFile.file.ext_name,
      expiresAt: new Date(sharedFile.share.expiresAt).toLocaleString(),
    };

    return res.render("sharePublic", { data });
  } catch (error) {
    next(error);
  }
};
