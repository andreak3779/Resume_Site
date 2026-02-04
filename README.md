# Resume Website

A simple, static resume website for Andrea Kaplen built with HTML and CSS. The site is generated from an XHTML export and includes a small script to export the main content to PDF.

## Project description

A lightweight, static resume site generated from an XHTML export and styled for screen and print. The site presents skills and experience with badge-style UI, includes a print stylesheet, and supports client-side PDF export using the [`html2pdf`](scripts/index.js) integration. Key files:
- Main page: [index.html](index.html)
- Alternate export: [Andrea_Resume_2026Feb.html](Andrea_Resume_2026Feb.html)
- Styles: [styles/style.css](styles/style.css), [styles/print.css](styles/print.css)
- Scripts: [scripts/index.js](scripts/index.js) (`downloadPdf` button logic)

Use this repo to view, customize, or export the resume as PDF.

## Contents

- [index.html](index.html) — main resume page (XHTML)
- [Andrea_Resume_2026Feb.html](Andrea_Resume_2026Feb.html) — alternate/archived export
- styles/
  - [style.css](styles/style.css) — site styles
  - [print.css](styles/print.css) — print-specific styles
- scripts/
  - [index.js](scripts/index.js) — small DOM helpers and html2pdf integration
- README.md — this file

## How to view

1. Open `index.html` in a browser.
2. Or run a local static server from the project root:

   ```sh
   python3 -m http.server 8000
   # then open http://localhost:8000/index.html

# Acknowledgements

- This project used GitHub Copilot for AI-assisted development.