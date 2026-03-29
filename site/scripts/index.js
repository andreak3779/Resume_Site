document.addEventListener('DOMContentLoaded', () => {
	const printButton = document.getElementById('printResume');
	if (printButton) {
		printButton.addEventListener('click', () => {
			window.print();
		});
	}

	const coursesContainer = document.getElementById('pluralsight-courses');
	if (coursesContainer) {
		loadCompletedCourses(coursesContainer);
	}
});

async function loadCompletedCourses(container) {
	container.innerHTML = '<p class="text-muted mb-0">Loading completed courses...</p>';

	try {
		const response = await fetch('data/completed_courses_with_type.json');
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const courses = await response.json();
		const validCourses = Array.isArray(courses)
			? courses.filter((course) => course && course.pluralsight_course_name)
			: [];

		if (validCourses.length === 0) {
			container.innerHTML = '<p class="text-muted mb-0">No completed courses available.</p>';
			return;
		}

		// Group by skill, then by type within each skill
		const groupedBySkill = validCourses.reduce((skills, course) => {
			const skill = course.pluralsight_course_skill || 'Communications';
			const type = course.pluralsight_course_type || 'Course';
			
			if (!skills[skill]) {
				skills[skill] = {};
			}
			if (!skills[skill][type]) {
				skills[skill][type] = [];
			}
			
			skills[skill][type].push({
				name: course.pluralsight_course_name,
				type: type,
				skill: skill
			});
			
			return skills;
		}, {});

		// Sort courses within each type
		Object.values(groupedBySkill).forEach((typeGroups) => {
			Object.values(typeGroups).forEach((courses) => {
				courses.sort((left, right) => left.name.localeCompare(right.name));
			});
		});

		const fragment = document.createDocumentFragment();
		fragment.appendChild(createSkillSummary(validCourses.length, groupedBySkill));

		// Sort skills alphabetically
		Object.keys(groupedBySkill)
			.sort((left, right) => left.localeCompare(right))
			.forEach((skillName) => {
				fragment.appendChild(createSkillGroup(skillName, groupedBySkill[skillName]));
			});

		container.replaceChildren(fragment);
	} catch (error) {
		console.error('Unable to load completed courses.', error);
		container.innerHTML = '<p class="text-danger mb-0">Unable to load completed courses right now.</p>';
	}
}

function createSkillSummary(totalCount, groupedBySkill) {
	const wrapper = document.createElement('div');
	wrapper.className = 'course-summary';

	const total = document.createElement('div');
	total.className = 'summary-pill';
	total.innerHTML = `<span class="summary-label">Total</span><strong>${totalCount}</strong>`;
	wrapper.appendChild(total);

	Object.keys(groupedBySkill)
		.sort((left, right) => left.localeCompare(right))
		.forEach((skillName) => {
			const skillCourses = [];
			Object.values(groupedBySkill[skillName]).forEach((courses) => {
				skillCourses.push(...courses);
			});
			
			const pill = document.createElement('div');
			pill.className = 'summary-pill';
			pill.innerHTML = `<span class="summary-label">${skillName}</span><strong>${skillCourses.length}</strong>`;
			wrapper.appendChild(pill);
		});

	return wrapper;
}

function createSkillGroup(skillName, typeGroups) {
	const section = document.createElement('section');
	section.className = 'course-group';

	// Count total courses in this skill
	let totalInSkill = 0;
	Object.values(typeGroups).forEach((courses) => {
		totalInSkill += courses.length;
	});

	// Create unique ID for this skill group
	const skillId = `collapse-${skillName.replace(/\s+/g, '-').toLowerCase()}`;

	// Create collapsible button/heading
	const button = document.createElement('button');
	button.className = 'course-group-button';
	button.setAttribute('type', 'button');
	button.setAttribute('data-bs-toggle', 'collapse');
	button.setAttribute('data-bs-target', `#${skillId}`);
	button.setAttribute('aria-expanded', 'true');
	button.setAttribute('aria-controls', skillId);
	button.innerHTML = `<span class="course-group-title-text">${skillName} (${totalInSkill})</span><span class="collapse-icon" aria-hidden="true"></span>`;

	const heading = document.createElement('div');
	heading.className = 'course-group-header';
	heading.appendChild(button);

	const list = document.createElement('ul');
	list.id = skillId;
	list.className = 'list-group course-list collapse show';
	list.setAttribute('data-bs-parent', '');

	// Process each type within this skill
	Object.keys(typeGroups)
		.sort((left, right) => left.localeCompare(right))
		.forEach((typeName) => {
			typeGroups[typeName].forEach((course) => {
				const item = document.createElement('li');
				item.className = 'list-group-item';
				
				const courseName = document.createElement('span');
				courseName.className = 'course-name';
				courseName.textContent = course.name;
				
				const typeBadge = document.createElement('span');
				typeBadge.className = 'badge ms-2';
				typeBadge.classList.add(course.type === 'Lab' ? 'bg-info' : 'bg-secondary');
				typeBadge.textContent = course.type;
				
				item.appendChild(courseName);
				item.appendChild(typeBadge);
				list.appendChild(item);
			});
		});

	section.append(heading, list);
	return section;
}
