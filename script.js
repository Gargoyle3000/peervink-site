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