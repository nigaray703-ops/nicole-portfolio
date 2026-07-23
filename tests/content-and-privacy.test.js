import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  it("contains every required page region", () => {
    ["work", "capabilities", "experience", "about", "contact"].forEach((id) => {
      expect(html).toContain(`id="${id}"`);
    });
  });
});
