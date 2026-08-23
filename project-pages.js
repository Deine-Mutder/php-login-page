(() => {
  const page = document.querySelector(".project-page");
  const cards = [...document.querySelectorAll(".post-card")];
  const search = document.querySelector("#project-search");
  const results = document.querySelector("#project-results");
  const tagFilter = document.querySelector("#tag-filter");
  const modal = document.querySelector("#post-modal");
  const modalImage = document.querySelector("#modal-image");
  const modalTitle = document.querySelector("#modal-title");
  const download = document.querySelector("#download-image");
  const previewToggle = document.querySelector("#preview-toggle");
  const codePreview = document.querySelector("#code-preview");

  let activeTags = new Set();

  const collectTags = () => {
    const tags = new Set();
    // Include predefined tags from data-all-tags on the page element
    const allTags = page.dataset.allTags;
    if (allTags) allTags.trim().split(/\s+/).forEach((t) => tags.add(t));
    // Also collect tags from cards
    cards.forEach((card) => {
      if (card.dataset.tags) card.dataset.tags.trim().split(/\s+/).forEach((t) => tags.add(t));
    });
    return [...tags].sort();
  };

  // ETS2 part categories — semantic grouping, not prefix-based
  const TAG_GROUPS = [
    { name: "Front", tags: ["b_grill","f_badge","f_bumper","f_chs_logo","f_fender_cab","f_grill","f_inlay_chs","f_intake_bar","f_intake_cab","f_light_chs","f_logo","f_mirror","f_mudflap","f_turn_light","f_wnd_frame","hl_guard"] },
    { name: "Rear", tags: ["r_bumper","r_chs_cover","r_deflector","r_fender","r_fendr_top","r_grill","r_mudflap"] },
    { name: "Side", tags: ["s_deflector","s_guard","s_mirror","s_panel","s_strip","sideskirt","doorstep","tank"] },
    { name: "Cabin", tags: ["codrv_plate","codrv_seat","cor_def","curtain_f","doorhndl","doortrim","drv_plate","intlight_bck","steering_w","sunshld","windowtrim"] },
    { name: "Exhaust", tags: ["exhaust_l","exhaust_r"] },
    { name: "Accessories", tags: ["beacon","decals","filter","fmtglss_mid","l_horn","mir_guard","mirror","r_horn","set_lglass"] },
  ];

  const buildTagFilter = () => {
    if (!tagFilter) return;
    const allTags = new Set(collectTags());
    if (allTags.size === 0) return;

    const placed = new Set();

    TAG_GROUPS.forEach((group) => {
      const groupTags = group.tags.filter((t) => allTags.has(t));
      if (groupTags.length === 0) return;
      groupTags.forEach((t) => placed.add(t));

      const groupEl = document.createElement("div");
      groupEl.className = "tag-group";

      const header = document.createElement("button");
      header.className = "tag-group-header";
      header.type = "button";
      header.innerHTML =
        '<span>' + group.name + '</span>' +
        '<span class="tag-group-count">' + groupTags.length + '</span>' +
        '<span class="tag-group-arrow">›</span>';
      header.addEventListener("click", () => groupEl.classList.toggle("open"));

      const items = document.createElement("div");
      items.className = "tag-group-items";

      groupTags.forEach((tag) => {
        const chip = document.createElement("button");
        chip.className = "tag-chip";
        chip.type = "button";
        chip.textContent = tag;
        chip.addEventListener("click", () => {
          if (activeTags.has(tag)) { activeTags.delete(tag); chip.classList.remove("active"); }
          else { activeTags.add(tag); chip.classList.add("active"); }
          updateResults();
        });
        items.appendChild(chip);
      });

      groupEl.appendChild(header);
      groupEl.appendChild(items);
      tagFilter.appendChild(groupEl);
    });

    // Any leftover tags not in a defined group
    const leftovers = [...allTags].filter((t) => !placed.has(t)).sort();
    if (leftovers.length > 0) {
      const groupEl = document.createElement("div");
      groupEl.className = "tag-group";

      const header = document.createElement("button");
      header.className = "tag-group-header";
      header.type = "button";
      header.innerHTML =
        '<span>Misc</span>' +
        '<span class="tag-group-count">' + leftovers.length + '</span>' +
        '<span class="tag-group-arrow">›</span>';
      header.addEventListener("click", () => groupEl.classList.toggle("open"));

      const items = document.createElement("div");
      items.className = "tag-group-items";

      leftovers.forEach((tag) => {
        const chip = document.createElement("button");
        chip.className = "tag-chip";
        chip.type = "button";
        chip.textContent = tag;
        chip.addEventListener("click", () => {
          if (activeTags.has(tag)) { activeTags.delete(tag); chip.classList.remove("active"); }
          else { activeTags.add(tag); chip.classList.add("active"); }
          updateResults();
        });
        items.appendChild(chip);
      });

      groupEl.appendChild(header);
      groupEl.appendChild(items);
      tagFilter.appendChild(groupEl);
    }
  };

  const updateResults = () => {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesSearch = card.textContent.toLowerCase().includes(term);
      const cardTags = card.dataset.tags ? card.dataset.tags.trim().split(/\s+/) : [];
      const matchesTags = activeTags.size === 0 || [...activeTags].every((t) => cardTags.includes(t));
      const match = matchesSearch && matchesTags;
      card.hidden = !match;
      if (match) visible += 1;
    });
    results.textContent = `${visible} project${visible === 1 ? "" : "s"} found`;
  };

  buildTagFilter();

  const resetPreview = () => {
    codePreview.classList.remove("open");
    codePreview.textContent = "";
    previewToggle.textContent = "Code preview";
  };

  const openPost = (card) => {
    const image = card.querySelector(".post-image");
    if (image) {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
    }

    if (card.dataset.file) {
      download.href = card.dataset.file;
      download.download = card.dataset.file.split("/").pop();
    } else {
      download.removeAttribute("href");
      download.removeAttribute("download");
    }
    modalTitle.textContent = card.dataset.title;
    resetPreview();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };

  const closePost = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    resetPreview();
  };

  previewToggle.addEventListener("click", async () => {
    if (codePreview.classList.contains("open")) {
      resetPreview();
      return;
    }
    if (!download.hasAttribute("href")) return;
    try {
      const response = await fetch(download.href);
      if (!response.ok) throw new Error();
      codePreview.textContent = await response.text();
    } catch {
      codePreview.textContent = "Unable to load file preview.";
    }
    codePreview.classList.add("open");
    previewToggle.textContent = "Hide preview";
  });

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
  search.addEventListener("input", updateResults);
  updateResults();
  page.addEventListener("keydown", (event) => { if (event.key === "Escape") closePost(); });
})();
