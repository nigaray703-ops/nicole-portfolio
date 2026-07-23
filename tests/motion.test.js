import { describe, expect, it } from "vitest";
import { initMotion } from "../src/interactions/motion.js";

describe("motion", () => {
  it("does not create an observer when reduced motion is requested", () => {
    document.body.innerHTML = `<section data-reveal></section>`;
    const mediaQuery = { matches: true };
    expect(initMotion(document, mediaQuery)).toBe(null);
    expect(document.querySelector("[data-reveal]").classList.contains("is-visible")).toBe(true);
  });
});
