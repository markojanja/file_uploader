import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.post("/shared", async (req, res) => {
  const { fileId, expireIn } = req.body;

  if (!fileId || !expireIn || isNaN(expireIn)) {
    return res.status(400).json({ message: "Invalid file ID or expiration time." });
  }

  const file = await prisma.file.findUnique({
    where: { id: fileId.trim() },
  });

  const fileExist = await prisma.sharedFile.findFirst({
    where: {
      fileId: fileId.trim(),
    },
  });

  console.log(fileExist);

  if (fileExist) {
    return res.status(404).json({ message: "File already in db found." });
  }

  if (!file) {
    return res.status(404).json({ message: "File not found." });
  }

  const expirationDate = new Date(Date.now() + parseInt(expireIn) * 60 * 60 * 1000);

  try {
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

    const folderId = await prisma.sharedFile.findUnique({
      where: {
        fileId: fileId,
      },
      include: {
        file: true,
      },
    });

    return res.redirect("/dashboard/" + folderId.file.folderId);
  } catch (error) {
    console.error("Error occurred:", error);
    return res.redirect("/dashboard");
  }
});

export default router;
