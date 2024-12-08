const shareB = document.querySelectorAll(".share-btn");

shareB.forEach((b) => {
  b.addEventListener("click", () => {
    console.log(b.dataset.id);
    const pops = document.querySelector(".popup");
    const fileId = document.getElementById("fileId");

    pops.classList.toggle("show");
    const input = document.querySelector(".share-link");
    input.value = `http://localhost:3000/share/${b.dataset.id}`;
    fileId.value = b.dataset.id.trim();
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
  } catch (error) {
    console.log(error);
  }
});
