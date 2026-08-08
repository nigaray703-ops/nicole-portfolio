import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve("index.html"), "utf8");
const baseCss = readFileSync(resolve("src/styles/base.css"), "utf8");
const componentsCss = readFileSync(resolve("src/styles/components.css"), "utf8");
const layoutCss = readFileSync(resolve("src/styles/layout.css"), "utf8");
const responsiveCss = readFileSync(resolve("src/styles/responsive.css"), "utf8");
const tokensCss = readFileSync(resolve("src/styles/tokens.css"), "utf8");

function cssHexToken(css, name) {
  return css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
}

function pngDimensions(path) {
  const buffer = readFileSync(resolve(path));
  expect(buffer.subarray(1, 4).toString("ascii")).toBe("PNG");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

describe("public portfolio contract", () => {
  it("contains the approved public identity and role", () => {
    expect(html).toContain("Nicole Nikareayi");
    expect(html).toContain("Graduate Business Analyst for");
    expect(html).toContain("systems, data &amp; implementation.");
    expect(html).toContain("Auckland, New Zealand");
    expect(html).toContain("nigaray703@gmail.com");
    expect(html).toContain("linkedin.com/in/nikareayi-aisikaer");
  });

  it("omits private phone and Nicole Universe dependencies", () => {
    expect(html).not.toMatch(/\+64\s*2\d(?:[\s-]*\d){7,9}/);
    expect(html).not.toContain("nicole-universe");
    expect(html).not.toContain("owner-admin");
  });

  it("offers a privacy-safe public CV download", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const cvLink = document.querySelector('a[download][href="/Nicole_Nikareayi_CV.pdf"]');

    expect(cvLink).not.toBeNull();
    expect(cvLink.textContent.trim()).toBe("Download CV");
  });

  it("presents the four Master CV-backed primary case studies", () => {
    const document = new JSDOM(html).window.document;
    const titles = [...document.querySelectorAll("#work .project > h3")].map(
      (heading) => heading.textContent.trim(),
    );

    expect(titles).toEqual([
      "Technology Innovation Internship",
      "Career Command Center",
      "Harry Potter Knowledge Assistant",
      "Ana Tilim",
    ]);
  });

  it("keeps the verified internship journey evidence", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const internshipEvidence = document.querySelector(
      '#case-internship img[src="/case-studies/stemx500-user-journey.png"]',
    );

    expect(internshipEvidence?.getAttribute("alt")).toContain("user journey");
  });

  it("keeps the current-focus signal free of a numeric metric", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const signalCard = document.querySelector(".signal-card");

    expect(signalCard).not.toBeNull();
    expect(signalCard.textContent).toContain("Target focus");
    expect(signalCard.textContent).toContain("Business Analysis / Systems / Data / Implementation");
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
    const educationText = document.querySelector("#education").textContent;

    expect(experienceItems).toHaveLength(1);
    expect(document.querySelector("#education-title").textContent.trim()).toBe("Education");
    expect(document.querySelectorAll("#education .timeline > li")).toHaveLength(2);
    expect(educationText).not.toContain("Academic English");
    expect(educationText).not.toContain("Levels 7 and 8");
    expect(document.querySelector("#leadership-title").textContent.trim()).toBe(
      "Leadership & Community",
    );
    expect(document.querySelector("#education")).not.toBeNull();
    expect(document.querySelector("#leadership")).not.toBeNull();
  });

  it("contains current recruiter-facing project context", () => {
    [
      "Academic internship · A+ · Approximately 400 hours · Nov 2025–Feb 2026 · Wix",
      "Personal project · Jun 2026–Present · JavaScript · Supabase",
      "COMPX500 · A+ · Aug–Sep 2025 · Python · Pandas",
      "Personal project · Jul 2026–Present · JavaScript · Supabase",
    ].forEach((metadata) => expect(html).toContain(metadata));
  });

  it("uses scoped internship ownership and duration", () => {
    expect(html).toContain("student-led");
    expect(html).toContain("approximately 400 hours");
    expect(html).toContain("Owned the puzzle interaction");
    expect(html).not.toContain("400+ hours");
  });

  it("uses current evidence without conflicting course codes", () => {
    expect(html).toContain("16,245 rows");
    expect(html).toContain("464 interface states");
    expect(html).toContain("COMPX500 · A+");
    expect(html).not.toContain("MNNGT544");
    expect(html).not.toContain("MNMGT544");
  });

  it("publishes recruiter-relevant contact facts without the private phone", () => {
    expect(html).toContain("Full New Zealand work rights until 25 March 2029");
    expect(html).toContain("https://github.com/nigaray703-ops");
    expect(html).not.toMatch(/\+64\s*2\d(?:[\s-]*\d){7,9}/);
  });

  it("uses stable case identifiers for the selected evidence", () => {
    const document = new JSDOM(html).window.document;
    const ids = [...document.querySelectorAll("[data-case-trigger]")].map(
      (trigger) => trigger.dataset.caseTrigger,
    );

    expect(ids).toEqual([
      "internship",
      "career-command",
      "harry-potter",
      "ana-tilim",
    ]);
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
      "Role-aligned capabilities, each connected to evidence from real projects.",
    );
    expect(document.querySelector("#about .section-label").textContent.trim()).toBe("About");
  });

  it("maps every capability to named project evidence", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const capabilityCards = [
      ...document.querySelectorAll("#capabilities .capability-grid article"),
    ];

    expect(capabilityCards).toHaveLength(6);
    capabilityCards.forEach((card) => {
      expect(card.querySelector(".capability__evidence")?.textContent).toContain(
        "Evidence:",
      );
    });
  });

  it("declares the approved Orbit N favicon links", () => {
    const document = new JSDOM(html, { url: "http://localhost/" }).window.document;
    const icons = [...document.querySelectorAll('link[rel="icon"]')].map((link) => ({
      href: link.getAttribute("href"),
      sizes: link.getAttribute("sizes"),
      type: link.getAttribute("type"),
    }));

    expect(icons).toEqual([
      { href: "/nicole-portfolio-favicon.svg", sizes: null, type: "image/svg+xml" },
      { href: "/nicole-portfolio-favicon-32.png", sizes: "32x32", type: "image/png" },
      { href: "/nicole-portfolio-icon-192.png", sizes: "192x192", type: "image/png" },
    ]);
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    expect(apple?.getAttribute("href")).toBe("/nicole-portfolio-apple-touch-icon.png");
    expect(apple?.getAttribute("sizes")).toBe("180x180");
  });

  it("builds the approved Orbit N favicon asset family", () => {
    for (const path of [
      "public/nicole-portfolio-favicon.svg",
      "public/nicole-portfolio-favicon-32.png",
      "public/nicole-portfolio-icon-192.png",
      "public/nicole-portfolio-apple-touch-icon.png",
    ]) expect(existsSync(resolve(path))).toBe(true);

    expect(pngDimensions("public/nicole-portfolio-favicon-32.png")).toEqual({ width: 32, height: 32 });
    expect(pngDimensions("public/nicole-portfolio-icon-192.png")).toEqual({ width: 192, height: 192 });
    expect(pngDimensions("public/nicole-portfolio-apple-touch-icon.png")).toEqual({ width: 180, height: 180 });
    expect(readFileSync(resolve("public/nicole-portfolio-favicon.svg"), "utf8")).toContain("Orbit N");
  });

  it("keeps the About label style more specific than generic About paragraph rules", () => {
    expect(componentsCss).toMatch(
      /\.about \.section-label\s*{[^}]*color:\s*var\(--color-mint-strong\);[^}]*font-size:\s*0\.9rem;[^}]*}/s,
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

  it("provides accent text and gradient stops with readable normal-text contrast", () => {
    const white = "#ffffff";
    const background = cssHexToken(tokensCss, "--color-bg");
    const cyanStrong = cssHexToken(tokensCss, "--color-cyan-strong");
    const mintStrong = cssHexToken(tokensCss, "--color-mint-strong");

    expect(cyanStrong).toBeDefined();
    expect(mintStrong).toBeDefined();
    expect(contrastRatio(cyanStrong, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(mintStrong, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(cyanStrong, white)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(mintStrong, white)).toBeGreaterThanOrEqual(4.5);
    expect(componentsCss).toMatch(
      /\.button--primary\s*{[^}]*var\(--color-cyan-strong\)[^}]*var\(--color-mint-strong\)/s,
    );
  });

  it("keeps recruiter-facing navigation and action labels at least fourteen pixels", () => {
    const navRem = Number(
      layoutCss.match(/#primary-nav a[^}]*font-size:\s*([0-9.]+)rem/s)?.[1],
    );
    const buttonRem = Number(
      componentsCss.match(
        /\.button,\s*\n\[data-case-trigger\],[^}]*font-size:\s*([0-9.]+)rem/s,
      )?.[1],
    );

    expect(navRem * 16).toBeGreaterThanOrEqual(14);
    expect(buttonRem * 16).toBeGreaterThanOrEqual(14);
  });

  it("keeps technical metadata legible without relying on sub-twelve-pixel text", () => {
    const projectMetaRem = Number(
      componentsCss.match(/\.project__meta\s*{[^}]*font-size:\s*([0-9.]+)rem/s)?.[1],
    );
    const signalCardRem = Number(
      componentsCss.match(/\.signal-card\s*{[^}]*font-size:\s*([0-9.]+)rem/s)?.[1],
    );

    expect(projectMetaRem * 16).toBeGreaterThanOrEqual(12);
    expect(signalCardRem * 16).toBeGreaterThanOrEqual(12);
  });

  it("uses a compact destination-heading focus treatment instead of a full-width frame", () => {
    expect(baseCss).toMatch(
      /\.section h2\[tabindex="-1"\]:focus-visible\s*{[^}]*width:\s*fit-content;[^}]*outline-width:\s*2px;/s,
    );
  });

  it("gives the mobile menu an opaque elevated surface and readable labels", () => {
    const mobileMenu = responsiveCss.match(
      /\.js #primary-nav\s*{([\s\S]*?)\n\s*}/,
    )?.[1];

    expect(mobileMenu).toMatch(/background:\s*var\(--color-bg\);/);
    expect(mobileMenu).toMatch(/box-shadow:/);
    expect(responsiveCss).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*#primary-nav a\s*{[^}]*font-size:\s*0\.875rem;/,
    );
  });

  it("uses compact mobile section and project spacing for recruiter scanning", () => {
    const narrowMobile = responsiveCss.match(
      /@media \(max-width:\s*680px\)\s*{([\s\S]*)\n}/,
    )?.[1];

    expect(narrowMobile).toMatch(/--space-section:\s*3\.25rem;/);
    expect(narrowMobile).toMatch(
      /\.project h3,[\s\S]*\.project--featured h3\s*{[^}]*margin-top:\s*1\.25rem;/s,
    );
    expect(narrowMobile).toMatch(
      /\.capability-grid article\s*{[^}]*min-height:\s*auto;[^}]*padding:\s*1rem;/s,
    );
    expect(narrowMobile).toMatch(
      /\.hero__portrait img,[\s\S]*\.portrait-fallback\s*{[^}]*height:\s*14rem;/s,
    );
  });

  it("renders project cards as a balanced desktop grid without an oversized featured card", () => {
    const dom = new JSDOM(html, { url: "http://localhost/" });
    const style = dom.window.document.createElement("style");
    style.textContent = `${layoutCss}\n${componentsCss}`;
    dom.window.document.head.append(style);

    const projectList = dom.window.document.querySelector(".project-list");
    const featuredProject = dom.window.document.querySelector(".project--featured");
    const regularProject = dom.window.document.querySelector(
      ".project:not(.project--featured)",
    );
    const featuredHeading = featuredProject.querySelector("h3");
    const regularHeading = regularProject.querySelector("h3");

    const projectListStyle = dom.window.getComputedStyle(projectList);
    const featuredStyle = dom.window.getComputedStyle(featuredProject);
    const regularStyle = dom.window.getComputedStyle(regularProject);
    const featuredHeadingStyle = dom.window.getComputedStyle(featuredHeading);
    const regularHeadingStyle = dom.window.getComputedStyle(regularHeading);

    expect(projectListStyle.gridTemplateColumns).toBe(
      "repeat(2, minmax(0, 1fr))",
    );
    expect(featuredStyle.gridRow).toBe("auto");
    expect(featuredStyle.minHeight).toBe(regularStyle.minHeight);
    expect(featuredHeadingStyle.marginTop).toBe(regularHeadingStyle.marginTop);
  });

  it("keeps collapsed project cards equal-height within each desktop row", () => {
    expect(layoutCss).toMatch(
      /\.project-list\s*{[^}]*align-items:\s*stretch;/s,
    );
    expect(componentsCss).toMatch(
      /\.project\s*{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s,
    );
    expect(componentsCss).toMatch(
      /\.project > \[data-case-trigger\]\s*{[^}]*margin-top:\s*auto;/s,
    );
  });

  it("uses a full-width two-column evidence layout for expanded desktop cases", () => {
    expect(layoutCss).toMatch(
      /\.project--expanded\s*{[^}]*grid-column:\s*1\s*\/\s*-1;/s,
    );
    expect(componentsCss).toMatch(
      /\.project--expanded \.case-panel--evidence\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*0\.85fr\)\s*minmax\(0,\s*1\.15fr\);/s,
    );
    expect(responsiveCss).toMatch(
      /@media \(max-width:\s*900px\)[\s\S]*\.project--expanded \.case-panel--evidence\s*{[^}]*grid-template-columns:\s*1fr;/s,
    );
  });

  it("renders the site header edge to edge while keeping its content padded", () => {
    const dom = new JSDOM(html, { url: "http://localhost/" });
    const style = dom.window.document.createElement("style");
    style.textContent = layoutCss;
    dom.window.document.head.append(style);

    const headerStyle = dom.window.getComputedStyle(
      dom.window.document.querySelector(".site-header"),
    );

    expect(headerStyle.width).toBe("100%");
    expect(headerStyle.marginInline).toBe("0");
    expect(headerStyle.paddingInline).not.toBe("");
    expect(headerStyle.paddingInline).not.toBe("0");
  });

  it("keeps the contact headline on one line at desktop widths", () => {
    const dom = new JSDOM(html, { url: "http://localhost/" });
    const style = dom.window.document.createElement("style");
    style.textContent = componentsCss;
    dom.window.document.head.append(style);

    const contactHeadingStyle = dom.window.getComputedStyle(
      dom.window.document.querySelector(".contact h2"),
    );

    expect(contactHeadingStyle.maxWidth).toBe("none");
    expect(contactHeadingStyle.whiteSpace).toBe("nowrap");
    expect(responsiveCss).toMatch(
      /@media \(max-width:\s*680px\)[\s\S]*\.contact h2\s*{[^}]*white-space:\s*normal;/,
    );
  });

  it("gives the contact introduction enough width to render in two lines", () => {
    expect(componentsCss).toMatch(
      /\.contact\s*>\s*p\s*{[^}]*max-width:\s*40rem;/,
    );
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
