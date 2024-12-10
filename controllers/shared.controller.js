import prisma from "../db/prisma.js";

export const shared = async (req, res) => {
  const { fileId, expireIn } = req.body;
  const currentTime = new Date();

  if (!fileId || !expireIn || isNaN(expireIn)) {
    return res.status(400).json({ message: "Invalid file ID or expiration time." });
  }

  const file = await prisma.file.findUnique({
    where: { id: fileId.trim() },
  });

  if (!file) {
    return res.render("sharedError", { message: { text: "File not found!" } });
  }

  const fileExist = await prisma.sharedFile.findFirst({
    where: {
      fileId: fileId.trim(),
    },
    include: {
      share: true,
    },
  });

  if (fileExist && fileExist.share.expiresAt > currentTime) {
    return res.render("sharedError", { message: { text: "You already shared this file" } });
  }

  if (fileExist && fileExist.share.expiresAt < currentTime) {
    console.log("fileExpired");

    await prisma.sharedFile.delete({
      where: {
        id: fileExist.id,
      },
    });

    await prisma.share.delete({
      where: {
        id: fileExist.shareId,
      },
    });
  }

  const expirationDate = new Date(Date.now() + parseInt(expireIn) * 60 * 60 * 1000);

  try {
    await prisma.share.create({
      data: {
        expiresAt: expirationDate,
        sharedFiles: {
          create: {
            fileId: file.id,
          },
        },
      },
    });

    const folderId = await prisma.sharedFile.findUnique({
      where: {
        fileId: fileId,
      },
      include: {
        file: true,
      },
    });

    const folderUrl = folderId.file.folderId || "";

    return res.redirect("/dashboard/" + folderUrl);
  } catch (error) {
    console.error("Error occurred:", error);
    return res.redirect("/dashboard");
  }
};

export const sharePublic = async (req, res) => {
  const { fileId } = req.params;
  const currentDate = new Date();

  try {
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
      return res
        .status(404)
        .render("sharedError", { message: { text: "Share not found or expired" } });
    }

    const data = {
      name: sharedFile.file.name,
      url: sharedFile.file.url,
      expiresAt: new Date(sharedFile.share.expiresAt).toLocaleString(),
    };

    return res.render("sharePublic", { data });
  } catch (error) {
    return res.status(500).render("sharedError", { message: { text: "Internal server error" } });
  }
};
