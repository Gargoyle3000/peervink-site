const customCursor = document.querySelector(".custom-cursor");

let lastMouseX = 0;
let hasMovedBefore = false;

function showCustomCursor() {
  if (!customCursor) return;

  document.body.classList.add("has-custom-cursor");
  customCursor.classList.add("is-visible");
}

window.addEventListener("mousemove", (event) => {
  if (!customCursor) return;

  const currentX = event.clientX;
  const currentY = event.clientY;

  customCursor.style.left = `${currentX}px`;
  customCursor.style.top = `${currentY}px`;

  if (hasMovedBefore) {
    if (currentX < lastMouseX - 2) {
      customCursor.classList.add("facing-left");
    }

    if (currentX > lastMouseX + 2) {
      customCursor.classList.remove("facing-left");
    }
  }

  lastMouseX = currentX;
  hasMovedBefore = true;

  showCustomCursor();
});

window.addEventListener("mousedown", () => {
  if (!customCursor) return;
  customCursor.classList.add("is-clicking");
});

window.addEventListener("mouseup", () => {
  if (!customCursor) return;
  customCursor.classList.remove("is-clicking");
});

document.addEventListener("mouseleave", () => {
  if (!customCursor) return;
  customCursor.classList.remove("is-visible");
});
// Studio Dump working chains
const chainLayer = document.querySelector(".chain-layer");

if (chainLayer) {
  let ticking = false;

  function updateWorkingChains() {
    const scrollY = window.scrollY;

    document.documentElement.style.setProperty(
      "--chain-side-y",
      `${scrollY * -0.45}px`
    );

    document.documentElement.style.setProperty(
      "--chain-middle-y",
      `${scrollY * 0.45}px`
    );

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateWorkingChains);
      ticking = true;
    }
  });

  updateWorkingChains();
}