# Resume Website

A clean, responsive static resume website for Andrea Kaplen built with HTML5, Bootstrap v5, vanilla JavaScript, and CSS. The site is automatically deployed to GitHub Pages and includes dynamic course rendering and print-to-PDF functionality.

## Project description

A lightweight, static resume site built with semantic HTML5, Bootstrap v5 components, and vanilla JavaScript. The site dynamically renders completed Pluralsight courses from JSON data, includes responsive design, professional styling, and a print stylesheet for PDF export. Key features:
- Responsive navigation and layout with Bootstrap v5
- Dynamic course rendering from [data/completed_courses_with_type.json](site/data/completed_courses_with_type.json)
- Resume content sourced from [data/Master_Resume.md](data/Master_Resume.md)
- Print-friendly styles for exporting as PDF
- Automatic deployment to GitHub Pages via GitHub Actions

## Project structure

```
├── README.md                           — this file
├── data/
│   ├── Master_Resume.md                — resume content source
│   └── pluralsightcourses.html         — archived course data
├── site/                               — deployed site folder
│   ├── .nojekyll                       — disable Jekyll processing for GitHub Pages
│   ├── index.html                      — main resume page
│   ├── data/
│   │   └── completed_courses_with_type.json  — course data by type
│   ├── scripts/
│   │   └── index.js                    — DOM helpers and course rendering
│   └── styles/
│       ├── style.css                   — site styles
│       └── print.css                   — print and PDF styles
├── .github/
│   ├── copilot-instructions.md         — Copilot build guidelines
│   └── workflows/
│       └── deploy.yml                  — GitHub Pages deployment workflow
└── .vscode/                            — VS Code workspace settings
```

## Deployment

The site is automatically deployed to GitHub Pages on every commit to the `main` branch via GitHub Actions. The workflow:
1. Checks out the code
2. Uploads only the `site/` folder as a GitHub Pages artifact  
3. Deploys the artifact to GitHub Pages

**Live site**: Visit your GitHub Pages URL (e.g., `https://<username>.github.io/Resume_Site/`)

## How to view

### Online
- Visit the live GitHub Pages site: `https://<username>.github.io/Resume_Site/`

### Locally
1. Open [site/index.html](site/index.html) in a browser, or
2. Run a local static server from the project root:

   ```sh
   python3 -m http.server 8000
   # then open http://localhost:8000/site/
   ```

## Technologies

- **HTML5** — semantic markup
- **Bootstrap v5** — responsive component framework
- **Vanilla JavaScript** — dynamic course rendering
- **CSS** — custom branding and layout refinement
- **GitHub Pages** — static site hosting
- **GitHub Actions** — automated deployment

## Content sources

- Resume details: [data/Master_Resume.md](data/Master_Resume.md)
- Course data: [site/data/completed_courses_with_type.json](site/data/completed_courses_with_type.json) (grouped by type: Course, Lab)

## Accessibility & UX

- Semantic HTML5 structure for screen readers
- Keyboard navigation support
- Skip-link functionality
- Responsive design for all screen sizes
- Print-friendly layout for PDF export
- Good color contrast and readable font sizing

## Acknowledgements

- This project uses Bootstrap v5 for responsive layouts
- GitHub Pages for static site hosting
- GitHub Copilot for AI-assisted development