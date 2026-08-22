(() => {
  const page = document.querySelector(".project-page");
  const cards = [...document.querySelectorAll(".post-card")];
  const search = document.querySelector("#project-search");
  const results = document.querySelector("#project-results");
  const modal = document.querySelector("#post-modal");
  const modalImage = document.querySelector("#modal-image");
  const modalTitle = document.querySelector("#modal-title");
  const download = document.querySelector("#download-image");
  const code = document.querySelector("#code-preview");
  const codeToggle = document.querySelector("#code-toggle");

  const openPost = (card) => {
    const image = card.querySelector(".post-image");
    if (image) {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      download.href = image.src;
      download.download = `${card.dataset.title.toLowerCase().replace(/\s+/g, "-")}.png`;
    } else {
      modalImage.removeAttribute("src");
      modalImage.alt = "No image uploaded yet";
      download.removeAttribute("href");
      download.removeAttribute("download");
    }
    modalTitle.textContent = card.dataset.title;
    code.textContent = card.dataset.code;
    code.classList.remove("open");
    codeToggle.textContent = "Show code preview";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closePost = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  cards.forEach((card) => {
    const image = card.querySelector(".post-image");
    if (image) {
      image.addEventListener("click", () => openPost(card));
    }
    card.querySelector(".post-open").addEventListener("click", () => openPost(card));
  });
  document.querySelector("#modal-close").addEventListener("click", closePost);
  modal.addEventListener("click", (event) => { if (event.target === modal) closePost(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closePost(); });
  codeToggle.addEventListener("click", () => { const isOpen = code.classList.toggle("open"); codeToggle.textContent = isOpen ? "Hide code preview" : "Show code preview"; });
  search.addEventListener("input", () => {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => { const match = card.textContent.toLowerCase().includes(term); card.hidden = !match; if (match) visible += 1; });
    results.textContent = `${visible} project${visible === 1 ? "" : "s"} found`;
  });
  results.textContent = `${cards.length} projects found`;
  page.addEventListener("keydown", (event) => { if (event.key === "Escape") closePost(); });
})();
