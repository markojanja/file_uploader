import prisma from "../db/prisma.js";

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
    const newFile = await prisma.files.create({
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
