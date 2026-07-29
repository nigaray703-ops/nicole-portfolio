# Nicole Portfolio Master CV Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Nicole Portfolio and its downloadable public CV with the 2026-07-29 Master CV while preserving the existing design, interactions and privacy boundary.

**Architecture:** Keep the current static Vite application and progressive-enhancement modules. Update semantic content in `index.html`, extend the existing Vitest/JSDOM content contracts, update the deterministic Python DOCX builder, then generate and visually verify the public DOCX/PDF before browser QA and release.

**Tech Stack:** Semantic HTML, existing modular CSS, vanilla JavaScript ES modules, Vite 7, Vitest 3, JSDOM, Python, python-docx, LibreOffice renderer.

## Global Constraints

- Preserve the existing visual system, portrait, four-card layout, navigation and interactions.
- Use only claims present in `Nicole_Nikareayi_Master_CV.docx`.
- Keep the public site English-first.
- Do not publish the Master CV phone number or a detailed address.
- Do not publish real job-application data or private Nicole Universe archive content.
- Preserve no-JavaScript case-study readability and keyboard behaviour.
- Do not add a framework, runtime dependency, analytics, tracker or external font.
- Use `ENGME585` for PawPal if PawPal appears in the public CV.
- Omit the GlobeMate course code unless independently confirmed.
- Use the bundled Node and Python runtimes.

---

## File Map

- `index.html`: public positioning, four selected case studies, capability evidence, experience, education and contact content.
- `tests/content-and-privacy.test.js`: recruiter-facing content and privacy contracts.
- `tests/case-studies.test.js`: four case identifiers and interaction regressions.
- `scripts/build_public_cv.py`: deterministic two-page public CV content and output.
- `tests/test_public_cv.py`: generated DOCX content and privacy verification.
- `artifacts/Nicole_Nikareayi_Public_CV.docx`: generated public CV source.
- `public/Nicole_Nikareayi_CV.pdf`: generated downloadable CV.

---

### Task 1: Establish the Isolated Baseline

**Files:**
- Inspect: `package.json`
- Inspect: `.npmrc`

**Interfaces:**
- Consumes: existing pnpm lockfile and Vitest test suite.
- Produces: installed worktree dependencies and a recorded clean baseline.

- [ ] **Step 1: Install locked dependencies offline**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm install --offline --frozen-lockfile
```

- [ ] **Step 2: Run the complete existing test suite**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm test
```

Expected: 52 tests pass before content changes.

---

### Task 2: Replace Outdated Website Evidence

**Files:**
- Modify: `tests/content-and-privacy.test.js`
- Modify: `tests/case-studies.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing semantic section IDs, `.project` markup and `data-case-*` interaction contract.
- Produces: `internship`, `career-command`, `harry-potter` and `ana-tilim` case panels.

- [ ] **Step 1: Add failing public-content and privacy tests**

Add tests that parse the real `index.html` and assert:

```js
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

it("uses scoped internship ownership and duration", () => {
  expect(html).toContain("student-led");
  expect(html).toContain("approximately 400 hours");
  expect(html).toContain("Owned the puzzle interaction");
  expect(html).not.toContain("400+ hours");
});

it("publishes recruiter-relevant contact facts without the private phone", () => {
  expect(html).toContain("Full New Zealand work rights until 25 March 2029");
  expect(html).toContain("https://github.com/nigaray703-ops");
  expect(html).not.toContain("+64 20 476 4396");
});

it("uses current evidence without conflicting course codes", () => {
  expect(html).toContain("16,245 rows");
  expect(html).toContain("464 interface states");
  expect(html).not.toContain("COMPX500");
  expect(html).not.toContain("MNNGT544");
  expect(html).not.toContain("MNMGT544");
});
```

Update the case-study fixtures to require:

```js
["internship", "career-command", "harry-potter", "ana-tilim"]
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm test -- tests/content-and-privacy.test.js tests/case-studies.test.js
```

Expected: FAIL because the current page still contains PawPal, GlobeMate, the old tracker and old internship claims.

- [ ] **Step 3: Implement the approved HTML content**

In `index.html`:

- retain the existing hero and design structure;
- replace the four project cards with the approved cases and exact scoped claims;
- add public demo/GitHub links for Career Command Center and Ana Tilim;
- update the six capability evidence lines;
- update the internship timeline to `Academic, A+ · Approximately 400 hours`;
- use year-only education ranges and add Academic English certificates;
- add GitHub and work-rights information to Contact;
- keep the phone number and private archive content absent.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the command from Step 2.

Expected: all focused tests pass.

- [ ] **Step 5: Run the complete JavaScript test suite**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm test
```

Expected: all tests pass.

---

### Task 3: Regenerate the Privacy-Safe Public CV

**Files:**
- Create: `tests/test_public_cv.py`
- Modify: `scripts/build_public_cv.py`
- Regenerate: `artifacts/Nicole_Nikareayi_Public_CV.docx`
- Regenerate: `public/Nicole_Nikareayi_CV.pdf`

**Interfaces:**
- Consumes: the existing deterministic CV builder and bundled python-docx/PDF tooling.
- Produces: a two-page public DOCX and PDF aligned with the Master CV.

- [ ] **Step 1: Write the failing generated-document test**

Create `tests/test_public_cv.py` using `unittest` and `python-docx`:

```python
from pathlib import Path
import unittest
from docx import Document


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DOCX = ROOT / "artifacts" / "Nicole_Nikareayi_Public_CV.docx"


class PublicCvContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        document = Document(PUBLIC_DOCX)
        cls.text = "\n".join(paragraph.text for paragraph in document.paragraphs)

    def test_includes_current_selected_evidence(self):
        for expected in (
            "Career Command Center",
            "Ana Tilim",
            "Harry Potter Knowledge Assistant",
            "16,245 rows",
            "464 interface states",
        ):
            self.assertIn(expected, self.text)

    def test_uses_current_academic_and_internship_facts(self):
        self.assertIn("Approximately 400 hours", self.text)
        self.assertNotIn("400+ hours", self.text)
        if "PawPal Health" in self.text:
            self.assertIn("ENGME585", self.text)
            self.assertNotIn("COMPX500", self.text)
        self.assertNotIn("MNMGT544", self.text)
        self.assertNotIn("MNNGT544", self.text)

    def test_preserves_public_privacy_boundary(self):
        self.assertIn("Full New Zealand work rights until 25 March 2029", self.text)
        self.assertNotIn("+64 20 476 4396", self.text)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the document contract and verify RED**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m unittest tests/test_public_cv.py -v
```

Expected: FAIL because the current generated DOCX lacks Ana Tilim and Harry Potter evidence and still contains old facts.

- [ ] **Step 3: Update the deterministic CV builder**

Update `scripts/build_public_cv.py` to:

- use approximately 400 internship hours and scoped student-project ownership;
- prioritise Career Command Center, Ana Tilim, Harry Potter Knowledge Assistant and Cash Safety Assistant;
- use `ENGME585` for PawPal if retained;
- omit the GlobeMate course code;
- include updated technical skills without inventing production claims;
- preserve the existing public contact boundary and two-page layout target.

- [ ] **Step 4: Run the CV builder**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/build_public_cv.py
```

Expected: the DOCX and PDF are regenerated at the existing paths.

- [ ] **Step 5: Run the document contract and verify GREEN**

Run the command from Step 2.

Expected: all document contract tests pass.

---

### Task 4: Verify the Public CV Visually

**Files:**
- Inspect: `artifacts/Nicole_Nikareayi_Public_CV.docx`
- Inspect: `public/Nicole_Nikareayi_CV.pdf`

**Interfaces:**
- Consumes: regenerated DOCX/PDF.
- Produces: render evidence for every page.

- [ ] **Step 1: Render the DOCX to page PNGs**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  /Users/nigarayaskar/.codex/plugins/cache/openai-primary-runtime/documents/26.727.11326/skills/documents/render_docx.py \
  artifacts/Nicole_Nikareayi_Public_CV.docx \
  --output_dir /private/tmp/nicole-public-cv-refresh \
  --emit_pdf
```

- [ ] **Step 2: Inspect every rendered page**

Confirm:

- exactly two pages;
- no clipping, overlap, missing glyphs or broken bullets;
- section headings and contact lines are legible;
- no phone number is visible;
- the PDF generated by the builder matches the verified DOCX.

- [ ] **Step 3: Iterate if the render is not clean**

Adjust spacing or content density in `scripts/build_public_cv.py`, rebuild, rerun the document contract and re-render until clean.

---

### Task 5: Build and Browser-QA the Frontend

**Files:**
- Verify: all changed website and CV files.

**Interfaces:**
- Consumes: updated source and public PDF.
- Produces: production build plus desktop/mobile rendered evidence.

- [ ] **Step 1: Run the production build**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm build
```

Expected: Vite build exits 0.

- [ ] **Step 2: Start the local preview**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm preview
```

- [ ] **Step 3: Run desktop Browser checks**

The flow under test is:

`local homepage → open a selected case study → case content expands → close the case → focus and layout remain correct`.

Verify page identity, meaningful DOM, no framework overlay, console health,
full-page screenshot, all four case titles and zero horizontal overflow.

- [ ] **Step 4: Run mobile Browser checks**

At a phone-sized viewport, verify page identity, menu open/close, case-study
open/close, readable wrapping, no overlap and zero horizontal overflow.

---

### Task 6: Final Verification and Production Release

**Files:**
- Review: complete Git diff.

**Interfaces:**
- Consumes: verified implementation on `agent/cv-content-refresh`.
- Produces: merged `main`, GitHub push and verified Vercel production release.

- [ ] **Step 1: Run the complete verification gate**

Run:

```bash
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm test
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m unittest tests/test_public_cv.py -v
/Users/nigarayaskar/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm build
git diff --check
```

- [ ] **Step 2: Review privacy and claim scope**

Inspect the final diff and confirm:

- no phone number;
- no real tracker records;
- no private archive content;
- no unsupported authentication, sync, deployment or ownership claims.

- [ ] **Step 3: Commit the implementation**

Stage only the intended files and commit:

```bash
git commit -m "Refresh portfolio from master CV"
```

- [ ] **Step 4: Merge into main and push**

Fast-forward local `main` to the verified branch and push `main` to `origin`.

- [ ] **Step 5: Verify Vercel production**

Wait for the GitHub-triggered Vercel deployment, then verify:

- production page loads;
- four new case studies are live;
- work rights and GitHub are present;
- the phone number is absent;
- `/Nicole_Nikareayi_CV.pdf` loads and shows the updated two-page public CV;
- production console has no relevant errors.
