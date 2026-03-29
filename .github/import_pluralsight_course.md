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
3. **GitHub Copilot** — GitHub Copilot and AI coding tools
4. **Python** — Python programming courses
5. **REST** — REST API and REST principles
6. **Angular** — Angular framework courses
7. **ASP.NET** — ASP.NET Core and .NET web development
8. **React** — React framework courses
9. **Communications** — Fallback for all other courses (soft skills, DevOps, frameworks not listed, etc.)

### Classification Examples
- "Azure Monitoring Fundamentals" matches "Azure" → skill: `Azure`
- "Angular Fundamentals" matches "Angular" → skill: `Angular`
- "Designing RESTful Web APIs" matches "REST" → skill: `REST`
- "Bootstrap 5: Fundamentals" matches none → skill: `Communications`

### First-Match Rule
If a course name contains multiple skill keywords, assign the **first match** in the priority order above.
Example: "ASP.NET Core with Azure" matches both "ASP.NET" and "Azure", but "Azure" comes first in the priority list, so skill: `Azure`.

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
3. Update the `pluralsight_course_skill` field
4. Save and validate JSON

**Example:** Move "Bootstrap 5: Fundamentals" from "Communications" to a new "Frontend" category:
```json
{
  "pluralsight_course_name": "Bootstrap 5: Fundamentals",
  "pluralsight_course_type": "Course",
  "pluralsight_course_skill": "Frontend",
  "pluralsight_course_url": "https://app.pluralsight.com/library/courses/bootstrap-5-fundamentals"
}
```

After updating, the education page will automatically regroup and display courses under the new skill.

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
| Course Name | Generated URL |
|---|---|
| Azure Monitoring Fundamentals | `https://app.pluralsight.com/library/courses/azure-monitoring-fundamentals` |
| What's New in React 19 | `https://app.pluralsight.com/library/courses/whats-new-in-react-19` |
| C++/CLI Advanced | `https://app.pluralsight.com/library/courses/ccli-advanced` |
| ASP.NET Core: Big Picture | `https://app.pluralsight.com/library/courses/aspnet-core-big-picture` |

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
| `data/completed_courses_with_type.json` | Source data for all Pluralsight courses |
| `scripts/index.js` | Dynamic rendering logic |
| `index.html` | Container element: `<div id="pluralsight-courses">` |
| `styles/style.css` | Course list styling and layout |
| `.github/session-skill-tracking.md` | Session notes and implementation details |

## Tips for Future Maintenance

1. **Batch updates:** When adding multiple courses, do bulk edits to the JSON file rather than one-by-one for efficiency
2. **Skill category growth:** If you add new skill categories (e.g., "Kubernetes", "Go"), update the classification rules priority list and the JavaScript grouping logic
3. **URL verification:** Periodically verify URLs by spot-checking courses—if a URL returns 404, update the slug
4. **Database export:** You can export this JSON for external reporting tools or resume builders that consume Pluralsight data
5. **Filtering:** If the display grows large, consider adding a filter/search feature to the UI using the skill or type fields

## Related Documentation

- Session notes: `.github/session-skill-tracking.md`
- Copilot instructions: `.github/copilot-instructions.md`
- Resume data source: `data/Master_Resume.md`
