const dumpContainer = document.querySelector(".dump-grid");

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.setAttribute("aria-hidden", "true");

lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close image">×</button>
  <img class="lightbox-image" src="" alt="">
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

if (dumpContainer && window.workDumpImages) {
  window.workDumpImages.forEach((image, index) => {
    const figure = document.createElement("figure");
    figure.className = `dump-item ${image.layout}`;

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || `Work Dump image ${index + 1}`;
    img.loading = "lazy";
    img.className = "dump-clickable-image";

    img.addEventListener("click", () => {
      openLightbox(image.src, img.alt);
    });

    figure.appendChild(img);
    dumpContainer.appendChild(figure);
  });
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});