import { afterEach, describe, expect, it, vi } from "vitest";
import { initMotion } from "../src/interactions/motion.js";

describe("motion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove("motion-ready");
  });
  it("does not create an observer when reduced motion is requested", () => {
    document.body.innerHTML = `<section data-reveal></section>`;
    const mediaQuery = { matches: true };
    expect(initMotion(document, mediaQuery)).toBe(null);
    expect(document.querySelector("[data-reveal]").classList.contains("is-visible")).toBe(true);
  });

  it("presents the final flow when the observer is missing or fails", () => {
    for (const Observer of [undefined, class { observe() { throw new Error("unavailable"); } disconnect() {} }]) {
      vi.stubGlobal("IntersectionObserver", Observer);
      document.body.innerHTML = `<section data-reveal></section><div class="dataset-flow"></div>`;
      expect(initMotion(document, { matches: false })).toBe(null);
      expect(document.querySelector(".dataset-flow").classList.contains("flow-complete")).toBe(true);
      expect(document.documentElement.classList.contains("motion-ready")).toBe(false);
    }
  });

  it("observes the flow once and never re-arms it, including preference changes", () => {
    let callback;
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(handler) { callback = handler; }
      observe() {}
      unobserve = unobserve;
      disconnect = disconnect;
    });
    document.body.innerHTML = `<div class="dataset-flow"></div>`;
    const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const dispose = initMotion(document, media);
    const flow = document.querySelector(".dataset-flow");
    callback([{ target: flow, isIntersecting: true }]);
    callback([{ target: flow, isIntersecting: false }, { target: flow, isIntersecting: true }]);
    expect(unobserve).toHaveBeenCalledTimes(1);
    expect(flow.classList.contains("flow-played")).toBe(true);
    const preferenceChange = media.addEventListener.mock.calls[0][1];
    preferenceChange({ matches: true });
    preferenceChange({ matches: false });
    callback([{ target: flow, isIntersecting: true }]);
    expect(flow.classList.contains("flow-played")).toBe(false);
    expect(flow.classList.contains("flow-complete")).toBe(true);
    dispose();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", preferenceChange);
  });
});
