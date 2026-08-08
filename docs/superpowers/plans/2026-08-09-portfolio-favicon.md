# Nicole Portfolio Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blank Nicole Portfolio browser icon with the approved A · Orbit N favicon and publish it to the existing Vercel site.

**Architecture:** Keep one hand-authored SVG as the scalable source and use a deterministic Pillow builder to produce the three raster sizes. HTML declares the SVG first, then PNG fallbacks and the Apple Touch Icon; Vitest enforces the asset contract and dimensions.

**Tech Stack:** Static HTML, SVG, Python 3 with Pillow, Vitest/JSDOM, Vite, GitHub `main`, Vercel.

## Global Constraints

- Use only Portfolio-owned artwork and assets.
- Preserve the existing Morning Sky palette and all page content, layout, CV files, and deployment configuration.
- Do not add phone numbers, private archive data, or assets from another site.
- Produce SVG, 32 × 32 PNG, 192 × 192 PNG, and 180 × 180 Apple Touch Icon outputs.
- Use TDD: observe the favicon contract fail before adding assets or changing `index.html`.

---

### Task 1: Define the Orbit N asset contract

**Files:**
- Modify: `tests/content-and-privacy.test.js:1-4,214-220`
- Create: `public/nicole-portfolio-favicon.svg`
- Create: `scripts/build_favicons.py`
- Create by builder: `public/nicole-portfolio-favicon-32.png`
- Create by builder: `public/nicole-portfolio-icon-192.png`
- Create by builder: `public/nicole-portfolio-apple-touch-icon.png`

**Interfaces:**
- Consumes: the approved Orbit N geometry and existing Portfolio palette.
- Produces: four public icon assets and a deterministic `build_favicons.py` entry point.

- [ ] **Step 1: Replace the blank-favicon test with the failing public asset contract**

Update the Node import and add a PNG header reader:

```js
import { existsSync, readFileSync } from "node:fs";

function pngDimensions(path) {
  const buffer = readFileSync(resolve(path));
  expect(buffer.subarray(1, 4).toString("ascii")).toBe("PNG");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}
```

Replace the existing `declares an inline favicon` test with:

```js
it("publishes the approved Orbit N favicon family", () => {
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
  expect(document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href"))
    .toBe("/nicole-portfolio-apple-touch-icon.png");

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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PATH="/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin" pnpm exec vitest run tests/content-and-privacy.test.js
```

Expected: FAIL because `index.html` still declares `data:,` and the four icon files do not exist.

- [ ] **Step 3: Create the exact scalable Orbit N source**

Create `public/nicole-portfolio-favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Nicole Portfolio Orbit N favicon">
  <title>Nicole Portfolio Orbit N</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9f8ff"/><stop offset="1" stop-color="#eafbf5"/></linearGradient>
    <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22a5d5"/><stop offset="1" stop-color="#31c8aa"/></linearGradient>
  </defs>
  <rect x="2" y="2" width="92" height="92" rx="24" fill="url(#bg)" stroke="#b8dce8" stroke-width="2"/>
  <ellipse cx="48" cy="48" rx="35" ry="18" transform="rotate(-24 48 48)" fill="none" stroke="url(#orbit)" stroke-width="4"/>
  <circle cx="78" cy="31" r="5" fill="#31c8aa"/>
  <path d="M31 68V28h8l19 26V28h8v40h-8L39 42v26z" fill="#123a4b"/>
</svg>
```

- [ ] **Step 4: Create the deterministic Pillow raster builder**

Create `scripts/build_favicons.py` with these public outputs and font-free `N` geometry:

```python
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = {
    "nicole-portfolio-favicon-32.png": 32,
    "nicole-portfolio-icon-192.png": 192,
    "nicole-portfolio-apple-touch-icon.png": 180,
}

def scale_box(box, factor):
    return tuple(round(value * factor) for value in box)

def interpolate(first, second, amount):
    return tuple(round(a + (b - a) * amount) for a, b in zip(first, second))

def build_icon(size):
    factor = size * 4 / 96
    canvas_size = size * 4
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    pixels = image.load()
    for y in range(canvas_size):
        for x in range(canvas_size):
            amount = (x + y) / (2 * (canvas_size - 1))
            pixels[x, y] = (*interpolate((233, 248, 255), (234, 251, 245), amount), 255)

    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(scale_box((2, 2, 94, 94), factor), radius=round(24 * factor), fill=255)
    transparent = Image.new("RGBA", image.size, (0, 0, 0, 0))
    image = Image.composite(image, transparent, mask)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(scale_box((2, 2, 94, 94), factor), radius=round(24 * factor), outline="#b8dce8", width=max(1, round(2 * factor)))

    orbit = Image.new("RGBA", image.size, (0, 0, 0, 0))
    orbit_draw = ImageDraw.Draw(orbit)
    orbit_box = scale_box((13, 30, 83, 66), factor)
    orbit_width = max(1, round(4 * factor))
    orbit_draw.ellipse(orbit_box, outline="#22a5d5", width=orbit_width)
    orbit_draw.arc(orbit_box, start=190, end=350, fill="#31c8aa", width=orbit_width)
    orbit = orbit.rotate(24, center=(canvas_size // 2, canvas_size // 2), resample=Image.Resampling.BICUBIC)
    image.alpha_composite(orbit)
    draw = ImageDraw.Draw(image)
    draw.ellipse(scale_box((73, 26, 83, 36), factor), fill="#31c8aa")
    draw.polygon([scale_box(point, factor) for point in [(31, 28), (39, 28), (66, 58), (66, 68), (58, 68), (31, 38)]], fill="#123a4b")
    draw.rectangle(scale_box((31, 28, 39, 68), factor), fill="#123a4b")
    draw.rectangle(scale_box((58, 28, 66, 68), factor), fill="#123a4b")
    return image.resize((size, size), Image.Resampling.LANCZOS)

def main():
    public = ROOT / "public"
    public.mkdir(parents=True, exist_ok=True)
    for filename, size in OUTPUTS.items():
        build_icon(size).save(public / filename, format="PNG", optimize=True)

if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Generate the raster assets**

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH="/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python" /Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/build_favicons.py
```

Expected: the three PNG files exist at the exact dimensions in `OUTPUTS`.

### Task 2: Wire the favicon family into the Portfolio

**Files:**
- Modify: `index.html:11`
- Test: `tests/content-and-privacy.test.js`

**Interfaces:**
- Consumes: the four assets produced by Task 1.
- Produces: browser-discoverable icon declarations at stable root-relative URLs.

- [ ] **Step 1: Replace the blank declaration with explicit icon links**

Replace `<link rel="icon" href="data:,">` with:

```html
<link rel="icon" type="image/svg+xml" href="/nicole-portfolio-favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/nicole-portfolio-favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/nicole-portfolio-icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/nicole-portfolio-apple-touch-icon.png">
```

- [ ] **Step 2: Run the focused test and verify GREEN**

Run the Task 1 focused Vitest command again.

Expected: PASS, including the Orbit N asset contract.

- [ ] **Step 3: Run the complete test and build gates**

Run:

```bash
PATH="/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin" pnpm test
PATH="/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin" pnpm build
git diff --check
```

Expected: all Vitest files pass, Vite exits 0, and `git diff --check` is silent.

- [ ] **Step 4: Commit the focused Portfolio change**

```bash
git add index.html tests/content-and-privacy.test.js scripts/build_favicons.py public/nicole-portfolio-favicon.svg public/nicole-portfolio-favicon-32.png public/nicole-portfolio-icon-192.png public/nicole-portfolio-apple-touch-icon.png
git commit -m "Add Orbit N portfolio favicon"
```

### Task 3: Visual QA and Portfolio release

**Files:**
- Verify: `index.html`
- Verify: `public/nicole-portfolio-favicon.svg`
- Verify: three generated PNG assets

**Interfaces:**
- Consumes: the committed Portfolio favicon family.
- Produces: verified local rendering and a GitHub-to-Vercel production update.

- [ ] **Step 1: Inspect the icon at favicon sizes**

Open the SVG, 32 px PNG, 192 px PNG, and Apple Touch Icon. Confirm the rounded background, orbit, mint point, and central `N` are visible, centred, unclipped, and recognisable at 32 px.

- [ ] **Step 2: Run local browser QA**

Start Vite on `127.0.0.1`, load the page, and verify:

- page identity and title are correct;
- the page is not blank and has no framework overlay;
- console warnings/errors are empty;
- all four icon URLs return successfully;
- desktop and mobile layout remain unchanged;
- `clientWidth === scrollWidth`.

- [ ] **Step 3: Integrate into `main` and rerun tests on the merged result**

Use the repository's isolated-worktree integration flow, merge only the focused favicon commit into `main`, then rerun `pnpm test` and `pnpm build` from the main checkout.

- [ ] **Step 4: Push and verify Vercel production**

```bash
git push origin main
```

Verify `https://nicole-portfolio-ashen.vercel.app/` references the new favicon URLs, every asset returns HTTP 200 with the expected content type, and production has no relevant console error or horizontal overflow.
