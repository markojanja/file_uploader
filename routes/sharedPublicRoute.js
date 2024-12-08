import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.get("/:fileId", async (req, res) => {
  const { fileId } = req.params; // Capture the fileId from the URL parameter
  const currentDate = new Date();

  try {
    // Find the shared file details, including its associated share and file
    const sharedFile = await prisma.sharedFile.findFirst({
      where: {
        fileId: fileId, // Match the fileId
        share: {
          expiresAt: {
            gte: currentDate, // Check if the share is not expired
          },
        },
      },
      include: {
        share: true, // Include the share details
        file: true, // Include the file details
      },
    });

    if (!sharedFile) {
      return res.status(404).send("Share not found or expired");
    }

    // Send the file and share details in the response
    return res.json({ sharedFile }); // Assuming you are using a view like EJS
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

export default router;
