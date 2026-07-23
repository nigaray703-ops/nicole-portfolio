export function initMotion(
  root = document,
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"),
) {
  const items = [...root.querySelectorAll("[data-reveal]")];

  if (mediaQuery.matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  items.forEach((item) => observer.observe(item));
  return observer;
}
