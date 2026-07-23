import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve("index.html"), "utf8");

describe("public portfolio contract", () => {
  it("contains the approved public identity and role", () => {
    expect(html).toContain("Nicole Nikareayi");
    expect(html).toContain("Graduate Business Analyst");
    expect(html).toContain("Auckland, New Zealand");
    expect(html).toContain("nigaray703@gmail.com");
    expect(html).toContain("linkedin.com/in/nikareayi-aisikaer");
  });

  it("omits private phone and Nicole Universe dependencies", () => {
    expect(html).not.toContain("+64 20 476 4396");
    expect(html).not.toContain("nicole-universe");
    expect(html).not.toContain("owner-admin");
    expect(html).not.toContain("Supabase");
  });

  it("contains the four approved case studies", () => {
    const projects = [
      "Technology Innovation Internship",
      "PawPal Health",
      "GlobeMate",
      "AI-assisted Job Application Tracker",
    ];
    projects.forEach((project) => expect(html).toContain(project));
  });

  it("keeps the current-focus signal free of a numeric metric", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const signalCard = document.querySelector(".signal-card");

    expect(signalCard).not.toBeNull();
    expect(signalCard.textContent).toContain("Current focus");
    expect(signalCard.textContent).toContain("Research / Process / Product / AI");
    expect(signalCard.querySelector("strong")).toBeNull();
  });

  it("contains every required page region", () => {
    ["work", "capabilities", "experience", "about", "contact"].forEach((id) => {
      expect(html).toContain(`id="${id}"`);
    });
  });

  it("pairs Experience and About in their original order", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const profileLayout = document.querySelector(".profile-layout");

    expect(profileLayout).not.toBeNull();
    expect([...profileLayout.children].map((section) => section.id)).toEqual([
      "experience",
      "about",
    ]);
  });

  it("uses the accepted section labels and Capabilities supporting copy", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;

    expect(document.querySelector("#experience-title").textContent.trim()).toBe("Experience");
    expect(document.querySelector("#capabilities .section-intro").textContent.trim()).toBe(
      "A balanced toolkit across analysis, people, products and emerging technology.",
    );
    expect(document.querySelector("#about .section-label").textContent.trim()).toBe("About");
  });

  it("declares an inline favicon so browsers do not request a missing asset", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const favicon = document.querySelector('link[rel="icon"]');

    expect(favicon).not.toBeNull();
    expect(favicon.getAttribute("href")).toBe("data:,");
  });

  it("keeps case studies readable without JavaScript", () => {
    const document = new JSDOM(html).window.document;
    const triggers = document.querySelectorAll("[data-case-trigger]");
    const panels = document.querySelectorAll("[data-case-panel]");
    const closeButtons = document.querySelectorAll("[data-case-close]");

    expect(triggers).toHaveLength(4);
    expect(panels).toHaveLength(4);
    expect(closeButtons).toHaveLength(4);
    triggers.forEach((trigger) => expect(trigger.hasAttribute("hidden")).toBe(true));
    panels.forEach((panel) => expect(panel.hasAttribute("hidden")).toBe(false));
    closeButtons.forEach((button) => expect(button.hasAttribute("hidden")).toBe(true));
  });
});
