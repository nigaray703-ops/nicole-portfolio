export function initPortraitFallback(root = document) {
  const image = root.querySelector(".hero__portrait img");
  if (!image) return null;

  const showFallback = () => {
    const fallback = image.ownerDocument.createElement("div");
    fallback.className = "portrait-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", "Nicole Nikareayi");
    fallback.textContent = "Nicole Nikareayi";
    image.replaceWith(fallback);
  };

  if (image.complete && image.naturalWidth === 0) showFallback();
  else image.addEventListener("error", showFallback, { once: true });
  return () => image.removeEventListener("error", showFallback);
}
