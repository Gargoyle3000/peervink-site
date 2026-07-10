const grid = document.querySelector(".dump-grid");

function normalizeItem(item) {
  if (typeof item === "string") {
    return {
      thumb: item,
      full: item,
      width: null,
      height: null
    };
  }

  return item;
}

function shuffleItems(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

function createStudioDumpItem(rawItem, globalIndex) {
  const item = normalizeItem(rawItem);

  const figure = document.createElement("figure");
  figure.className = "dump-item";

  const link = document.createElement("a");
  link.href = item.full || item.thumb;
  link.rel = "noopener";

  const img = document.createElement("img");
  img.src = item.thumb || item.full;
  img.alt = "";
  img.loading = globalIndex < 16 ? "eager" : "lazy";
  img.decoding = "async";

  link.appendChild(img);
  figure.appendChild(link);

  return figure;
}

function renderStudioDump() {
  if (!grid || !Array.isArray(STUDIO_DUMP_IMAGES)) return;

  const fragment = document.createDocumentFragment();
  const randomizedImages = shuffleItems(STUDIO_DUMP_IMAGES);

  randomizedImages.forEach((item, index) => {
    fragment.appendChild(createStudioDumpItem(item, index));
  });

  grid.appendChild(fragment);
}

renderStudioDump();