export function initMobileNav(root = document) {
  const toggle = root.querySelector(".nav-toggle");
  const navId = toggle.getAttribute("aria-controls");
  const nav = [...root.querySelectorAll("[id]")].find((element) => element.id === navId);

  if (!nav) throw new Error("Navigation toggle is missing its controlled navigation");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = String(open);
    toggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  };
  const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
  const onNavClick = (event) => {
    if (event.target.closest("a")) setOpen(false);
  };

  toggle.addEventListener("click", onToggle);
  nav.addEventListener("click", onNavClick);
  setOpen(false);

  return () => {
    toggle.removeEventListener("click", onToggle);
    nav.removeEventListener("click", onNavClick);
  };
}
