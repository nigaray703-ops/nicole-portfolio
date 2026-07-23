import { beforeEach, describe, expect, it } from "vitest";
import { initPortraitFallback } from "../src/interactions/portrait-fallback.js";

describe("portrait fallback", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="hero__portrait">
        <img src="/missing.jpg" alt="Portrait of Nicole Nikareayi">
      </div>
    `;
  });

  it("replaces a broken portrait with Nicole's name in an accessible framed fallback", () => {
    initPortraitFallback(document);
    document.querySelector(".hero__portrait img").dispatchEvent(new Event("error"));

    const fallback = document.querySelector(".portrait-fallback");
    expect(document.querySelector(".hero__portrait img")).toBeNull();
    expect(fallback).not.toBeNull();
    expect(fallback.textContent.trim()).toBe("Nicole Nikareayi");
    expect(fallback.getAttribute("role")).toBe("img");
    expect(fallback.getAttribute("aria-label")).toBe("Nicole Nikareayi");
  });

  it("handles a portrait that failed before enhancement initialised", () => {
    const image = document.querySelector(".hero__portrait img");
    Object.defineProperties(image, {
      complete: { value: true },
      naturalWidth: { value: 0 },
    });

    initPortraitFallback(document);

    expect(document.querySelector(".portrait-fallback")?.textContent.trim()).toBe(
      "Nicole Nikareayi",
    );
  });
});
