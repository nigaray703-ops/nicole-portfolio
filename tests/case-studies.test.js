import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initCaseStudies } from "../src/interactions/case-studies.js";

describe("case studies", () => {
  let cleanup;

  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    document.body.innerHTML = `
      <button data-case-trigger="alpha" aria-expanded="false" aria-controls="case-alpha" hidden>Read</button>
      <div id="case-alpha" data-case-panel>
        <button data-case-close hidden>Close</button>
      </div>
    `;
    cleanup = initCaseStudies(document);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("opens the controlled panel without jumping focus to the close button", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    trigger.focus();
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hidden).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("enhances the visible no-JavaScript fallback only after initialisation", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    expect(trigger.hidden).toBe(false);
    expect(panel.hidden).toBe(true);
    expect(panel.querySelector("[data-case-close]").hidden).toBe(false);
  });

  it("closes with Escape and restores focus", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    trigger.click();
    panel.querySelector("[data-case-close]").focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("closes with its close button and restores focus", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    trigger.click();
    panel.querySelector("[data-case-close]").click();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("resolves panels only within a detached supplied root", () => {
    document.body.innerHTML = `
      <div id="case-alpha" data-case-panel>
        <button data-case-close hidden>Outside close</button>
      </div>
    `;
    const root = document.createElement("section");
    root.innerHTML = `
      <button data-case-trigger="alpha" aria-expanded="false" aria-controls="case-alpha" hidden>Read</button>
      <div id="case-alpha" data-case-panel>
        <button data-case-close hidden>Scoped close</button>
      </div>
    `;
    const scopedCleanup = initCaseStudies(root);
    try {
      const trigger = root.querySelector("[data-case-trigger]");
      const scopedPanel = root.querySelector("[data-case-panel]");
      const outsidePanel = document.body.querySelector("[data-case-panel]");

      trigger.click();

      expect(scopedPanel.hidden).toBe(false);
      expect(scopedPanel.querySelector("[data-case-close]").hidden).toBe(false);
      expect(outsidePanel.querySelector("[data-case-close]").hidden).toBe(true);
    } finally {
      scopedCleanup();
    }
  });

  it("throws a clear error when a controlled panel is missing", () => {
    const root = document.createElement("section");
    root.innerHTML = `
      <button data-case-trigger="missing" aria-expanded="false" aria-controls="case-missing" hidden>Read</button>
    `;

    expect(() => initCaseStudies(root)).toThrow(
      'Case-study panel "case-missing" was not found within the supplied root.',
    );
  });

  it("does not steal outside focus when Escape closes a case", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    document.querySelector("[data-case-trigger]").click();
    outside.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(document.activeElement).toBe(outside);
    expect(document.querySelector("[data-case-panel]").hidden).toBe(true);
  });

  it("keeps rapid toggles synchronous with no delayed hide or inline height", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    for (let index = 0; index < 21; index += 1) trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hidden).toBe(false);
    trigger.click();
    expect(panel.hidden).toBe(true);
    expect(panel.style.cssText).toBe("");
  });

  it("preserves a visible trigger's viewport position when collapsing reflows the grid", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    trigger.click();
    vi.spyOn(trigger, "getBoundingClientRect")
      .mockReturnValueOnce({ top: 120, bottom: 164, height: 44 })
      .mockReturnValueOnce({ top: 80, bottom: 124, height: 44 });
    const scroll = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    trigger.click();
    expect(scroll).toHaveBeenCalledWith({ top: -40, behavior: "instant" });
  });

  it("switches cases without leaving focus inside the hidden previous panel", () => {
    cleanup();
    document.body.insertAdjacentHTML("beforeend", `
      <button data-case-trigger="beta" aria-expanded="false" aria-controls="case-beta" hidden>Read beta</button>
      <div id="case-beta" data-case-panel><button data-case-close hidden>Close beta</button></div>
    `);
    cleanup = initCaseStudies(document);
    const [alpha, beta] = document.querySelectorAll("[data-case-trigger]");
    alpha.click();
    document.querySelector("#case-alpha button").focus();
    beta.click();
    expect(document.querySelector("#case-alpha").hidden).toBe(true);
    expect(document.querySelector("#case-beta").hidden).toBe(false);
    expect(document.activeElement).toBe(beta);
  });

  it("removes click listeners on cleanup so reinitialising does not double-toggle", () => {
    cleanup();
    cleanup = initCaseStudies(document);
    const trigger = document.querySelector("[data-case-trigger]");
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("does not apply a pending scroll correction after the case reopens", () => {
    let settle;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      settle = callback;
      return 1;
    });
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    trigger.scrollIntoView = vi.fn();
    trigger.click();
    panel.querySelector("[data-case-close]").focus();
    panel.querySelector("[data-case-close]").click();
    trigger.click();
    trigger.scrollIntoView.mockClear();
    settle();
    expect(panel.hidden).toBe(false);
    expect(trigger.scrollIntoView).not.toHaveBeenCalled();
  });
});
