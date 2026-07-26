import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initCaseStudies } from "../src/interactions/case-studies.js";

describe("case studies", () => {
  let cleanup;

  beforeEach(() => {
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
});
