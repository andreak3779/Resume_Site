# Resume Site Build Prompt

Create and maintain a resume website using the following technologies only:
- HTML5
- Bootstrap v5
- JavaScript (vanilla)
- CSS

## Goals
- Build a clean, responsive, and accessible resume site.
- Include sections for Home, Skills, Experience, and Education.
- Show completed Pluralsight courses in the Education tab using local JSON data.
- Keep the design professional, readable, and printer-friendly.
- Ensure the site deploys and runs correctly on GitHub Pages.

## Technical Requirements
- Use semantic HTML5 structure (`header`, `main`, `section`, `nav`, `footer`).
- Use Bootstrap v5 components and utility classes for layout and spacing.
- Use vanilla JavaScript for dynamic behavior and data rendering.
- Use custom CSS for branding, spacing refinement, and print styling.
- Do not use frontend frameworks (React, Angular, Vue) for this project.
- Keep the site fully static and compatible with GitHub Pages hosting.
- Use relative paths for local assets, scripts, styles, and JSON files.
- Do not require a build step, server runtime, backend API, or package installation for the site to function.
- Any external libraries must work directly in the browser from a stable CDN or be stored as static files in the repository.

## Data Requirements
- Use `data/Master_Resume.md` as the primary content source for resume details.
- Use `data/completed_courses_with_type.json` as the source for completed course data.
- Group courses by type (Course, Lab) and show totals.
- Ensure JSON loading works when hosted from GitHub Pages.

## Accessibility and UX
- Keep keyboard navigation intact.
- Preserve skip-link behavior.
- Ensure tab controls are accessible and screen-reader friendly.
- Maintain good contrast and readable font sizing.

## Output Expectations
- `index.html` contains complete and current resume content.
- `scripts/index.js` handles dynamic course rendering.
- `styles/style.css` and `styles/print.css` support both screen and print/PDF output.
- No broken layout, duplicate blocks, or console errors.
- The final site must work when deployed as a static GitHub Pages site.
