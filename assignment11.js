/* =========================================
   Assignment 11 - DSC Smart Class Advisor
   COP4813 - Dynamic Objects
========================================= */

// Store course information.
let courses = [];

// Store completed courses.
let completedCourses = new Set();

// Store semester plans.
let semesterPlans = {
    Fall: [],
    Spring: [],
    Summer: []
};

// Total credits required for the degree.
let degreeCredits = 60;

// =========================================
// Load Course Data From JSON
// =========================================

async function loadCourses() {

    try {

        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Unable to load course data.");
        }

        const data = await response.json();

        courses = Array.isArray(data) ? data : data.courses;

        degreeCredits = Array.isArray(data)
            ? 60
            : data.degreeCredits || 60;

        window.courseChoiceGroups = Array.isArray(data)
            ? []
            : data.choiceGroups || [];

        console.log("Courses successfully loaded:", courses);

    } catch (error) {

        console.error("Error loading courses:", error);

        document.getElementById("course-list").textContent =
            "Unable to load course information.";

    }

}

// =========================================
// Find a Course
// =========================================

function findCourse(courseId) {

    return courses.find(course => course.id === courseId);

}

// =========================================
// Check Alternative Course Choices
// =========================================

function getChoiceBlock(courseId) {

    const groups = window.courseChoiceGroups || [];

    for (const group of groups) {

        const completedChoice = group.courses.find(id =>
            completedCourses.has(id)
        );

        if (
            group.courses.includes(courseId) &&
            completedChoice &&
            completedChoice !== courseId
        ) {

            return {
                group,
                completedChoice
            };

        }

    }

    return null;

}

// =========================================
// Check Course Prerequisites
// =========================================

function checkPrerequisites(course) {

    const prerequisites = course.prerequisites || {};

    // AND: All courses must be completed.
    const andRequirements = prerequisites.and || [];

    const missingAnd = andRequirements.filter(id =>
        !completedCourses.has(id)
    );

    // OR: At least one course must be completed.
    const orRequirements = prerequisites.or || [];

    const missingOr =
        orRequirements.length > 0 &&
        !orRequirements.some(id =>
            completedCourses.has(id)
        );

    // Additional prerequisite groups.
    const groups = prerequisites.groups || [];

    const missingGroups = groups.filter(group => {

        const required = group.courses || [];

        if (group.type === "OR" || group.type === "ANY") {

            return !required.some(id =>
                completedCourses.has(id)
            );

        }

        return !required.every(id =>
            completedCourses.has(id)
        );

    });

    return {

        eligible:
            missingAnd.length === 0 &&
            !missingOr &&
            missingGroups.length === 0,

        missingAnd,
        missingOr,
        orRequirements,
        missingGroups

    };

}

// =========================================
// Determine Course Availability
// =========================================

function getCourseStatus(course) {

    // Check if the student completed the course.
    if (completedCourses.has(course.id)) {
        return "completed";
    }

    // Check if another course satisfies its OR requirement.
    if (getChoiceBlock(course.id)) {
        return "locked";
    }

    // Check prerequisites.
    return checkPrerequisites(course).eligible
        ? "available"
        : "locked";

}

// =========================================
// Create Dynamic Course Cards
// =========================================

function createCourseCard(course) {

    const card = document.createElement("div");
    card.className = "course-card";
    card.dataset.courseId = course.id;

    const status = getCourseStatus(course);

    const title = document.createElement("h3");
    title.textContent = `${course.id} - ${course.name}`;

    const credits = document.createElement("p");
    credits.textContent = `Credits: ${course.credits}`;

    const statusText = document.createElement("p");
    statusText.textContent = `Status: ${status}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "View Details";

    button.addEventListener("click", function () {
        showCourseDetails(course.id);
    });

    card.appendChild(title);
    card.appendChild(credits);
    card.appendChild(statusText);
    card.appendChild(button);

    return card;
}

// =========================================
// Display All Courses
// =========================================

function displayCourses() {

    const courseList = document.getElementById("course-list");

    courseList.innerHTML = "";

    courses.forEach(course => {

        const card = createCourseCard(course);

        courseList.appendChild(card);

    });

}

// =========================================
// Display Available Courses
// =========================================

function displayAvailableCourses() {

    const availableContainer =
        document.getElementById("available-courses");

    const lockedContainer =
        document.getElementById("locked-courses");

    availableContainer.innerHTML = "";
    lockedContainer.innerHTML = "";

    courses.forEach(course => {

        const status = getCourseStatus(course);

        if (status === "available") {

            availableContainer.appendChild(
                createCourseCard(course)
            );

        } else if (status === "locked") {

            lockedContainer.appendChild(
                createCourseCard(course)
            );

        }

    });

}

// =========================================
// Mark Courses as Completed
// =========================================

function markCourseCompleted(courseId, isCompleted) {

    if (isCompleted) {

        completedCourses.add(courseId);

    } else {

        completedCourses.delete(courseId);

    }

    refreshAdvisor();

}

// =========================================
// Display Completed Course Checkboxes
// =========================================

function displayCompletedCourses() {

    const courseList = document.getElementById("course-list");

    courseList.innerHTML = "";

    courses.forEach(course => {

        const card = document.createElement("div");
        card.className = "course-card";

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completedCourses.has(course.id);

        checkbox.addEventListener("change", function () {

            markCourseCompleted(course.id, checkbox.checked);

        });

        label.appendChild(checkbox);

        label.appendChild(
            document.createTextNode(
                ` ${course.id} - ${course.name}`
            )
        );

        const credits = document.createElement("p");
        credits.textContent = `Credits: ${course.credits}`;

        card.appendChild(label);
        card.appendChild(credits);

        courseList.appendChild(card);

    });

}

// =========================================
// Search Courses
// =========================================

function searchCourses() {

    const searchInput =
        document.getElementById("course-search");

    const searchTerm = searchInput.value.toLowerCase();

    const courseList =
        document.getElementById("course-list");

    courseList.innerHTML = "";

    const filteredCourses = courses.filter(course => {

        return (
            course.id.toLowerCase().includes(searchTerm) ||
            course.name.toLowerCase().includes(searchTerm)
        );

    });

    filteredCourses.forEach(course => {

        courseList.appendChild(
            createCourseCard(course)
        );

    });

}

// =========================================
// Filter Courses
// =========================================

function filterCourses() {

    const filter =
        document.getElementById("course-filter").value;

    const courseList =
        document.getElementById("course-list");

    courseList.innerHTML = "";

    courses.forEach(course => {

        const status = getCourseStatus(course);

        if (filter === "all" || filter === status) {

            courseList.appendChild(
                createCourseCard(course)
            );

        }

    });

}

// =========================================
// Display Course Details
// =========================================

function showCourseDetails(courseId) {

    const course = findCourse(courseId);

    if (!course) {
        return;
    }

    const details =
        document.getElementById("course-details");

    details.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = `${course.id} - ${course.name}`;

    const credits = document.createElement("p");
    credits.textContent = `Credits: ${course.credits}`;

    const description = document.createElement("p");
    description.textContent =
        course.description || "No description available.";

    const prerequisites = document.createElement("p");

    prerequisites.textContent =
        "Prerequisites: " +
        JSON.stringify(course.prerequisites || {});

    details.appendChild(title);
    details.appendChild(credits);
    details.appendChild(description);
    details.appendChild(prerequisites);

}

// =========================================
// Display Course Selection Notes
// =========================================

function displayCourseNotes() {

    const notesContainer =
        document.getElementById("course-notes");

    notesContainer.innerHTML = "";

    const groups = window.courseChoiceGroups || [];

    if (groups.length === 0) {

        notesContainer.textContent =
            "There are no alternative course requirements.";

        return;
    }

    groups.forEach(group => {

        const note = document.createElement("div");
        note.className = "course-note";

        const heading = document.createElement("h3");
        heading.textContent = group.title || "Course Selection";

        const description = document.createElement("p");

        description.textContent =
            group.note ||
            `Students must complete only one of these courses: ${group.courses.join(" OR ")}.`;

        note.appendChild(heading);
        note.appendChild(description);

        notesContainer.appendChild(note);

    });

}

// =========================================
// Calculate Completed Credits
// =========================================

function calculateCompletedCredits() {

    let total = 0;

    completedCourses.forEach(courseId => {

        const course = findCourse(courseId);

        if (course) {
            total += Number(course.credits) || 0;
        }

    });

    return total;

}

// =========================================
// Update Academic Progress
// =========================================

function updateProgress() {

    const completed = calculateCompletedCredits();

    const total = degreeCredits || 60;

    const remaining = Math.max(0, total - completed);

    const percentage = Math.min(
        100,
        Math.round((completed / total) * 100)
    );

    document.getElementById("completed-credits")
        .textContent = completed;

    document.getElementById("remaining-credits")
        .textContent = remaining;

    document.getElementById("total-credits")
        .textContent = total;

    document.getElementById("progress-fill")
        .style.width = percentage + "%";

    const progressBar =
        document.getElementById("progress-bar");

    progressBar.setAttribute("aria-valuenow", percentage);

    document.getElementById("progress-message")
        .textContent =
            `${percentage}% of your degree credits completed.`;

}

// =========================================
// Refresh Entire Advisor
// =========================================

function refreshAdvisor() {

    displayCompletedCourses();

    displayAvailableCourses();

    displayCourseNotes();

    updateProgress();

    updateSemesterCredits();

}

// =========================================
// Drag and Drop Course Planner
// =========================================

function setupDragAndDrop() {

    const availableContainer =
        document.getElementById("available-courses");

    const dropZones =
        document.querySelectorAll(".drop-zone");

    // Allow dynamically generated course cards to be dragged.
    availableContainer.addEventListener("dragstart", function(event) {

        const card = event.target.closest(".course-card");

        if (!card) {
            return;
        }

        event.dataTransfer.setData(
            "text/plain",
            card.dataset.courseId
        );

    });

    // Set up each semester drop zone.
    dropZones.forEach(zone => {

        zone.addEventListener("dragover", function(event) {

            event.preventDefault();

            zone.classList.add("drag-over");

        });

        zone.addEventListener("dragleave", function() {

            zone.classList.remove("drag-over");

        });

        zone.addEventListener("drop", function(event) {

            event.preventDefault();

            zone.classList.remove("drag-over");

            const courseId =
                event.dataTransfer.getData("text/plain");

            const course = findCourse(courseId);

            if (!course || getCourseStatus(course) !== "available") {
                return;
            }

            const existing =
                zone.querySelector(`[data-course-id="${courseId}"]`);

            if (existing) {
                return;
            }

            const courseCard = document.createElement("div");

            courseCard.className = "planned-course";
            courseCard.dataset.courseId = courseId;

            courseCard.textContent =
                `${course.id} - ${course.name} (${course.credits} credits)`;

            zone.appendChild(courseCard);

            updateSemesterCredits();

        });

    });

}

// =========================================
// Update Semester Credits
// =========================================

function updateSemesterCredits() {

    const semesters = [
        "fall",
        "spring",
        "summer"
    ];

    semesters.forEach(semester => {

        const zone = document.getElementById(
            `${semester}-semester`
        );

        let total = 0;

        zone.querySelectorAll(".planned-course").forEach(card => {

            const course = findCourse(card.dataset.courseId);

            if (course) {
                total += Number(course.credits) || 0;
            }

        });

        document.getElementById(
            `${semester}-credits`
        ).textContent = total;

    });

}

// =========================================
// Clear Semester Plan
// =========================================

function clearSemesterPlan() {

    const semesters = [
        "fall-semester",
        "spring-semester",
        "summer-semester"
    ];

    semesters.forEach(id => {

        const zone = document.getElementById(id);

        zone.querySelectorAll(".planned-course").forEach(course => {
            course.remove();
        });

    });

    updateSemesterCredits();

}

// =========================================
// Reset Completed Courses
// =========================================

function resetAdvisor() {

    const confirmed = confirm(
        "Are you sure you want to reset all completed courses?"
    );

    if (!confirmed) {
        return;
    }

    completedCourses.clear();

    clearSemesterPlan();

    refreshAdvisor();

    document.getElementById("course-details").textContent =
        "No course selected. Select a course to view its details.";

    document.getElementById("course-search").value = "";

    document.getElementById("course-filter").value = "all";

    displayCompletedCourses();

}

// =========================================
// Course Search Event Listener
// =========================================

function setupCourseSearch() {

    const searchInput =
        document.getElementById("course-search");

    searchInput.addEventListener("input", function() {

        searchCourses();

    });

}

// =========================================
// Setup Advisor Buttons
// =========================================

function setupAdvisorButtons() {

    document.getElementById("clear-plan")
        .addEventListener("click", function() {

            clearSemesterPlan();

        });

    document.getElementById("reset-advisor")
        .addEventListener("click", function() {

            resetAdvisor();

        });

}
// =========================================
// Initialize Smart Class Advisor
// =========================================

async function initializeAdvisor() {

    await loadCourses();

    if (!Array.isArray(courses) || courses.length === 0) {

        document.getElementById("course-list").textContent =
            "No course information was found.";

        return;

    }

    displayCompletedCourses();

    displayAvailableCourses();

    displayCourseNotes();

    updateProgress();

    updateSemesterCredits();

    setupDragAndDrop();

    setupCourseSearch();

    setupCourseFilter();

    setupAdvisorButtons();

    console.log("DSC Smart Class Advisor initialized!");

}

// =========================================
// Start the Smart Class Advisor
// =========================================

initializeAdvisor();
