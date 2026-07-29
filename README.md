# Nicole Portfolio

Nicole Nikareayi’s public English-language portfolio for graduate and junior opportunities in business analysis, business systems, operations, implementation, product support, continuous improvement, and data quality.

## Live website

https://nicole-portfolio-ashen.vercel.app

## Purpose

The portfolio is designed to help recruiters understand Nicole’s professional positioning, capabilities, experience, education, and selected project work quickly.

It presents:

- Professional summary and current career focus
- Business analysis, product, operations, and reporting capabilities
- Experience in requirements, workflows, testing, stakeholder communication, and digital delivery
- Selected case studies and project evidence
- Public education, language, contact, and résumé information

## Selected work

- Career Command Center
- Nicole Universe
- Ko ahau te awa
- PawPal Health
- Tēnei Tērā

Only verified project information is included. The site does not use invented metrics, testimonials, links, or outcomes.

## Technology

- Semantic HTML
- Modular CSS
- Vanilla JavaScript
- Vite
- Vitest and JSDOM
- Vercel deployment

No UI framework is required.

## Project structure

```text
index.html
src/
  interactions/     Keyboard, navigation, motion, and case-study behaviour
  styles/           Tokens, base styles, components, layout, and responsive rules
public/
  case-studies/     Approved public project media
  Nicole_Nikareayi_CV.pdf
tests/              Interaction, content, motion, and privacy checks
scripts/            Public CV build support
```

## Local development

Requirements:

- Node.js
- pnpm

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Run the complete test suite:

```bash
pnpm test
```

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Accessibility

The interface includes:

- Semantic heading and landmark structure
- Keyboard-accessible navigation and case-study interactions
- Visible focus states
- Reduced-motion support
- Responsive mobile navigation
- Descriptive link and control labels
- Automated accessibility-related regression checks

## Privacy boundary

This repository is public and intentionally separate from the private Nicole Universe archive.

It must never contain:

- Private timeline, travel, school, collection, or memory records
- Owner administration code or private authentication logic
- Personal addresses, phone numbers, private email addresses, or identity documents
- Private photos, uploads, backups, data exports, or databases
- Passwords, tokens, API keys, recovery codes, or deployment secrets

Public portfolio content must never import, bundle, or fetch data from the private Nicole Universe application.

## Deployment

Production is built from the `main` branch and deployed through Vercel.

Before release:

1. Run the tests.
2. Run the production build.
3. Inspect the generated files for secrets and private data.
4. Check key routes, mobile layout, and the browser console.
5. Confirm the public résumé and case-study media are intentional.

## Related project

Nicole Universe is a separate, Owner-only personal digital archive. Its private records, uploads, administration features, and server-side permissions are not part of this repository.
