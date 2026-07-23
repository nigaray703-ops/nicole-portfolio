export function initCaseStudies(root = document) {
  const triggers = [...root.querySelectorAll("[data-case-trigger]")];
  const panelsById = new Map(
    [...root.querySelectorAll("[data-case-panel]")].map((panel) => [panel.id, panel]),
  );
  let activeTrigger = null;

  const getPanel = (trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelsById.get(panelId);
    if (!panel) {
      throw new Error(`Case-study panel "${panelId}" was not found within the supplied root.`);
    }
    return panel;
  };

  triggers.forEach(getPanel);

  const close = (trigger, restoreFocus = true) => {
    const panel = getPanel(trigger);
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    if (restoreFocus) trigger.focus();
    if (activeTrigger === trigger) activeTrigger = null;
  };

  const open = (trigger) => {
    if (activeTrigger && activeTrigger !== trigger) close(activeTrigger, false);
    const panel = getPanel(trigger);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    activeTrigger = trigger;
    panel.querySelector("[data-case-close]").focus();
  };

  triggers.forEach((trigger) => {
    const panel = getPanel(trigger);
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
