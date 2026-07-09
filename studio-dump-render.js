const studioDumpGrid = document.querySelector(".dump-grid");
const studioDumpImages = window.studioDumpImages || [];

if (studioDumpGrid) {
  studioDumpImages.forEach((src, index) => {
    const item = document.createElement("figure");
    item.className = `dump-item dump-layout-${(index % 8) + 1}`;

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    img.className = "dump-clickable-image";

    item.appendChild(img);
    studioDumpGrid.appendChild(item);
  });
}

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.innerHTML = `
  <button class="image-lightbox-close" aria-label="Close">×</button>
  <img src="" alt="">
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".image-lightbox-close");

document.addEventListener("click", (event) => {
  const clickedImage = event.target.closest(".dump-clickable-image");

  if (clickedImage) {
    lightboxImage.src = clickedImage.src;
    lightbox.classList.add("is-open");
  }

  if (
    event.target === lightbox ||
    event.target === closeButton
  ) {
    lightbox.classList.remove("is-open");
    lightboxImage.src = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    lightbox.classList.remove("is-open");
    lightboxImage.src = "";
  }
});
