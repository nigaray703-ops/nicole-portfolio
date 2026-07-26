# Nicole Portfolio Light Refresh Design

**Date:** 2026-07-26  
**Status:** Approved in conversation, pending written-spec review  
**Product:** Public English-language job-search portfolio for Nicole Nikareayi  
**Primary audience:** New Zealand recruiters and hiring managers for Graduate Business Analyst roles

## 1. Goal

Refresh the existing portfolio without rebuilding it. The result should remain recognisably technical and analytical while becoming brighter, more personal, and easier to scan during recruitment.

The refresh must:

- replace the dark navy visual system with the selected light “Morning Sky Gradient” direction;
- replace the plain `Nicole.` brand with the selected “Moonline Signature” identity;
- connect the logo to the meaning of Nigaray: “a woman or loved one beautiful like the moon”;
- strengthen Business Analyst evidence across projects and capabilities;
- separate professional experience from education;
- add concise leadership evidence;
- fix the case-study focus jump and stale active-navigation state;
- preserve the current portrait, page structure, interactions, responsive behaviour, and privacy boundary.

## 2. Selected Visual Direction

### 2.1 Logo: Moonline Signature

The navigation brand becomes a two-part wordmark:

- `Nicole` in a restrained signature-style type treatment;
- `Nikareayi` as a small supporting name;
- a thin moon orbit extending from the final stroke of `Nicole`.

The moon orbit is decorative and must be hidden from assistive technology. The visible text remains real HTML so the name is selectable, readable, and accessible.

The signature font stack will use locally available system fonts only:

```css
"Snell Roundhand", "Segoe Script", "Bradley Hand", cursive
```

No external font request or tracking dependency will be added. The mark must still remain legible when the first-choice script font is unavailable.

### 2.2 Background: Morning Sky Gradient

The site background uses the approved light sky direction:

```css
radial-gradient(circle at 78% 22%, rgba(88, 205, 189, 0.17), transparent 27%),
radial-gradient(circle at 8% 85%, rgba(76, 160, 219, 0.13), transparent 30%),
linear-gradient(145deg, #e9f3ff 0%, #f8fcff 52%, #edf9f6 100%)
```

A very subtle analytical grid remains in the background to preserve the current technology character.

### 2.3 Core Colour Tokens

- Page background: `#f8fcff`
- Primary text: `#12384a`
- Muted text: `#567485`
- Surface: `rgba(255, 255, 255, 0.78)`
- Raised surface: `#ffffff`
- Cyan accent: `#22a5d5`
- Mint accent: `#31c8aa`
- Border: `rgba(31, 128, 165, 0.20)`
- Focus outline: `#075985`
- Primary-button text: `#ffffff`

All text and interactive states must meet WCAG AA contrast. Decorative gradients must never be the only mechanism communicating state.

## 3. Information Architecture

The primary navigation becomes:

1. Work
2. Capabilities
3. Experience
4. Education
5. About
6. Contact

The visible page order becomes:

1. Hero
2. Selected Case Studies
3. Capabilities
4. Experience
5. Education
6. Leadership & Community
7. About
8. Contact

Experience, Education, and Leadership & Community should share one visual timeline family while remaining clearly separate semantic sections.

## 4. Content Changes

### 4.1 Hero

Keep the approved headline:

> Turning signals into structured decisions.

Keep the Graduate Business Analyst positioning and the original portrait.

Update the current-focus text to prioritise recruitment relevance:

> Business Analysis / Process / Product / AI

### 4.2 Selected Case Studies

Keep the four approved projects and the current case-study structure:

`Challenge → My Role → Approach → Outcome → Skills Applied`

Add concise metadata before each description:

#### Technology Innovation Internship

- University of Waikato
- STEMX500
- 400+ hours
- Nov 2025–Feb 2026
- Wix

#### PawPal Health

- University of Waikato
- COMPX500
- Sep–Oct 2025
- Proto.io

#### GlobeMate

- University of Waikato
- MNNGT544
- Jul–Oct 2025
- Multidisciplinary team

Replace the current GlobeMate outcome with:

> Contributed to business-case development and concept validation within a multidisciplinary team.

This avoids overstating individual ownership.

#### AI-assisted Job Application Tracker

- Personal project
- Workflow design
- AI-assisted web development

Do not add a public demo link or screenshot containing real application data. Any future public screenshot must use fake data.

### 4.3 Capabilities

Use six recruiter-oriented capability groups:

1. **Business Analysis**  
   Requirements gathering, stakeholder interviews, process mapping, workflow modelling, gap analysis, user stories, and functional specification support.

2. **Research & Insight**  
   Qualitative research, journey mapping, market research, customer segmentation, and insight synthesis.

3. **Digital Product**  
   Product ideation, MVP definition, prototyping, feature logic, and solution evaluation.

4. **Data & Office Tools**  
   Excel data cleaning, sorting, filtering, basic formulas, and pivot tables; Word documentation; PowerPoint presentations.

5. **Communication**  
   Requirements documentation, presentation delivery, stakeholder communication, feedback synthesis, and multicultural collaboration.

6. **Design & Technology Tools**  
   Figma, Miro, Proto.io, Wix, basic HTML, foundational Python, and AI-assisted workflows.

### 4.4 Experience

Experience contains only:

**Technology Innovation Internship**  
University of Waikato · STEMX500 · 400+ hours  
Nov 2025–Feb 2026

Supporting copy should state that Nicole translated conceptual requirements into user journeys and interaction flows, evaluated platform constraints, and delivered a responsive prototype and presentation.

### 4.5 Education

Create a separate Education section:

**Master of Technology Innovation in Business**  
University of Waikato · Distinction  
Feb 2025–Feb 2026

**Bachelor of Management (Accounting)**  
Dalian Jiaotong University  
Sep 2020–Jul 2024

The Academic English Programme, high-school exchange, and other older education details remain omitted to keep the portfolio focused.

### 4.6 Leadership & Community

Add two concise entries:

**Arts Committee Chair**  
Dalian Jiaotong University · Mar 2021–Sep 2023  
Planned and delivered campus events with 100+ participants and coordinated cross-functional teams.

**Ethnic Minority Liaison**  
Dalian Jiaotong University · Sep 2020–Jul 2024  
Supported communication and coordination for 30+ ethnic-minority students and maintained structured records.

The COVID-19 volunteer role remains omitted to control page length.

### 4.7 About

Retain the existing human-centred and multicultural positioning. Tighten the wording so it supports the Business Analyst role rather than reading as a list of interests.

Do not add ethnicity, languages, visa status, phone number, or a street address in this refresh.

### 4.8 Contact and Privacy

Keep:

- Auckland, New Zealand
- `nigaray703@gmail.com`
- `linkedin.com/in/nikareayi-aisikaer`

Do not add:

- phone number;
- visa expiry or work-rights details;
- private Nicole Universe references;
- an unredacted CV download;
- any real Job Application Tracker records.

## 5. Layout and Components

### 5.1 Header

Use a translucent light surface with a subtle bottom border. The Moonline Signature lockup replaces the current `Nicole.` text while keeping the existing brand link and accessible home label.

### 5.2 Hero

Preserve the two-column desktop composition and stacked tablet/mobile composition. Restyle the portrait frame with a white surface, pale cyan shadow, and low-opacity orbit decoration.

### 5.3 Project Cards

Retain the current asymmetric grid. Convert cards to bright translucent surfaces with navy text, cyan metadata, mint highlights, and subtle blue shadows. Do not invent project screenshots or metrics.

### 5.4 Timeline Family

Experience, Education, and Leadership & Community use the same vertical-line and glowing-node language. Each section has its own heading and semantic region.

### 5.5 Contact

Use a slightly stronger sky-to-mint gradient band so the final call to action remains visually distinct from the page background.

## 6. Interaction Behaviour

### 6.1 Case Studies

- The trigger keeps `aria-expanded` and `aria-controls`.
- Opening a case reveals the content without moving focus directly to the bottom close button.
- The trigger remains the focus owner after opening.
- Closing by button or Escape returns focus to the trigger.
- Only one case is open at a time.
- The no-JavaScript fallback remains readable.

### 6.2 Navigation

- Active state uses both colour and underline.
- When the viewport is above the Work section, no section navigation link is marked current.
- Selecting a mobile link closes the menu and moves focus to the destination heading.
- Escape closes the mobile menu and restores focus to the toggle.
- The mobile-menu breakpoint should be raised if needed so the six navigation links never feel cramped.

### 6.3 Motion

Keep the current reveal motion and reduced-motion fallback. Light-theme shadows and gradients must not introduce additional continuous animation.

## 7. Responsive and Accessibility Requirements

- No horizontal overflow at desktop, tablet, or mobile widths.
- Minimum interactive target height remains 44px.
- Keyboard focus is clearly visible on light surfaces.
- Heading order remains one H1 followed by section H2 headings and card H3 headings.
- The portrait retains meaningful alt text.
- Decorative moon and orbit elements are hidden from assistive technology.
- The page remains usable without JavaScript.
- Mobile navigation works with pointer and keyboard input.

## 8. Implementation Boundaries

- Modify the existing HTML, CSS, and JavaScript; do not rebuild the project.
- Preserve the original portrait file.
- Do not add external fonts, analytics, trackers, dependencies, hosting, or deployment.
- Do not modify Nicole Universe or any owner-admin project.
- Do not add unverified metrics, screenshots, links, or project claims.
- Do not publish or push changes unless separately requested.

## 9. Testing Strategy

Follow test-driven development for content and interaction changes:

1. Add failing content-contract tests for:
   - Moonline Signature name and decorative moon treatment;
   - Education and Leadership & Community regions;
   - Experience containing only the internship;
   - exact project metadata;
   - GlobeMate’s corrected outcome;
   - privacy exclusions;
   - light-theme token values.

2. Add failing interaction tests for:
   - opening a case without focus jumping to the close button;
   - Escape closing an open case and restoring trigger focus;
   - clearing stale active navigation above Work;
   - Escape closing the mobile menu.

3. Implement the smallest changes that pass the tests.

4. Run the full test suite and production build.

5. Verify in the in-app browser at the available viewport:
   - hero, logo, portrait, cases, capabilities, timelines, about, and contact;
   - open and close a case;
   - navigation active state;
   - image load and console state;
   - horizontal overflow.

6. Save and visually inspect the final browser screenshots before handoff.

## 10. Acceptance Criteria

The refresh is complete only when:

- the selected Moonline Signature logo is visible and legible;
- the selected Morning Sky Gradient replaces the dark theme across all regions;
- all approved content changes are present and accurate;
- Experience and Education are separate;
- Leadership & Community is present;
- GlobeMate no longer overstates ownership;
- case opening no longer jumps focus to the close control;
- active navigation is not stale at the top of the page;
- privacy exclusions remain enforced;
- all automated tests and the production build pass;
- browser screenshots show no visible layout defect or horizontal overflow.
