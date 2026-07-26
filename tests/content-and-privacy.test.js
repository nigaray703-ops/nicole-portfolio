import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve("index.html"), "utf8");
const baseCss = readFileSync(resolve("src/styles/base.css"), "utf8");
const componentsCss = readFileSync(resolve("src/styles/components.css"), "utf8");
const responsiveCss = readFileSync(resolve("src/styles/responsive.css"), "utf8");
const tokensCss = readFileSync(resolve("src/styles/tokens.css"), "utf8");

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
    expect(signalCard.textContent).toContain("Business Analysis / Process / Product / AI");
    expect(signalCard.querySelector("strong")).toBeNull();
  });

  it("keeps Current focus text in the accessibility tree", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const signalCard = document.querySelector(".signal-card");

    expect(signalCard.tagName).toBe("ASIDE");
    expect(signalCard.hasAttribute("aria-hidden")).toBe(false);
  });

  it("contains every required page region", () => {
    ["work", "capabilities", "experience", "education", "leadership", "about", "contact"].forEach((id) => {
      expect(html).toContain(`id="${id}"`);
    });
  });

  it("uses the approved Moonline Signature identity", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const brand = document.querySelector(".brand");

    expect(brand.querySelector(".brand__signature").textContent.trim()).toBe("Nicole");
    expect(brand.querySelector(".brand__surname").textContent.trim()).toBe("Nikareayi");
    expect(brand.querySelector(".brand__moon").getAttribute("aria-hidden")).toBe("true");
  });

  it("separates experience, education, leadership, and about", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const experienceItems = document.querySelectorAll("#experience .timeline > li");

    expect(experienceItems).toHaveLength(1);
    expect(document.querySelector("#education-title").textContent.trim()).toBe("Education");
    expect(document.querySelector("#leadership-title").textContent.trim()).toBe(
      "Leadership & Community",
    );
    expect(document.querySelector("#education")).not.toBeNull();
    expect(document.querySelector("#leadership")).not.toBeNull();
  });

  it("contains exact recruiter-facing project context", () => {
    [
      "STEMX500 · 400+ hours · Nov 2025–Feb 2026 · Wix",
      "COMPX500 · Sep–Oct 2025 · Proto.io",
      "MNNGT544 · Jul–Oct 2025 · Multidisciplinary team",
      "Personal project · Workflow design · AI-assisted web development",
    ].forEach((metadata) => expect(html).toContain(metadata));
  });

  it("uses the evidence-safe GlobeMate outcome", () => {
    expect(html).toContain(
      "Contributed to business-case development and concept validation within a multidisciplinary team.",
    );
    expect(html).not.toContain(
      "Contributed to a validated multidisciplinary product concept",
    );
  });

  it("includes Business Analyst and Office evidence", () => {
    const publicCopy = html.toLowerCase();
    [
      "user stories",
      "functional specification support",
      "pivot tables",
      "powerpoint",
      "requirements documentation",
    ].forEach((term) => expect(publicCopy).toContain(term));
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

  it("keeps the About label style more specific than generic About paragraph rules", () => {
    expect(componentsCss).toMatch(
      /\.about \.section-label\s*{[^}]*color:\s*var\(--color-mint\);[^}]*font-size:\s*0\.9rem;[^}]*}/s,
    );
  });

  it("collapses mobile navigation only after JavaScript enhancement", () => {
    expect(responsiveCss).toMatch(/\.js #primary-nav\s*{[^}]*display:\s*none;/s);
    expect(responsiveCss).toMatch(/\.js \.nav-toggle\s*{[^}]*display:\s*inline-grid;/s);
    expect(responsiveCss).not.toMatch(/^\s{2}#primary-nav\s*{[^}]*display:\s*none;/m);
  });

  it("clips decorative hero geometry throughout the stacked-tablet layout", () => {
    const stackedLayout = responsiveCss.match(
      /@media \(max-width:\s*900px\)\s*{([\s\S]*?)\n}\n\n@media \(max-width:\s*680px\)/,
    )?.[1];

    expect(stackedLayout).toMatch(/\.hero\s*{[^}]*overflow:\s*clip;/s);
  });

  it("provides a visible non-color active navigation treatment", () => {
    expect(componentsCss).toMatch(
      /#primary-nav a\[aria-current="location"\][^}]*text-decoration-line:\s*underline;/s,
    );
  });

  it("uses a privacy-safe explicit system font stack without an unbundled Inter dependency", () => {
    expect(tokensCss).not.toMatch(/--font-sans:[^;]*\bInter\b/);
    expect(tokensCss).toContain('"SF Pro Display"');
    expect(tokensCss).toContain('"Segoe UI Variable"');
    expect(tokensCss).toContain('"Helvetica Neue"');
    expect(tokensCss).toContain('"Liberation Sans"');
  });

  it("uses the approved Morning Sky light-theme tokens", () => {
    expect(tokensCss).toContain("--color-bg: #f8fcff");
    expect(tokensCss).toContain("--color-text: #12384a");
    expect(tokensCss).toContain("--color-muted: #567485");
    expect(tokensCss).toContain("--color-cyan: #22a5d5");
    expect(tokensCss).toContain("--color-mint: #31c8aa");
    expect(baseCss).toContain("#e9f3ff");
    expect(baseCss).toContain("#edf9f6");
  });

  it("styles the Moonline Signature without an external font request", () => {
    expect(componentsCss).toMatch(/\.brand__signature\s*{/);
    expect(componentsCss).toMatch(/\.brand__moon\s*{/);
    expect(componentsCss).toContain('"Snell Roundhand"');
    expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
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
