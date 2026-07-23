import { beforeEach, describe, expect, it } from "vitest";
import { initCaseStudies } from "../src/interactions/case-studies.js";

describe("case studies", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button data-case-trigger="alpha" aria-expanded="false" aria-controls="case-alpha" hidden>Read</button>
      <div id="case-alpha" data-case-panel>
        <button data-case-close hidden>Close</button>
      </div>
    `;
    initCaseStudies(document);
  });

  it("opens the controlled panel and updates aria-expanded", () => {
    const trigger = document.querySelector("[data-case-trigger]");
    const panel = document.querySelector("[data-case-panel]");
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hidden).toBe(false);
    expect(document.activeElement).toBe(panel.querySelector("[data-case-close]"));
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
});
