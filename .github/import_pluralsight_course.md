# Import and Manage Pluralsight Courses

This guide documents the workflow for importing, classifying, and displaying Pluralsight course data on the resume website.

## Overview

Pluralsight course data is stored in `data/completed_courses_with_type.json` and displayed dynamically on the Education page. Each course is classified by skill, type (Course/Lab), and includes a direct link to the course.

## Data Structure

Each course entry in `data/completed_courses_with_type.json`:

```json
{
  "pluralsight_course_name": "Azure Monitoring Fundamentals",
  "pluralsight_course_type": "Course",
  "pluralsight_course_skill": "Azure",
  "pluralsight_course_url": "https://app.pluralsight.com/library/courses/azure-monitoring-fundamentals"
}
```

### Required Fields
- **pluralsight_course_name** (string) — Official course title from Pluralsight
- **pluralsight_course_type** (string) — Either "Course" or "Lab"
- **pluralsight_course_skill** (string) — Skill category (see classification rules below)
- **pluralsight_course_url** (string) — Direct link to the course on Pluralsight

## Skill Classification Rules

Courses are automatically classified by searching the course name for skill keywords. Use **case-insensitive substring matching** with this priority order:

1. **Azure** — Any Azure service or Azure-related course
2. **Microsoft Entra** — Identity, directory, and Entra ID courses
3. **GitHub Copilot** — GitHub Copilot and AI coding tools (e.g., "with GitHub Copilot")
4. **API** — API design, security, testing, and REST API practices (e.g., course names containing "API" or "RESTful")
5. **DevOps** — Docker, Kubernetes, PowerShell, and infrastructure automation
6. **GitHub** — GitHub Actions workflows (but NOT GitHub Copilot—see rule 3)
7. **Python** — Python programming courses
8. **Angular** — Angular framework courses
9. **ASP.NET** — ASP.NET Core and .NET web development
10. **React** — React framework courses
11. **Communications** — Fallback for all other courses (soft skills, frameworks not listed, general education, etc.)

### Classification Examples
- "Azure Monitoring Fundamentals" matches "Azure" → skill: `Azure`
- "API Security Practices" matches "API" → skill: `API`
- "GitHub Actions: The Big Picture" matches "GitHub" (not Copilot) → skill: `GitHub`
- "Getting Started with Docker" matches "DevOps" (Docker) → skill: `DevOps`
- "Learning the PowerShell Language" matches "DevOps" (PowerShell) → skill: `DevOps`
- "GitHub Copilot Fundamentals: AI Agents" matches "GitHub Copilot" (before "GitHub") → skill: `GitHub Copilot`
- "Angular Fundamentals" matches "Angular" → skill: `Angular`
- "Bootstrap 5: Fundamentals" matches none → skill: `Communications`

### First-Match Rule
If a course name contains multiple skill keywords, assign the **first match** in the priority order above.
Example: "Creating Developer Documentation with GitHub Copilot" matches both "GitHub Copilot" and "GitHub", but "GitHub Copilot" comes first (rule 3 vs rule 6), so skill: `GitHub Copilot`.

**Important:** When evaluating "GitHub" matches, check for "GitHub Copilot" first. Only assign "GitHub" skill if the course is about GitHub Actions, workflows, or general GitHub (not AI coding tools).

## Adding New Courses

### Manual Entry
1. Open `data/completed_courses_with_type.json`
2. Add a new object to the array:

```json
{
  "pluralsight_course_name": "Your Course Title Here",
  "pluralsight_course_type": "Course",
  "pluralsight_course_skill": "DeterminedSkill",
  "pluralsight_course_url": "https://app.pluralsight.com/library/courses/your-course-slug"
}
```

3. Determine the skill using the classification rules above
4. Generate the URL slug: convert course name to lowercase, replace spaces and special characters with hyphens
5. Validate JSON syntax after editing

### Bulk Import Script
To programmatically add courses with auto-generated URLs:

```python
import json
import re
from pathlib import Path

def generate_slug(course_name):
    slug = course_name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

path = Path('data/completed_courses_with_type.json')
items = json.loads(path.read_text())

# Add new course
new_course = {
    "pluralsight_course_name": "Your Course Title",
    "pluralsight_course_type": "Course",
    "pluralsight_course_skill": "DeterminedSkill",
    "pluralsight_course_url": f"https://app.pluralsight.com/library/courses/{generate_slug('Your Course Title')}"
}

items.append(new_course)
path.write_text(json.dumps(items, indent=2))
```

## Updating Course Classifications

If you need to reclassify a course (change its skill):

1. Open `data/completed_courses_with_type.json`
2. Find the course entry by name
3. Update the `pluralsight_course_skill` field to one of the recognized skills (see Skill Classification Rules)
4. Save and validate JSON
5. Optionally sort the file by skill (see Sorting Courses below)

**Example:** Reclassify "Bootstrap 5: Fundamentals" if a new skill category is created:
```json
{
  "pluralsight_course_name": "Bootstrap 5: Fundamentals",
  "pluralsight_course_type": "Course",
  "pluralsight_course_skill": "Frontend",
  "pluralsight_course_url": "https://app.pluralsight.com/library/courses/bootstrap-5-fundamentals"
}
```

After updating, the education page will automatically regroup and display courses under the new skill.

## Sorting Courses

Keep the JSON file organized by sorting all courses by skill (alphabetically), then by course name within each skill:

```bash
cd site/data && python3 << 'EOF'
import json

with open('completed_courses_with_type.json', 'r') as f:
    courses = json.load(f)

sorted_courses = sorted(courses, key=lambda x: (x['pluralsight_course_skill'], x['pluralsight_course_name']))

with open('completed_courses_with_type.json', 'w') as f:
    json.dump(sorted_courses, f, indent=2)

print(f"Sorted {len(sorted_courses)} courses by skill")
EOF
```

Current skill count (as of 2026-03-29):
- API: 3 courses
- ASP.NET: 4 courses
- Angular: 8 courses
- Azure: 35 courses
- Communications: 13 courses
- DevOps: 5 courses
- GitHub: 3 courses
- GitHub Copilot: 19 courses
- Microsoft Entra: 1 course
- Python: 12 courses
- React: 4 courses
- REST: 1 course
**Total: 108 courses**

## Display and Rendering

### JavaScript Rendering (`scripts/index.js`)
- `loadCompletedCourses()` — Fetches JSON and groups courses by skill
- `createSkillSummary()` — Displays summary pills: Total count + count per skill
- `createSkillGroup()` — Renders each skill section with nested type grouping

**Grouping Hierarchy:**
1. Skills (alphabetically sorted)
2. Types within each skill (alphabetically sorted: "Course" before "Lab")
3. Course names within each type (alphabetically sorted)

### Display Output
- Each skill displayed as a collapsible section with a count badge
- Each course listed with:
  - Course name (hyperlinked to Pluralsight)
  - Type badge: `Course` (gray) or `Lab` (blue)

### Styling (`styles/style.css`)
- `.course-list .list-group-item` — Flexbox layout for course name + badge
- `.course-name` — Course title (flex-grow container)
- `.badge` — Type indicator (colored based on type)

## URL Generation Guidelines

URLs follow the Pluralsight standard format:
```
https://app.pluralsight.com/library/courses/{slug}
```

**Slug rules:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove or replace special characters (keep alphanumeric and hyphens only)
- Replace multiple consecutive hyphens with a single hyphen
- Remove leading/trailing hyphens

**URL Examples:**
| Course Name | Generated URL | Skill |
|---|---|---|
| Azure Monitoring Fundamentals | `https://app.pluralsight.com/library/courses/azure-monitoring-fundamentals` | Azure |
| API Security Practices | `https://app.pluralsight.com/library/courses/api-security-practices` | API |
| GitHub Actions: The Big Picture | `https://app.pluralsight.com/library/courses/github-actions-the-big-picture` | GitHub |
| Getting Started with Docker | `https://app.pluralsight.com/library/courses/getting-started-with-docker` | DevOps |
| What's New in React 19 | `https://app.pluralsight.com/library/courses/whats-new-in-react-19` | React |
| ASP.NET Core: Big Picture | `https://app.pluralsight.com/library/courses/aspnet-core-big-picture` | ASP.NET |

## Validation Checklist

Before committing course data changes:

- [ ] JSON file is valid (no syntax errors)
- [ ] All required fields present: `pluralsight_course_name`, `pluralsight_course_type`, `pluralsight_course_skill`, `pluralsight_course_url`
- [ ] Course name is exact and matches Pluralsight catalog
- [ ] Type is either "Course" or "Lab"
- [ ] Skill matches classification rules and priority order
- [ ] URL is properly formatted and follows slug generation rules
- [ ] Course appears in appropriate skill grouping on the website
- [ ] Type badge displays correctly (Lab = blue, Course = gray)

## Navigation in Code

| File | Purpose |
|---|---|
| `site/data/completed_courses_with_type.json` | Source data for all Pluralsight courses (sorted by skill) |
| `site/scripts/index.js` | Dynamic rendering logic with collapsable skill groups |
| `site/index.html` | Education section with container: `<div id="pluralsight-courses">` |
| `site/styles/style.css` | Course list styling, collapsable buttons, and layout |
| `.github/import_pluralsight_course.md` | This file — course management workflow and classification rules |

## Tips for Future Maintenance

1. **Batch updates:** When adding multiple courses, do bulk edits to the JSON file rather than one-by-one for efficiency. Use the sorting script to keep the file organized.
2. **Skill category growth:** If you add new skill categories (e.g., "Kubernetes", "Go", "Docker Specialized"), update:
   - This classification rules priority list (in this file)
   - The JavaScript grouping logic (automatically sorts skills alphabetically in `scripts/index.js`)
   - Re-sort the JSON file using the sorting script
3. **URL verification:** Periodically verify URLs by spot-checking courses—if a URL returns 404, update the slug
4. **Collapsable sections:** Course skill groups display as collapsable sections with chevron icons. These expand/collapse via Bootstrap's collapse component.
5. **Database export:** You can export the sorted JSON for external reporting tools or resume builders that consume Pluralsight data
6. **Performance:** With 108+ courses, the UI uses collapsable sections to minimize scrolling. Monitor performance if the dataset grows beyond 200 courses.

## Recent Changes (Session 2026-03-29)

### New Skills Added
- **API** — Courses with "API" in the name (API Security Practices, API Testing Strategies, Designing RESTful Web APIs)
- **DevOps** — Docker and PowerShell courses (Getting Started with Docker, Docker and Kubernetes: The Big Picture, and 3 PowerShell courses)
- **GitHub** — GitHub Actions workflows (Consuming GitHub Actions Workflows, Authoring and Maintaining GitHub Actions Workflows, GitHub Actions: The Big Picture)

### Courses Reclassified
- Moved courses with "API" from Communications → API skill
- Moved courses with "GitHub Actions" from Communications → GitHub skill (kept GitHub Copilot as separate skill)
- Moved courses with "Docker" and "PowerShell" from Communications → DevOps skill
- Moved "Getting Started on Prompt Engineering with Generative AI" from Communications → GitHub Copilot skill

### File Sorts
- All 108 courses sorted by skill (alphabetically), then by course name within each skill
- Collapsable skill sections added to Education page display (via `scripts/index.js`)

## Related Documentation

- Copilot instructions: `.github/copilot-instructions.md`
- Resume data source: `data/Master_Resume.md`
- Resume site structure: `README.md`
