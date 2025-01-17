const shareButtons = document.querySelectorAll(".share-btn");

shareButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn.dataset.id);
    const pops = document.querySelector(".popup");
    const fileId = document.getElementById("fileId");

    pops.classList.toggle("show");
    const input = document.querySelector(".share-link");
    input.value = `http://localhost:3000/shared/${btn.dataset.id}`;
    fileId.value = btn.dataset.id.trim();
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
