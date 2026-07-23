export function initMobileNav(root = document, Observer = globalThis.IntersectionObserver) {
  const toggle = root.querySelector(".nav-toggle");
  const navId = toggle.getAttribute("aria-controls");
  const nav = [...root.querySelectorAll("[id]")].find((element) => element.id === navId);

  if (!nav) throw new Error("Navigation toggle is missing its controlled navigation");

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const targets = new Map(
    links
      .map((link) => {
        const id = link.getAttribute("href").slice(1);
        return [id, root.querySelector(`#${id}`)];
      })
      .filter(([, target]) => target),
  );

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = String(open);
    toggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  };
  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const focusDestination = (link) => {
    const target = targets.get(link.getAttribute("href").slice(1));
    if (!target) {
      toggle.focus();
      return;
    }

    const headingId = target.getAttribute("aria-labelledby");
    const focusTarget = (headingId && root.querySelector(`#${headingId}`)) || target;
    const addedTabIndex = !focusTarget.hasAttribute("tabindex");
    if (addedTabIndex) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (addedTabIndex) {
      focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), {
        once: true,
      });
    }
  };
  const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
  const onNavClick = (event) => {
    const link = event.target.closest("a");
    if (!link || !nav.contains(link)) return;
    const wasOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(false);
    setActive(link.getAttribute("href").slice(1));
    if (wasOpen) queueMicrotask(() => focusDestination(link));
  };

  let sectionObserver = null;
  if (typeof Observer === "function" && targets.size > 0) {
    sectionObserver = new Observer(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-25% 0px -60%", threshold: [0.1, 0.35, 0.6] },
    );
    targets.forEach((target) => sectionObserver.observe(target));
  }

  toggle.addEventListener("click", onToggle);
  nav.addEventListener("click", onNavClick);
  setOpen(false);

  return () => {
    toggle.removeEventListener("click", onToggle);
    nav.removeEventListener("click", onNavClick);
    sectionObserver?.disconnect();
  };
}
