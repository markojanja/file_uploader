import { checkIsFileShared } from "./checkSharedFile.mjs";

const shareButtons = document.querySelectorAll(".share-btn");
const inputGroup = document.querySelector(".input-group");

shareButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      const id = btn.dataset.id.trim();
      const pops = document.querySelector(".popup");
      const fileId = document.getElementById("fileId");

      const input = document.querySelector(".share-link");
      input.value = `http://localhost:3000/shared/${id}`;
      fileId.value = id;
      console.log(fileId.value);
      const sharedFile = await checkIsFileShared(id);
      pops.classList.toggle("show");
      if (sharedFile.shared) {
        inputGroup.style.display = "none";
      }
    } catch (error) {
      console.log(error);
    }
  });
});

const popup = document.querySelector(".popup");

popup.addEventListener("click", (event) => {
  if (event.target.classList.contains("popup")) {
    popup.classList.toggle("show");
  }
});

const copyBtn = document.querySelector(".copy-btn");

copyBtn.addEventListener("click", async (e) => {
  const link = document.getElementById(e.target.dataset.link);
  const clipboardLink = link.value;
  try {
    await navigator.clipboard.writeText(clipboardLink.trim());
    copyBtn.classList.add("active");
  } catch (error) {
    console.log(error);
  }
});
