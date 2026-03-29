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

		const groupedCourses = validCourses.reduce((groups, course) => {
			const type = course.pluralsight_course_type || 'Course';
			if (!groups[type]) {
				groups[type] = [];
			}
			groups[type].push(course.pluralsight_course_name);
			return groups;
		}, {});

		Object.values(groupedCourses).forEach((names) => {
			names.sort((left, right) => left.localeCompare(right));
		});

		const fragment = document.createDocumentFragment();
		fragment.appendChild(createCourseSummary(validCourses.length, groupedCourses));

		Object.keys(groupedCourses)
			.sort((left, right) => left.localeCompare(right))
			.forEach((groupName) => {
				fragment.appendChild(createCourseGroup(groupName, groupedCourses[groupName]));
			});

		container.replaceChildren(fragment);
	} catch (error) {
		console.error('Unable to load completed courses.', error);
		container.innerHTML = '<p class="text-danger mb-0">Unable to load completed courses right now.</p>';
	}
}

function createCourseSummary(totalCount, groupedCourses) {
	const wrapper = document.createElement('div');
	wrapper.className = 'course-summary';

	const total = document.createElement('div');
	total.className = 'summary-pill';
	total.innerHTML = `<span class="summary-label">Total</span><strong>${totalCount}</strong>`;
	wrapper.appendChild(total);

	Object.keys(groupedCourses)
		.sort((left, right) => left.localeCompare(right))
		.forEach((groupName) => {
			const pill = document.createElement('div');
			pill.className = 'summary-pill';
			pill.innerHTML = `<span class="summary-label">${groupName}</span><strong>${groupedCourses[groupName].length}</strong>`;
			wrapper.appendChild(pill);
		});

	return wrapper;
}

function createCourseGroup(groupName, courseNames) {
	const section = document.createElement('section');
	section.className = 'course-group';

	const heading = document.createElement('h4');
	heading.className = 'course-group-title';
	heading.textContent = `${groupName} (${courseNames.length})`;

	const list = document.createElement('ul');
	list.className = 'list-group course-list';

	courseNames.forEach((courseName) => {
		const item = document.createElement('li');
		item.className = 'list-group-item';
		item.textContent = courseName;
		list.appendChild(item);
	});

	section.append(heading, list);
	return section;
}
