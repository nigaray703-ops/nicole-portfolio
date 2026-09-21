export function initCaseStudies(root = document) {
  const triggers = [...root.querySelectorAll("[data-case-trigger]")];
  const panelsById = new Map(
    [...root.querySelectorAll("[data-case-panel]")].map((panel) => [panel.id, panel]),
  );
  let activeTrigger = null;
  const listeners = [];

  const listen = (node, handler) => {
    node.addEventListener("click", handler);
    listeners.push(() => node.removeEventListener("click", handler));
  };

  const getPanel = (trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelsById.get(panelId);
    if (!panel) {
      throw new Error(`Case-study panel "${panelId}" was not found within the supplied root.`);
    }
    return panel;
  };

  triggers.forEach(getPanel);

  const close = (trigger, { restoreFocus = false, preservePosition = true, focusTarget = trigger } = {}) => {
    const panel = getPanel(trigger);
    const view = trigger.ownerDocument.defaultView;
    const focusWasInside = panel.contains(trigger.ownerDocument.activeElement);
    const before = trigger.getBoundingClientRect();
    const wasVisible = before.height > 0 && before.top >= 0 && before.bottom <= view.innerHeight;
    // Cancel a focus/anchor scroll already in progress before changing the grid.
    if (preservePosition && (restoreFocus || focusWasInside || wasVisible)) {
      view.scrollTo({ top: view.scrollY, behavior: "instant" });
    }
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    trigger.closest(".project")?.classList.remove("project--expanded");
    if (restoreFocus || focusWasInside) focusTarget.focus({ preventScroll: true });
    if (preservePosition) {
      if (wasVisible) {
        const delta = trigger.getBoundingClientRect().top - before.top;
        if (Math.abs(delta) > 1) view.scrollBy({ top: delta, behavior: "instant" });
      } else if (restoreFocus || focusWasInside) {
        trigger.scrollIntoView?.({ block: "nearest", behavior: "instant" });
      }
      // Native scroll anchoring can settle after layout. Correct only if this
      // same trigger still owns focus and its case has not been reopened.
      if (restoreFocus || focusWasInside || wasVisible) {
        view.requestAnimationFrame(() => {
          if (!panel.hidden || trigger.ownerDocument.activeElement !== trigger) return;
          const rect = trigger.getBoundingClientRect();
          if (wasVisible) {
            const delta = rect.top - before.top;
            if (Math.abs(delta) > 1) view.scrollBy({ top: delta, behavior: "instant" });
          } else if (rect.top < 0 || rect.bottom > view.innerHeight) {
            trigger.scrollIntoView?.({ block: "nearest", behavior: "instant" });
          }
        });
      }
    }
    if (activeTrigger === trigger) activeTrigger = null;
  };

  const open = (trigger) => {
    if (activeTrigger && activeTrigger !== trigger) {
      close(activeTrigger, { preservePosition: false, focusTarget: trigger });
    }
    const panel = getPanel(trigger);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    trigger.closest(".project")?.classList.add("project--expanded");
    activeTrigger = trigger;
  };

  triggers.forEach((trigger) => {
    const panel = getPanel(trigger);
    trigger.hidden = false;
    panel.querySelector("[data-case-close]").hidden = false;
    panel.hidden = true;
    listen(trigger, () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      expanded ? close(trigger) : open(trigger);
    });
    listen(panel.querySelector("[data-case-close]"), () => close(trigger, { restoreFocus: true }));
  });

  const handleEscape = (event) => {
    if (event.key === "Escape" && !event.defaultPrevented && activeTrigger) close(activeTrigger);
  };
  root.addEventListener("keydown", handleEscape);
  return () => {
    listeners.forEach((remove) => remove());
    root.removeEventListener("keydown", handleEscape);
  };
}
