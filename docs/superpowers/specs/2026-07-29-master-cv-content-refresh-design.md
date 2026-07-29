# Nicole Portfolio Master CV Content Refresh Design

**Date:** 2026-07-29  
**Status:** Approved in conversation, pending written-spec review  
**Product:** Public English-language recruiter portfolio for Nicole Nikareayi  
**Source of truth:** `Nicole_Nikareayi_Master_CV.docx`, last supplied 2026-07-29

## 1. Goal

Update the existing portfolio and downloadable public CV so that both reflect
the latest Master CV, strengthen recruiter-facing evidence, and remove factual
conflicts without changing the established visual identity or exposing private
information.

The refresh must:

- preserve the existing light visual system, navigation, portrait and
  case-study interactions;
- retain the focused Graduate Business Analyst positioning;
- correct course-code, ownership and internship-duration conflicts;
- replace outdated or vague project evidence with current, verifiable work;
- update capability evidence to match the strongest current projects;
- add recruiter-relevant GitHub and New Zealand work-rights information;
- regenerate a concise public CV without the Master CV phone number;
- keep Nicole Portfolio separate from Nicole Universe private archive content.

## 2. Considered Approaches

### A. Minimal factual correction

Only fix course codes and wording conflicts. This is low risk but leaves the
site materially behind the Master CV and continues to understate Nicole's
systems, data and implementation evidence.

### B. Focused recruiter refresh — selected

Keep the current site structure and four-case-study model, but replace weaker
or outdated evidence with the strongest current projects. This gives recruiters
clearer proof without turning the site into a seven-page CV.

### C. Full Master CV mirror

Add every project, role, skill and credential. This would be comprehensive but
too dense for a recruiter portfolio and would duplicate the Master CV instead
of curating it.

## 3. Public Content Boundary

Public content may include:

- Auckland, New Zealand;
- `nigaray703@gmail.com`;
- LinkedIn and GitHub profile links;
- Open Post-Study Work Visa and full New Zealand work rights until
  25 March 2029;
- CV-backed education, experience, projects, skills and verified test counts;
- privacy-safe public demos and public GitHub repositories.

Public content must not include:

- phone number;
- street or detailed residential address;
- real job-application records or private user data;
- private Nicole Universe archive content, identity documents, recovered media,
  credentials or owner-admin implementation details;
- unverified production, authentication, cloud-sync or deployment claims.

## 4. Positioning and Contact

Retain the current hero:

> Graduate Business Analyst for systems, data & implementation.

Retain the current explanatory line and target-focus categories because they
match the Master CV's recruiter direction.

Update the Contact section to include:

- GitHub;
- `Full New Zealand work rights until 25 March 2029`.

Do not add the phone number from the Master CV.

## 5. Selected Case Studies

Keep four primary case studies and the current expandable structure:

`Challenge → My Role → Approach → Outcome → Evidence Produced → Skills Applied`

### 5.1 Technology Innovation Internship

- Label: `01 / Internship`
- Metadata: `Academic internship · A+ · Approximately 400 hours · Nov 2025–Feb 2026 · Wix`
- Name the delivered prototype `Ko ahau te awa`.
- Describe it as a student-led project.
- State that Nicole owned the puzzle interaction and supported the map, story,
  responsive Wix layouts, testing, documentation and coordination.
- Do not claim sole ownership of the complete website.
- Replace `400+ hours` with `approximately 400 hours`.
- Remove public `STEMX500` references unless independently confirmed later.

### 5.2 Career Command Center

- Label: `02 / Business System`
- Title: `Career Command Center`
- Subtitle: `Bilingual Job Application Tracker`
- Metadata: `Personal project · Jun 2026–Present · JavaScript · Supabase`
- Describe business rules, workflow stages, data fields, dashboard metrics,
  conversion indicators, search, A–Z navigation, filtering, sorting and grouping.
- State that the private version uses Google authentication and user-scoped
  Supabase data access.
- State that the public demo uses fictional records, simulated sign-in and no
  cloud access.
- Add the public demo and GitHub links from the Master CV.

### 5.3 Harry Potter Knowledge Assistant

- Label: `03 / Data & AI`
- Metadata: `COMPX500 · A+ · Aug–Sep 2025 · Python · Pandas`
- Describe source integration, schema cleaning, duplicate removal, alias
  management and linked subject tables.
- Include the verified `16,245 rows` result and constrained upload bundle with
  validation checks.
- Explain the scoped librarian persona, explicit uncertainty and cloud/local
  model comparison without presenting it as a production AI service.

### 5.4 Ana Tilim

- Label: `04 / Learning Platform`
- Metadata: `Personal project · Jul 2026–Present · JavaScript · Supabase`
- Describe multilingual curriculum data, RTL support, human-recorded audio,
  listening and dictation, offline progress, backup and restore.
- State that authentication and UID-scoped Supabase synchronisation use Row
  Level Security.
- Include the verified runner covering `464 interface states`.
- Add the live site and GitHub links from the Master CV.

PawPal Health and GlobeMate will no longer be primary case studies. Their
Master CV evidence remains available in the downloadable public CV if space
allows. This avoids the PawPal course-code conflict (`COMPX500` on the current
site versus `ENGME585` in the Master CV) and the conflicting GlobeMate course
codes (`MNNGT544` versus `MNMGT544`) without publishing an unverified code.

## 6. Capabilities

Retain six capability cards while updating their evidence:

1. **Requirements & Functional Analysis**  
   Evidence: Technology Innovation Internship · Career Command Center

2. **Business Systems & Application Support**  
   Evidence: Career Command Center · Ana Tilim

3. **Data Quality & Reporting**  
   Evidence: Harry Potter Knowledge Assistant · Career Command Center

4. **Implementation Coordination**  
   Evidence: Technology Innovation Internship · Ana Tilim

5. **Testing & Continuous Improvement**  
   Evidence: Ana Tilim 464-state verification · Nicole Portfolio 52 tests ·
   Nigar Kiz 26 tests

6. **Stakeholder Communication**  
   Evidence: Internship · Leadership roles · Multidisciplinary projects

Claims must remain concise and use only Master CV-supported evidence.

## 7. Experience and Education

### Experience

Retain the single academic internship entry. Replace `STEMX500 · 400+ hours`
with:

> University of Waikato · Academic, A+ · Approximately 400 hours

Update the summary to mention requirements, puzzle interaction ownership,
platform comparison, responsive Wix implementation, testing, documentation and
delivery.

### Education

Use year-only ranges to match the Master CV:

- Master of Technology Innovation in Business, Distinction | 2025–2026
- Certificates of Attainment in Academic English, Levels 7 and 8 | 2024–2025
- Bachelor of Management (Accounting) | 2020–2024

## 8. About and Leadership

Retain the current About and the two existing leadership entries. Do not add
the COVID-19 volunteer role to the web page because it is lower priority for
the target roles and would increase page length.

The About copy may name language learning as an interest because Ana Tilim now
provides direct evidence.

## 9. Public CV

Regenerate `artifacts/Nicole_Nikareayi_Public_CV.docx` and
`public/Nicole_Nikareayi_CV.pdf` from the existing deterministic builder.

The public CV must:

- remain two pages if legibility can be preserved;
- use the same public contact boundary as the website;
- correct internship ownership and duration;
- use `ENGME585` for PawPal Health if PawPal is retained;
- omit the GlobeMate course code unless confirmed;
- prioritise Career Command Center, Ana Tilim, Harry Potter Knowledge
  Assistant and Cash Safety Assistant;
- include current systems, data, cloud, testing and application skills;
- preserve a professional, recruiter-scannable hierarchy.

The DOCX must be rendered to page images and every page visually inspected
before publication. The PDF must be generated from the verified DOCX.

## 10. Interaction and Visual Boundaries

- Do not redesign the page or add a new framework.
- Preserve the current four-card grid and progressive-enhancement case panels.
- Preserve keyboard behaviour, focus return, Escape handling and no-JavaScript
  readability.
- Use text links inside case panels only where the Master CV supplies public
  URLs.
- Reuse existing CSS patterns; add only the minimum link styling needed.
- Preserve desktop and mobile responsive behaviour and avoid horizontal
  overflow.

## 11. Testing and Release

Implementation will follow test-first changes:

1. Add failing content/privacy tests for the new case studies, corrected
   internship wording, work rights, GitHub link and forbidden phone number.
2. Add failing case-study structure tests for the four new case IDs.
3. Update HTML and CV builder to satisfy the tests.
4. Regenerate DOCX and PDF.
5. Run all Vitest tests and the Vite production build.
6. Render and inspect every public CV page.
7. Run browser QA at desktop and mobile viewports:
   - page identity;
   - meaningful content;
   - no framework overlay;
   - console health;
   - one case-study open/close interaction;
   - no horizontal overflow;
   - screenshot evidence.
8. Review the final diff for privacy and unsupported claims.
9. Commit the reviewed changes, push to `main`, wait for Vercel deployment and
   recheck the production site and downloadable CV.

## 12. Success Criteria

- The website has no PawPal or GlobeMate course-code conflicts.
- The internship is represented as student-led work with approximately
  400 hours and scoped ownership.
- The four primary case studies are Internship, Career Command Center,
  Harry Potter Knowledge Assistant and Ana Tilim.
- Work rights and GitHub are visible without exposing the phone number.
- Capability evidence points to current, verifiable work.
- The downloadable public CV reflects the 2026 Master CV and remains
  privacy-safe.
- Automated tests, production build, DOCX render inspection, desktop QA and
  mobile QA pass.
- The final Vercel production page and CV download are verified after deploy.
