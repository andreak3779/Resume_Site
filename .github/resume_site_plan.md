# Resume Site Implementation Plan

Date: 2026-03-29
Project: Resume_Site

## 1. Objective

Update the Resume Site so it consistently reflects the resume details, including:
- Professional summary
- Skills
- Professional experience
- Education and training
- Completed Pluralsight courses shown in the Education tab

## 2. Current Workspace Snapshot

- Main page: `index.html`
- Styles: `styles/style.css`, `styles/print.css`
- Script: `scripts/index.js`
- Master resume source: `data/Master_Resume.md`
- Course data source: `data/completed_courses_with_type.json`
- Legacy/raw Pluralsight export: `data/pluralsightcourses.html`
- README with project overview: `README.md`
- Hosting target: GitHub Pages

## 3. Scope

In scope:
- Bring all resume content sections into a clean, maintainable structure in `index.html`
- Ensure Skills and Experience sections are complete and aligned with resume text
- Populate Education tab with Pluralsight completed courses from JSON
- Keep print/PDF behavior working
- Improve the user interface for readability, navigation, and professional presentation
- Keep all assets and runtime behavior compatible with GitHub Pages static hosting

Out of scope (for this phase):
- Backend or database
- Authentication
- Replatforming to React/Angular

## 4. User Interface Plan

### UI Goals

- Present the resume as a professional, modern, and easy-to-scan single-page site
- Make key information visible quickly on desktop and mobile
- Keep navigation simple, accessible, and consistent
- Preserve strong print and PDF output quality

### Planned Layout

- Header section with name, role title, contact information, LinkedIn, and GitHub
- Main navigation using Bootstrap v5 tabs for Home, Skills, Experience, and Education
- Home tab focused on professional summary and career highlights
- Skills tab grouped into categories such as Frontend, Backend, Database, DevOps and Tools, and Cloud and Platforms
- Experience tab using clearly separated job sections with company, location, date range, and outcome-focused bullets
- Education tab combining formal education with dynamically rendered Pluralsight courses and summary totals

### Visual Design Direction

- Use Bootstrap v5 layout and spacing utilities for alignment and responsiveness
- Keep the visual style clean and professional with restrained colors and strong contrast
- Use heading hierarchy, spacing, and subtle section containers to improve scanability
- Use badges or grouped lists for skills where they improve readability
- Avoid overly dense text blocks by increasing whitespace between major sections

### Color Scheme

- Use the Urban Chic palette as the site color system
- Base dark colors:
  - `#22223B` for primary headings, navigation emphasis, and strong contrast areas
  - `#4A4E69` for secondary surfaces, tab accents, and section headers
- Supporting light colors:
  - `#F2E9E4` for page background or light content surfaces
  - `#C9ADA7` for subtle accents, borders, highlight blocks, and secondary emphasis
- Neutral handling:
  - Keep body text dark and highly legible against light backgrounds
  - Reserve the darkest tones for high-priority content and interactive states

### Color Usage Guidance

- Use `#F2E9E4` or white-adjacent surfaces as the main reading background to preserve readability
- Use `#22223B` for the site title, major headings, and important labels
- Use `#4A4E69` for tab styling, section bands, and card accents
- Use `#C9ADA7` sparingly for hover states, badges, dividers, or callout emphasis
- Avoid large heavy dark blocks that reduce print readability or make long-form content feel dense
- Maintain accessible contrast for text and interactive states across all palette combinations

### Responsive and Accessibility Expectations

- Ensure header content and tab navigation stack cleanly on smaller screens
- Keep interactive elements keyboard accessible
- Preserve skip-link behavior and visible focus states
- Ensure tabs use correct accessible naming and state handling
- Keep typography readable on both mobile and desktop

### GitHub Pages Deployment Constraints

- The site must work as a fully static site hosted on GitHub Pages
- Use only browser-compatible HTML, CSS, and vanilla JavaScript with no server-side dependencies
- Use relative paths for local scripts, styles, images, and JSON files so the site works when hosted from a repository path
- Do not require a build step, Node runtime, backend API, or package installation to render the site
- Any external library must work directly in the browser through stable CDN delivery or be committed as a static asset in the repository
- Data loading for the Education tab must use static JSON fetch behavior compatible with GitHub Pages hosting
- Avoid features that depend on custom headers, server rewrites, or dynamic routing

### Print and PDF Expectations

- Remove non-essential interface elements from print where appropriate
- Keep section breaks clean and avoid awkward page breaks inside experience entries
- Ensure Education tab content remains readable when exported to PDF

## 5. Implementation Plan

### Phase 1 - Content Alignment and Structure Cleanup

Tasks:
1. Audit `index.html` sections for Home, Experience, and Education tab panes using `data/Master_Resume.md` as the primary content source.
2. Remove duplicate or malformed HTML fragments from mixed XHTML export content.
3. Normalize section headings and list structure for readability and maintenance.
4. Verify all core resume details are present and in the right tab.
5. Restructure the page into clear UI regions that support the planned header, tabs, and content sections.

Acceptance criteria:
- Page renders without broken layout or duplicated blocks.
- Home, Experience, and Education tabs all open and display expected content.
- Resume summary, key skills, and role history are visible and coherent.
- Page structure supports a clean and consistent UI.

### Phase 2 - Skills and Experience Finalization

Tasks:
1. Curate and organize skills into meaningful groups (for example: Languages, Frameworks, Tools, Cloud).
2. Ensure experience entries include role title, company, location, dates, and bullet achievements.
3. Keep wording concise and results-focused.
4. Format skills and experience so recruiters can scan the most important information quickly.

Acceptance criteria:
- Skills section is easy to scan and complete.
- Experience section has consistent formatting and no missing date ranges.
- Skills and experience have clear visual hierarchy.

### Phase 3 - Education Tab: Pluralsight Integration

Tasks:
1. Use `data/completed_courses_with_type.json` as the source of truth.
2. Add logic in `scripts/index.js` to fetch and render courses into the Education tab.
3. Render grouped views by `pluralsight_course_type` (Course, Lab).
4. Add total counts (for example: total completed, course count, lab count).
5. Handle fetch failures gracefully (fallback message when data is unavailable).
6. Ensure the JSON path and rendering logic work correctly when the site is hosted on GitHub Pages.

Suggested HTML target:
- Add a container in the Education tab such as `#pluralsight-courses` for dynamic rendering.

Acceptance criteria:
- Education tab shows completed Pluralsight courses from JSON data.
- Grouping and counts are visible and accurate.
- Site remains usable if JSON cannot be loaded.
- Course rendering works from GitHub Pages without requiring a backend.

### Phase 4 - Styling and Print/PDF Consistency

Tasks:
1. Add styles for header layout, contact details, section spacing, skills groups, and course list/group headers in `styles/style.css`.
2. Use Bootstrap v5 utility classes and custom CSS to improve spacing, hierarchy, and responsive behavior.
3. Apply the Urban Chic color palette consistently through CSS variables or a small set of reusable style rules.
4. Ensure Education content remains readable in print via `styles/print.css`.
5. Verify existing PDF export button still captures the updated Education content.

Acceptance criteria:
- New course content is readable on desktop and print.
- PDF export still works with updated tab content.
- The interface is polished, readable, and responsive.
- The Urban Chic palette is applied consistently without hurting readability or accessibility.

### Phase 5 - Validation and Content QA

Tasks:
1. Run a manual checklist for each tab.
2. Confirm no console errors when loading data and switching tabs.
3. Validate links and contact information.
4. Cross-check final text against latest resume copy.
5. Validate the site using GitHub Pages-compatible relative paths and static hosting assumptions.

Acceptance criteria:
- No blocking UI or script errors.
- Resume site accurately represents skills, experience, and completed training.
- Site behavior remains correct when deployed to GitHub Pages.

## 6. Proposed Data Rendering Model

Use this lightweight model at runtime:

- Input: array of objects from JSON
  - `pluralsight_course_name`
  - `pluralsight_course_type`

- Transform:
  1. Sort alphabetically by course name.
  2. Group by course type.
  3. Compute totals.

- Output in Education tab:
  - Training summary row (total/courses/labs)
  - Group sections (Course, Lab)
  - Course list items

## 7. Definition of Done

The project is done when:
1. Resume content in Home/Experience reflects the latest resume details.
2. Skills section is complete and clearly organized.
3. Education tab displays completed Pluralsight training from JSON.
4. Print and PDF output remain correct.
5. README references how Pluralsight data is sourced and displayed.
6. The UI is responsive, accessible, and visually consistent.
7. All scripts, assets, and data loading work under GitHub Pages static hosting.

## 8. Next Execution Steps

1. Implement Phase 1 (content cleanup in `index.html`).
2. Implement Phase 3 (dynamic Pluralsight rendering in `scripts/index.js`).
3. Apply styling updates in `styles/style.css` and print adjustments in `styles/print.css`.
4. Perform QA pass and update `README.md` with data-flow notes.
