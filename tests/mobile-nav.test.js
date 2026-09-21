import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initMobileNav } from "../src/interactions/mobile-nav.js";

describe("mobile navigation", () => {
  let cleanup;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">Open navigation</span>
      </button>
      <nav id="primary-nav">
        <a href="#work">Work</a>
        <a href="#about">About</a>
      </nav>
      <section id="work" aria-labelledby="work-title"><h2 id="work-title">Work</h2></section>
      <section id="about" aria-labelledby="about-title"><h2 id="about-title">About</h2></section>
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

  it("keeps navigation usable when visibility observation cannot initialise", () => {
    cleanup();
    cleanup = initMobileNav(document, class {
      constructor() { throw new Error("Observer unavailable"); }
    });
    const toggle = document.querySelector(".nav-toggle");
    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    document.querySelector("nav a").click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes after a navigation link is selected", () => {
    const toggle = document.querySelector(".nav-toggle");
    toggle.click();
    document.querySelector("nav a").click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("moves focus to the destination heading after selecting from the open menu", async () => {
    const toggle = document.querySelector(".nav-toggle");
    const heading = document.querySelector("#work-title");
    toggle.click();

    document.querySelector('nav a[href="#work"]').click();
    await Promise.resolve();

    expect(document.activeElement).toBe(heading);
    expect(heading.getAttribute("tabindex")).toBe("-1");
    heading.blur();
    expect(heading.hasAttribute("tabindex")).toBe(false);
  });

  it("marks the selected section link as the current location", () => {
    const work = document.querySelector('nav a[href="#work"]');
    const about = document.querySelector('nav a[href="#about"]');

    work.click();
    expect(work.getAttribute("aria-current")).toBe("location");
    expect(work.classList.contains("is-active")).toBe(true);
    expect(about.hasAttribute("aria-current")).toBe(false);

    about.click();
    expect(about.getAttribute("aria-current")).toBe("location");
    expect(work.hasAttribute("aria-current")).toBe(false);
  });

  it("updates the current link from observed section visibility", () => {
    cleanup();
    let observerCallback;
    let observerOptions;
    let disconnected = false;
    class MockIntersectionObserver {
      constructor(callback, options) {
        observerCallback = callback;
        observerOptions = options;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    }
    cleanup = initMobileNav(document, MockIntersectionObserver);

    expect(observerOptions.rootMargin).toBe("-120px 0px -320px");
    expect(observerOptions.rootMargin).not.toContain("%");
    observerCallback([
      {
        target: document.querySelector("#about"),
        isIntersecting: true,
        intersectionRatio: 0.8,
      },
    ]);

    expect(document.querySelector('nav a[href="#about"]').getAttribute("aria-current")).toBe(
      "location",
    );
    cleanup();
    expect(disconnected).toBe(true);
    cleanup = () => {};
  });

  it("clears the active link when no observed section remains visible", () => {
    cleanup();
    let observerCallback;
    class MockIntersectionObserver {
      constructor(callback) {
        observerCallback = callback;
      }
      observe() {}
      disconnect() {}
    }
    cleanup = initMobileNav(document, MockIntersectionObserver);
    const work = document.querySelector('nav a[href="#work"]');

    observerCallback([
      {
        target: document.querySelector("#work"),
        isIntersecting: true,
        intersectionRatio: 0.8,
      },
    ]);
    expect(work.getAttribute("aria-current")).toBe("location");

    observerCallback([
      {
        target: document.querySelector("#work"),
        isIntersecting: false,
        intersectionRatio: 0,
      },
    ]);
    expect(work.hasAttribute("aria-current")).toBe(false);
  });

  it("closes an open mobile menu with Escape and restores toggle focus", () => {
    const toggle = document.querySelector(".nav-toggle");
    toggle.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
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
