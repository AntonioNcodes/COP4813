let courses = [];
let completedCourses = new Set();
let plannedCourses = [];

const advisor = document.getElementById("advisor-app");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

async function loadCourses() {
  try {
    const response = await fetch("courses.json");

    if (!response.ok) {
      throw new Error("Could not find courses.json.");
    }

    const data = await response.json();

    courses = data.courses;

    if (!Array.isArray(courses)) {
      throw new Error("The JSON file does not contain a courses array.");
    }

    renderAll();

  } catch (error) {
    console.error("Advisor loading error:", error);

    advisor.innerHTML = `
      <h2>Unable to load the BSIT Class Advisor</h2>
      <p>${escapeHTML(error.message)}</p>
      <p>Make sure assignment11.html, assignment11.js, and courses.json
      are in the same folder.</p>
    `;
  }
}

function getCourse(courseId) {
  return courses.find(course => course.id === courseId);
}

function getPrerequisiteText(course) {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return "No prerequisites listed.";
  }

  return course.prerequisites.map(group => {
    const names = group.map(id => {
      const prerequisite = getCourse(id);
      return prerequisite
        ? `${prerequisite.id} - ${prerequisite.name}`
        : id;
    });

    return names.join(" OR ");
  }).join(" AND ");
}

function prerequisitesMet(course) {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return true;
  }

  return course.prerequisites.every(group =>
    group.some(prerequisiteId =>
      completedCourses.has(prerequisiteId)
    )
  );
}

function getCourseInformation(course) {
  const topics = course.topics && course.topics.length
    ? `<ul>${course.topics.map(topic =>
        `<li>${escapeHTML(topic)}</li>`
      ).join("")}</ul>`
    : "<p>No topics listed yet.</p>";

  return `
    <div class="course-information">
      <p>${escapeHTML(course.description || "Course description coming soon.")}</p>
      <strong>Topics covered:</strong>
      ${topics}
      <p><strong>Prerequisites:</strong>
      ${escapeHTML(getPrerequisiteText(course))}</p>
    </div>
  `;
}

function renderCompletedCourses() {
  const container = document.getElementById("completed-courses");

  if (!container) return;

  // Include prerequisite codes even when their full course records
  // have not yet been added to the JSON file.
  const prerequisiteIds = courses.flatMap(course =>
    (course.prerequisites || []).flat()
  );

  const allIds = [...new Set([
    ...courses.map(course => course.id),
    ...prerequisiteIds
  ])];

  container.innerHTML = allIds.map(id => {
    const course = getCourse(id);
    const name = course
      ? `${course.id} - ${course.name}`
      : `${id} - Supporting prerequisite (course details not added yet)`;

    return `
      <label class="completed-course-option">
        <input
          type="checkbox"
          data-completed-course="${escapeHTML(id)}"
          ${completedCourses.has(id) ? "checked" : ""}
        >
        ${escapeHTML(name)}
      </label>
    `;
  }).join("");
}

function renderAvailableCourses() {
  const container = document.getElementById("available-courses");

  if (!container) return;

  const available = courses.filter(course =>
    (course.category === "Program" ||
     course.category === "Program Elective") &&
    !completedCourses.has(course.id) &&
    !plannedCourses.includes(course.id) &&
    prerequisitesMet(course)
  );

  if (available.length === 0) {
    container.innerHTML = `
      <p>No eligible courses are available yet.
      Select completed prerequisite courses to see your options.</p>
    `;
    return;
  }

  container.innerHTML = available.map(course => `
    <article class="course-card">
      <h3>${escapeHTML(course.id)} - ${escapeHTML(course.name)}</h3>
      <p><strong>Credits:</strong> ${course.credits}</p>
      ${getCourseInformation(course)}
      <button type="button" data-add-course="${escapeHTML(course.id)}">
        Add to Course Plan
      </button>
    </article>
  `).join("");
}

function renderCoursePlan() {
  const container = document.getElementById("course-plan");

  if (!container) return;

  if (plannedCourses.length === 0) {
    container.innerHTML = "<p>Your course plan is currently empty.</p>";
    return;
  }

  container.innerHTML = plannedCourses.map(id => {
    const course = getCourse(id);

    if (!course) return "";

    return `
      <article class="course-card">
        <h3>${escapeHTML(course.id)} - ${escapeHTML(course.name)}</h3>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <button type="button" data-remove-course="${escapeHTML(course.id)}">
          Remove from Plan
        </button>
      </article>
    `;
  }).join("");
}

function updateProgress() {
  const container = document.getElementById("progress-summary");

  if (!container) return;

  const completedCredits = courses
    .filter(course => completedCourses.has(course.id))
    .reduce((total, course) => total + Number(course.credits || 0), 0);

  const plannedCredits = plannedCourses
    .map(id => getCourse(id))
    .filter(Boolean)
    .reduce((total, course) => total + Number(course.credits || 0), 0);

  container.innerHTML = `
    <p><strong>Completed courses selected:</strong>
    ${completedCourses.size}</p>

    <p><strong>Credits represented by completed courses:</strong>
    ${completedCredits}</p>

    <p><strong>Courses in your plan:</strong>
    ${plannedCourses.length}</p>

    <p><strong>Planned credits:</strong>
    ${plannedCredits}</p>

    <p><strong>Program credit requirement:</strong> 128 credits</p>
    <p><em>This is a planning estimate, not an official degree audit.</em></p>
  `;
}

function addCourseToPlan(courseId) {
  const course = getCourse(courseId);

  if (!course || !prerequisitesMet(course)) return;

  if (!plannedCourses.includes(courseId)) {
    plannedCourses.push(courseId);
  }

  renderAll();
}

function removeCourseFromPlan(courseId) {
  plannedCourses = plannedCourses.filter(id => id !== courseId);
  renderAll();
}

function renderAll() {
  renderCompletedCourses();
  renderAvailableCourses();
  renderCoursePlan();
  updateProgress();
}

// Handle completed-course checkboxes.
document.addEventListener("change", event => {
  const checkbox = event.target.closest("[data-completed-course]");

  if (!checkbox) return;

  const courseId = checkbox.dataset.completedCourse;

  if (checkbox.checked) {
    completedCourses.add(courseId);
    plannedCourses = plannedCourses.filter(id => id !== courseId);
  } else {
    completedCourses.delete(courseId);
  }

  renderAll();
});

// Handle dynamically created Add and Remove buttons.
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-course]");
  const removeButton = event.target.closest("[data-remove-course]");

  if (addButton) {
    addCourseToPlan(addButton.dataset.addCourse);
  }

  if (removeButton) {
    removeCourseFromPlan(removeButton.dataset.removeCourse);
  }
});

// Load the JSON data when the page is ready.
loadCourses();
