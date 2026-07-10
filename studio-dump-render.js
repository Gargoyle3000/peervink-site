const grid = document.querySelector(".dump-grid");

const batchSize = 36;
let currentIndex = 0;
let observer = null;

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

function createStudioDumpItem(rawItem, globalIndex) {
  const item = normalizeItem(rawItem);

  const figure = document.createElement("figure");
  figure.className = "dump-item";

  const link = document.createElement("a");
  link.href = item.full || item.thumb;
  link.target = "_blank";
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

function renderBatch() {
  if (!grid || !Array.isArray(STUDIO_DUMP_IMAGES)) return;

  const batch = STUDIO_DUMP_IMAGES.slice(currentIndex, currentIndex + batchSize);
  const fragment = document.createDocumentFragment();

  batch.forEach((item, index) => {
    fragment.appendChild(createStudioDumpItem(item, currentIndex + index));
  });

  grid.appendChild(fragment);
  currentIndex += batch.length;

  if (currentIndex >= STUDIO_DUMP_IMAGES.length && observer) {
    observer.disconnect();
  }
}

if (grid && Array.isArray(STUDIO_DUMP_IMAGES)) {
  renderBatch();

  const sentinel = document.createElement("div");
  sentinel.className = "studio-dump-sentinel";
  grid.after(sentinel);

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        renderBatch();
      }
    },
    {
      rootMargin: "900px"
    }
  );

  observer.observe(sentinel);
}