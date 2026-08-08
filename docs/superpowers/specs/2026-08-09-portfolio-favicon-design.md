# Nicole Portfolio Favicon Design

## Objective

Replace the intentionally blank favicon (`data:,`) with a distinctive, recruiter-appropriate icon that remains legible in browser tabs and matches the existing Morning Sky visual identity.

## Approved Direction

Use the selected **A · Orbit N** concept:

- a light blue-to-mint rounded-square background;
- a cyan-to-mint orbital line;
- one mint-green orbital point;
- a deep navy capital `N` at the centre.

The icon must be geometric and simplified for small-size legibility. It must use only Portfolio-owned artwork and assets.

## Deliverables

- A primary SVG favicon with a square viewBox.
- A 32 × 32 PNG fallback for browser compatibility.
- A 192 × 192 PNG icon.
- A 180 × 180 Apple Touch Icon.
- Updated `<head>` favicon declarations in `index.html`.

All assets live inside the Nicole Portfolio project and use Portfolio-specific filenames.

## Integration

Replace the blank favicon declaration with explicit SVG, PNG fallback, and Apple Touch Icon links. Keep the page title, content, styling, downloadable CV, and deployment configuration unchanged.

## Quality and Testing

- Automated checks confirm the blank favicon is gone, every declared icon exists, and raster dimensions are correct.
- Visual QA confirms the `N`, orbit, and mint point remain distinguishable at 16–32 px.
- Local and production browser checks confirm the custom icon appears, the page loads without console errors, and no layout or interaction changes occur.

## Boundaries

- No phone number, private archive data, or assets from another site enter the public Portfolio repository.
- No redesign of the header brand, page layout, or portfolio content.
- Deployment remains GitHub `main` to the existing Vercel project.
