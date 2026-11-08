"use strict";

const state = {
    courses: [],
    program: {},
    completed: new Set(),
    planned: [],
    search: "",
    completedCategory: "all",
    availableCategory: "all"
};

const elements = {
    progress: document.getElementById("progress-summary"),
    completed: document.getElementById("completed-courses"),
    available: document.getElementById("available-courses"),
    plan: document.getElementById("course-plan"),
    planSummary: document.getElementById("plan-summary"),
    search: document.getElementById("course-search"),
    completedCategory: document.getElementById("completed-category"),
    availableCategory: document.getElementById("available-category"),
    semester: document.getElementById("semester-name")
};

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function findCourse(id) {
    return state.courses.find(course => course.id === id);
}

function formatPrerequisites(course) {
    if (!course.prerequisites?.length) {
        return "No prerequisites listed.";
    }

    return course.prerequisites.map(group => {
        const alternatives = group.map(id => {
            const prerequisite = findCourse(id);
            return prerequisite
                ? `${prerequisite.id} – ${prerequisite.name}`
                : id;
        });

        return alternatives.join(" OR ");
    }).join(" AND ");
}

function prerequisitesSatisfied(course) {
    if (!course.prerequisites?.length) return true;

    return course.prerequisites.every(group =>
        group.some(id => state.completed.has(id))
    );
}

function courseDetails(course) {
    const topics = Array.isArray(course.topics)
        ? course.topics
        : [];

    return `
        <details class="course-details">
            <summary>View course information</summary>
            <div class="details-content">
                <p>${escapeHTML(course.description)}</p>
                <h4>Topics covered</h4>
                ${
                    topics.length
                        ? `<ul>${topics.map(topic =>
                            `<li>${escapeHTML(topic)}</li>`
                          ).join("")}</ul>`
                        : "<p>Topics have not been added.</p>"
                }
                <h4>Prerequisites</h4>
                <p>${escapeHTML(formatPrerequisites(course))}</p>
            </div>
        </details>
    `;
}

function courseCard(course, type) {
    const action = type === "available"
        ? `<button class="primary-button" data-add="${escapeHTML(course.id)}">
               Add to semester
           </button>`
        : `<button class="remove-button" data-remove="${escapeHTML(course.id)}">
               Remove
           </button>`;

    return `
        <article class="course-card">
            <div class="course-card-top">
                <span class="course-code">${escapeHTML(course.id)}</span>
                <span class="credit-badge">
                    ${Number(course.credits)} credits
                </span>
            </div>
            <h3>${escapeHTML(course.name)}</h3>
            <p class="course-category">${escapeHTML(course.category)}</p>
            ${courseDetails(course)}
            <div class="card-action">${action}</div>
        </article>
    `;
}

function renderProgress() {
    const completedCourses = state.courses.filter(course =>
        state.completed.has(course.id)
    );

    const completedCredits = completedCourses.reduce(
        (total, course) => total + Number(course.credits || 0), 0
    );

    const plannedCredits = state.planned.reduce((total, id) => {
        const course = findCourse(id);
        return total + (course ? Number(course.credits || 0) : 0);
    }, 0);

    elements.progress.innerHTML = `
        <article class="progress-card">
            <span>Courses completed</span>
            <strong>${completedCourses.length}</strong>
        </article>
        <article class="progress-card">
            <span>Selected completed credits</span>
            <strong>${completedCredits}</strong>
        </article>
        <article class="progress-card">
            <span>Courses planned</span>
            <strong>${state.planned.length}</strong>
        </article>
        <article class="progress-card">
            <span>Planned credits</span>
            <strong>${plannedCredits}</strong>
        </article>
    `;
}

function renderCompletedCourses() {
    const search = state.search.toLowerCase();

    const filtered = state.courses.filter(course => {
        const matchesSearch =
            course.id.toLowerCase().includes(search) ||
            course.name.toLowerCase().includes(search);

        const matchesCategory =
            state.completedCategory === "all" ||
            course.category === state.completedCategory;

        return matchesSearch && matchesCategory;
    });

    if (!filtered.length) {
        elements.completed.innerHTML =
            `<p class="empty-state">No courses match your search.</p>`;
        return;
    }

    const groups = [
        { title: "Prerequisite and Supporting Courses", category: "Prerequisite" },
        { title: "Required BSIT Courses", category: "Program" },
        { title: "Program Electives", category: "Elective" }
    ];

    elements.completed.innerHTML = groups.map(group => {
        const groupCourses = filtered.filter(course =>
            course.category === group.category
        );

        if (!groupCourses.length) return "";

        return `
            <section class="course-group">
                <div class="group-heading">
                    <h3>${group.title}</h3>
                    <span>${groupCourses.length} courses</span>
                </div>
                <div class="course-grid">
                    ${groupCourses.map(course => `
                        <label class="completed-card">
                            <input
                                type="checkbox"
                                data-completed="${escapeHTML(course.id)}"
                                ${state.completed.has(course.id) ? "checked" : ""}
                            >
                            <span class="completed-card-text">
                                <strong>${escapeHTML(course.id)}</strong>
                                <span>${escapeHTML(course.name)}</span>
                                <small>${Number(course.credits)} credits</small>
                            </span>
                        </label>
                    `).join("")}
                </div>
            </section>
        `;
    }).join("");
}

function renderAvailableCourses() {
    const filtered = state.courses.filter(course => {
        const isProgramCourse =
            course.category === "Program" ||
            course.category === "Elective";

        const categoryMatches =
            state.availableCategory === "all" ||
            course.category === state.availableCategory;

        return isProgramCourse &&
            categoryMatches &&
            !state.completed.has(course.id) &&
            !state.planned.includes(course.id) &&
            prerequisitesSatisfied(course);
    });

    if (!filtered.length) {
        elements.available.innerHTML = `
            <div class="empty-state">
                <h3>No eligible courses found</h3>
                <p>
                    Select completed prerequisite courses above.
                    Eligible courses will appear here when their
                    listed requirements are satisfied.
                </p>
            </div>
        `;
        return;
    }

    const required = filtered.filter(course =>
        course.category === "Program"
    );

    const electives = filtered.filter(course =>
        course.category === "Elective"
    );

    let html = "";

    if (required.length) {
        html += `
            <section class="course-group">
                <div class="group-heading">
                    <h3>Required BSIT Courses</h3>
                    <span>${required.length} available</span>
                </div>
                <div class="course-grid">
                    ${required.map(course =>
                        courseCard(course, "available")
                    ).join("")}
                </div>
            </section>
        `;
    }

    if (electives.length) {
        html += `
            <section class="course-group">
                <div class="group-heading">
                    <h3>Program Electives</h3>
                    <span>${electives.length} available</span>
                </div>
                <div class="course-grid">
                    ${electives.map(course =>
                        courseCard(course, "available")
                    ).join("")}
                </div>
            </section>
        `;
    }

    elements.available.innerHTML = html;
}

function renderPlan() {
    const semester = elements.semester.value.trim() || "Upcoming Semester";

    if (!state.planned.length) {
        elements.plan.innerHTML = `
            <div class="empty-state">
                <h3>Your plan is empty</h3>
                <p>Add eligible courses to start building your semester.</p>
            </div>
        `;
    } else {
        elements.plan.innerHTML = state.planned.map(id => {
            const course = findCourse(id);
            return course ? courseCard(course, "planned") : "";
        }).join("");
    }

    const totalCredits = state.planned.reduce((total, id) => {
        const course = findCourse(id);
        return total + (course ? Number(course.credits || 0) : 0);
    }, 0);

    elements.planSummary.innerHTML = `
        <div>
            <span>Semester</span>
            <strong>${escapeHTML(semester)}</strong>
        </div>
        <div>
            <span>Courses selected</span>
            <strong>${state.planned.length}</strong>
        </div>
        <div>
            <span>Total planned credits</span>
            <strong>${totalCredits}</strong>
        </div>
    `;
}

function renderAll() {
    renderProgress();
    renderCompletedCourses();
    renderAvailableCourses();
    renderPlan();
}

function addCourse(id) {
    const course = findCourse(id);

    if (!course || state.completed.has(id)) return;
    if (!prerequisitesSatisfied(course)) return;
    if (state.planned.includes(id)) return;

    state.planned.push(id);
    renderAll();
}

function removeCourse(id) {
    state.planned = state.planned.filter(courseId => courseId !== id);
    renderAll();
}

function handleCompletedChange(event) {
    const checkbox = event.target.closest("[data-completed]");
    if (!checkbox) return;

    const id = checkbox.dataset.completed;

    if (checkbox.checked) {
        state.completed.add(id);
        state.planned = state.planned.filter(courseId => courseId !== id);
    } else {
        state.completed.delete(id);
    }

    renderAll();
}

function handleCourseClick(event) {
    const addButton = event.target.closest("[data-add]");
    const removeButton = event.target.closest("[data-remove]");

    if (addButton) addCourse(addButton.dataset.add);
    if (removeButton) removeCourse(removeButton.dataset.remove);
}

async function initializeAdvisor() {
    try {
        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Could not load courses.json. Check the file name and folder.");
        }

        const data = await response.json();

        if (!Array.isArray(data.courses)) {
            throw new Error("The JSON file needs a courses array.");
        }

        state.courses = data.courses;
        state.program = data.program || {};

        renderAll();

    } catch (error) {
        console.error("BSIT Advisor error:", error);

        document.getElementById("advisor-app").innerHTML = `
            <section class="panel error-panel">
                <h2>Unable to load the Class Advisor</h2>
                <p>${escapeHTML(error.message)}</p>
                <p>
                    Make sure all four Assignment 11 files are in the
                    same folder and open the page using your website
                    or a local web server.
                </p>
            </section>
        `;
    }
}

elements.completed.addEventListener("change", handleCompletedChange);
elements.available.addEventListener("click", handleCourseClick);
elements.plan.addEventListener("click", handleCourseClick);

elements.search.addEventListener("input", event => {
    state.search = event.target.value;
    renderCompletedCourses();
});

elements.completedCategory.addEventListener("change", event => {
    state.completedCategory = event.target.value;
    renderCompletedCourses();
});

elements.availableCategory.addEventListener("change", event => {
    state.availableCategory = event.target.value;
    renderAvailableCourses();
});

elements.semester.addEventListener("input", renderPlan);

initializeAdvisor();
