import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initMobileNav } from "../src/interactions/mobile-nav.js";

describe("mobile navigation", () => {
  let cleanup;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">Open navigation</span>
      </button>
      <nav id="primary-nav"><a href="#work">Work</a></nav>
    `;
    cleanup = initMobileNav(document);
  });

  afterEach(() => {
    cleanup();
  });

  it("opens and closes from the toggle", () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("nav");
    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(nav.dataset.open).toBe("true");
    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(nav.dataset.open).toBe("false");
  });

  it("closes after a navigation link is selected", () => {
    const toggle = document.querySelector(".nav-toggle");
    toggle.click();
    document.querySelector("nav a").click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("resolves the controlled navigation only inside the supplied root", () => {
    const root = document.createElement("section");
    root.innerHTML = `
      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">Open navigation</span>
      </button>
      <nav id="primary-nav"><a href="#work">Scoped work</a></nav>
    `;
    document.body.innerHTML = `<nav id="primary-nav"><a href="#outside">Outside work</a></nav>`;
    const scopedCleanup = initMobileNav(root);

    try {
      root.querySelector(".nav-toggle").click();

      expect(root.querySelector("nav").dataset.open).toBe("true");
      expect(document.body.querySelector("nav").dataset.open).toBeUndefined();
    } finally {
      scopedCleanup();
    }
  });
});
