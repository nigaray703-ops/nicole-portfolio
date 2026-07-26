# Nicole Portfolio Light Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh Nicole Portfolio with the approved Moonline Signature logo, Morning Sky Gradient theme, recruiter-focused content structure, and corrected accessible interactions.

**Architecture:** Preserve the existing static Vite application and its progressive-enhancement modules. Update semantic content in `index.html`, centralise the light visual system in the existing CSS token/component files, and make narrow behaviour changes in the existing case-study and mobile-navigation modules. Extend the current Vitest/JSDOM contracts before each production change.

**Tech Stack:** Semantic HTML, modular CSS, vanilla JavaScript ES modules, Vite 7, Vitest 3, JSDOM.

## Global Constraints

- Modify the existing application; do not rebuild or add a framework.
- Preserve `public/nicole-headshot.jpg`.
- Use no external font, analytics, tracking, hosting, or new runtime dependency.
- Keep phone number, visa details, private Nicole Universe references, unredacted CV, and real tracker data out of the public site.
- Use only claims supported by the approved CV content.
- Keep the site English-first.
- Keep no-JavaScript case-study content readable.
- Do not publish, push, or deploy.
- Use the bundled Node runtime at `/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.

---

## File Map

- `index.html`: public content, semantic page order, Moonline Signature markup, project metadata, career sections.
- `src/styles/tokens.css`: approved light colour tokens and shared design values.
- `src/styles/base.css`: page gradient, analytical grid, global light-theme behaviour.
- `src/styles/layout.css`: career/identity two-column group layout and responsive section structure.
- `src/styles/components.css`: logo, cards, portrait, timeline, contact, buttons, and light-theme states.
- `src/styles/responsive.css`: mobile navigation surface, logo sizing, career stacks, and breakpoint comfort.
- `src/interactions/case-studies.js`: accessible case open/close focus behaviour.
- `src/interactions/mobile-nav.js`: active-section clearing and Escape-to-close behaviour.
- `tests/content-and-privacy.test.js`: public content, structure, logo, theme, and privacy contracts.
- `tests/case-studies.test.js`: case-study focus and close regression coverage.
- `tests/mobile-nav.test.js`: active state and mobile Escape regression coverage.

---

### Task 1: Recruiter-Focused Content and Semantic Structure

**Files:**
- Modify: `tests/content-and-privacy.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing semantic region IDs and JSDOM content-contract pattern.
- Produces: `#education`, `#leadership`, `.brand__signature`, `.brand__surname`, `.brand__moon`, `.project__meta`, and revised career-region order for styling and navigation.

- [ ] **Step 1: Replace obsolete structure expectations with failing public-content contracts**

Add focused tests that parse the real `index.html`:

```js
it("uses the approved Moonline Signature identity", () => {
  const document = new JSDOM(html).window.document;
  const brand = document.querySelector(".brand");

  expect(brand.querySelector(".brand__signature").textContent.trim()).toBe("Nicole");
  expect(brand.querySelector(".brand__surname").textContent.trim()).toBe("Nikareayi");
  expect(brand.querySelector(".brand__moon").getAttribute("aria-hidden")).toBe("true");
});

it("separates experience, education, leadership, and about", () => {
  const document = new JSDOM(html).window.document;
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
  [
    "user stories",
    "functional specification support",
    "pivot tables",
    "PowerPoint",
    "requirements documentation",
  ].forEach((term) => expect(html).toContain(term));
});
```

Update the existing region test to require:

```js
["work", "capabilities", "experience", "education", "leadership", "about", "contact"]
```

Remove the obsolete assertion that Experience and About must be direct siblings in the original two-item order.

- [ ] **Step 2: Run the content test and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vitest/vitest.mjs run tests/content-and-privacy.test.js
```

Expected: FAIL because the new logo markup, sections, metadata, and revised copy do not exist.

- [ ] **Step 3: Implement the approved HTML content**

In `index.html`:

1. Replace the brand text with:

```html
<a class="brand" href="#top" aria-label="Nicole Nikareayi portfolio home">
  <span class="brand__signature">Nicole</span>
  <span class="brand__surname">Nikareayi</span>
  <span class="brand__moon" aria-hidden="true"></span>
</a>
```

2. Add `Education` to the primary navigation after Experience.

3. Change current focus to:

```html
<aside class="signal-card">
  <span>Current focus</span>
  <p>Business Analysis / Process / Product / AI</p>
</aside>
```

4. Add the exact `.project__meta` lines from the tests beneath each project index.

5. Replace GlobeMate’s outcome with the approved evidence-safe sentence.

6. Replace the six capability cards with the approved capability groups and exact evidence terms.

7. Restructure the lower page:

```html
<div class="profile-layout profile-layout--career">
  <section class="section" id="experience" aria-labelledby="experience-title">
    <!-- internship only -->
  </section>
  <section class="section" id="education" aria-labelledby="education-title">
    <!-- Master and Bachelor -->
  </section>
</div>
<div class="profile-layout profile-layout--identity">
  <section class="section" id="leadership" aria-labelledby="leadership-title">
    <!-- Arts Committee Chair and Ethnic Minority Liaison -->
  </section>
  <section class="section about" id="about" aria-labelledby="about-title">
    <p class="section-label" data-reveal>About</p>
    <h2 id="about-title" data-reveal>Curious about people. Precise about systems.</h2>
    <div data-reveal>
      <p>I connect business thinking, human-centred design and technology innovation to turn complex ideas into clear requirements, workflows and practical digital solutions.</p>
      <p>My multicultural background supports thoughtful communication across teams and a strong interest in inclusive technology, cultural storytelling and language learning.</p>
    </div>
  </section>
</div>
```

Use the exact dates and metrics from the spec. Keep the existing contact links and privacy exclusions.

- [ ] **Step 4: Run the focused content test and verify GREEN**

Run the command from Step 2.

Expected: all `content-and-privacy` tests PASS.

- [ ] **Step 5: Commit the content structure**

```bash
git add index.html tests/content-and-privacy.test.js
git commit -m "feat: strengthen portfolio career content"
```

---

### Task 2: Moonline Signature and Morning Sky Visual System

**Files:**
- Modify: `tests/content-and-privacy.test.js`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/responsive.css`

**Interfaces:**
- Consumes: Task 1’s logo and section class names.
- Produces: approved light-theme CSS tokens and responsive visual treatment.

- [ ] **Step 1: Add failing visual-token and logo-style contracts**

Add:

```js
const baseCss = readFileSync(resolve("src/styles/base.css"), "utf8");

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
```

- [ ] **Step 2: Run the visual contract and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vitest/vitest.mjs run tests/content-and-privacy.test.js
```

Expected: FAIL on the dark tokens and missing Moonline styles.

- [ ] **Step 3: Implement the light tokens and page background**

Set the approved tokens in `tokens.css`, including:

```css
--color-bg: #f8fcff;
--color-surface: rgba(255, 255, 255, 0.78);
--color-surface-raised: #ffffff;
--color-text: #12384a;
--color-muted: #567485;
--color-cyan: #22a5d5;
--color-mint: #31c8aa;
--color-line: rgba(31, 128, 165, 0.2);
--color-focus: #075985;
```

In `base.css`, replace the dark background with the approved three-layer Morning Sky gradient and retain a lower-opacity analytical grid.

- [ ] **Step 4: Restyle the existing components without changing their roles**

In `components.css`:

- implement `.brand__signature`, `.brand__surname`, and `.brand__moon`;
- convert project cards and signal card to translucent white surfaces;
- use navy text, cyan metadata, and mint accents;
- lighten portrait border/shadow and preserve the source photo;
- keep primary buttons high contrast with a cyan-to-mint background;
- keep secondary buttons readable on light surfaces;
- style `.project__meta`;
- extend the heading accent rule to `#education-title` and `#leadership-title`;
- keep the shared timeline language for all career sections;
- restyle contact as a stronger light sky-to-mint band.

In `layout.css`, preserve the two-column `.profile-layout` family for both career and identity groups.

In `responsive.css`, move the mobile-navigation breakpoint from `680px` to `760px` so the six-link navigation switches before it becomes cramped. Keep the hero’s compact-phone typography and portrait rules in a separate `680px` media query, and keep all new section groups stacked at the existing `900px` tablet breakpoint.

- [ ] **Step 5: Run the focused visual/content tests and verify GREEN**

Run the command from Step 2.

Expected: all focused tests PASS.

- [ ] **Step 6: Commit the visual system**

```bash
git add src/styles tests/content-and-privacy.test.js
git commit -m "feat: add moonlight portfolio visual system"
```

---

### Task 3: Case Study Focus Behaviour

**Files:**
- Modify: `tests/case-studies.test.js`
- Modify: `src/interactions/case-studies.js`

**Interfaces:**
- Consumes: existing `initCaseStudies(root)` API and data attributes.
- Produces: opening without a focus jump; closing and Escape still restore trigger focus.

- [ ] **Step 1: Change the opening-focus test to the approved behaviour**

Replace the first test’s final focus assertion:

```js
it("opens the controlled panel without jumping focus to the close button", () => {
  const trigger = document.querySelector("[data-case-trigger]");
  const panel = document.querySelector("[data-case-panel]");
  trigger.focus();
  trigger.click();

  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(panel.hidden).toBe(false);
  expect(document.activeElement).toBe(trigger);
});
```

Keep the existing close-button and Escape focus-restoration tests.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vitest/vitest.mjs run tests/case-studies.test.js
```

Expected: FAIL because `open()` currently focuses the close button.

- [ ] **Step 3: Implement the minimal focus fix**

In `open(trigger)`, remove:

```js
panel.querySelector("[data-case-close]").focus();
```

Do not change the existing close or Escape behaviour.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2.

Expected: all case-study tests PASS.

- [ ] **Step 5: Commit the interaction fix**

```bash
git add src/interactions/case-studies.js tests/case-studies.test.js
git commit -m "fix: keep focus at expanded case trigger"
```

---

### Task 4: Navigation Active State and Mobile Escape

**Files:**
- Modify: `tests/mobile-nav.test.js`
- Modify: `src/interactions/mobile-nav.js`

**Interfaces:**
- Consumes: existing `initMobileNav(root, Observer)` signature.
- Produces: tracked intersecting targets, cleared stale active state, and Escape-to-close cleanup.

- [ ] **Step 1: Add failing navigation regression tests**

Add:

```js
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
```

- [ ] **Step 2: Run the focused navigation tests and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vitest/vitest.mjs run tests/mobile-nav.test.js
```

Expected: FAIL because stale active state is never cleared and Escape is not handled.

- [ ] **Step 3: Track visible targets and clear stale state**

In `initMobileNav`:

```js
const clearActive = () => {
  links.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });
};
```

Create a `visibleTargets` map before the observer. In the observer callback, update each entry’s current intersection state, choose the highest-ratio visible target, call `setActive(id)` when one exists, and call `clearActive()` when none exists.

- [ ] **Step 4: Add Escape behaviour and cleanup**

Add:

```js
const onKeydown = (event) => {
  if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
  setOpen(false);
  toggle.focus();
};
```

Attach it to `root` and remove it in the returned cleanup function.

- [ ] **Step 5: Run the focused navigation tests and verify GREEN**

Run the command from Step 2.

Expected: all mobile-navigation tests PASS.

- [ ] **Step 6: Commit the navigation fixes**

```bash
git add src/interactions/mobile-nav.js tests/mobile-nav.test.js
git commit -m "fix: stabilize portfolio navigation state"
```

---

### Task 5: Full Verification and Browser QA

**Files:**
- Verify: all changed files
- Save QA screenshots under: `/private/tmp/nicole-portfolio-light-refresh-*`

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: fresh automated and visual evidence for final handoff.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vitest/vitest.mjs run
```

Expected: all test files PASS with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  node_modules/vite/bin/vite.js build
```

Expected: exit code 0 and generated `dist` assets.

- [ ] **Step 3: Run repository checks**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional state remains.

- [ ] **Step 4: Verify the live portfolio in the in-app browser**

Use the existing `http://127.0.0.1:5173/` preview. Capture and inspect:

1. Hero with Moonline Signature and Morning Sky background.
2. Project grid.
3. Expanded internship case.
4. Capabilities.
5. Experience and Education.
6. Leadership and About.
7. Contact.

Confirm:

- portrait loads with non-zero natural dimensions;
- no horizontal overflow;
- no console errors or warnings;
- opening a case keeps focus at the trigger;
- closing a case and Escape restore focus correctly;
- active navigation clears at the page top;
- all navigation links reach their semantic destinations;
- contact email and LinkedIn href values remain correct.

- [ ] **Step 5: Inspect accepted screenshots**

Open every saved screenshot at original resolution. Reject and recapture any blank, loading, cropped, or wrong-state image.

- [ ] **Step 6: Commit any QA-only correction**

If browser QA finds a defect, add a failing regression test, implement the narrow fix, repeat the full verification, and commit with a specific `fix:` message. If QA finds no defect, do not create an empty commit.
