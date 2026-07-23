export function initCaseStudies(root = document) {
  const triggers = [...root.querySelectorAll("[data-case-trigger]")];
  const documentRoot = root.ownerDocument ?? root;
  let activeTrigger = null;

  const close = (trigger, restoreFocus = true) => {
    const panel = documentRoot.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    if (restoreFocus) trigger.focus();
    if (activeTrigger === trigger) activeTrigger = null;
  };

  const open = (trigger) => {
    if (activeTrigger && activeTrigger !== trigger) close(activeTrigger, false);
    const panel = documentRoot.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    activeTrigger = trigger;
    panel.querySelector("[data-case-close]").focus();
  };

  triggers.forEach((trigger) => {
    const panel = documentRoot.getElementById(trigger.getAttribute("aria-controls"));
    trigger.hidden = false;
    panel.querySelector("[data-case-close]").hidden = false;
    panel.hidden = true;
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      expanded ? close(trigger) : open(trigger);
    });
    panel.querySelector("[data-case-close]").addEventListener("click", () => close(trigger));
  });

  const handleEscape = (event) => {
    if (event.key === "Escape" && activeTrigger) close(activeTrigger);
  };
  root.addEventListener("keydown", handleEscape);
  return () => root.removeEventListener("keydown", handleEscape);
}
