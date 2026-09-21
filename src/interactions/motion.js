export function initMotion(
  root = document,
  mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? { matches: true },
) {
  // Project cards stay fully visible: only their details and data workflow animate.
  const items = [...root.querySelectorAll("[data-reveal]:not(.project)")];
  const flows = [...root.querySelectorAll(".dataset-flow")];
  const page = root.ownerDocument ?? root;
  const played = new WeakSet();
  let observer;
  const showFinalState = () => {
    observer?.disconnect();
    page.documentElement?.classList.remove("motion-ready");
    items.forEach((item) => item.classList.add("is-visible"));
    flows.forEach((flow) => {
      flow.classList.remove("flow-ready", "flow-played");
      flow.classList.add("flow-complete");
      played.add(flow);
    });
  };

  if (mediaQuery.matches || typeof window.IntersectionObserver !== "function") {
    showFinalState();
    return null;
  }

  try {
    observer = new window.IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || played.has(target)) return;
        played.add(target);
        target.classList.add(target.matches(".dataset-flow") ? "flow-played" : "is-visible");
        observer.unobserve(target);
      });
    }, { threshold: 0.14 });
    flows.forEach((flow) => flow.classList.add("flow-ready"));
    [...items, ...flows].forEach((item) => observer.observe(item));
    page.documentElement?.classList.add("motion-ready");
  } catch {
    showFinalState();
    return null;
  }

  const onPreferenceChange = (event) => {
    if (event.matches) showFinalState();
  };
  mediaQuery.addEventListener?.("change", onPreferenceChange);
  return () => {
    mediaQuery.removeEventListener?.("change", onPreferenceChange);
    showFinalState();
  };
}
