// Assignment 11 - Dynamic Objects
// Daytona State College - BSIT Class Advisor

// 1. COURSE DATA (JSON)

const advisorData = {
    program: "Bachelor of Science in Information Technology (BSIT)",

    courses: [
        {
            id: "COP1000",
            name: "Principles of Computer Programming",
            credits: 3,
            prerequisites: [],
            terms: ["Fall", "Spring", "Summer"],
            note: "Foundational programming requirement."
        },
        {
            id: "COP2800",
            name: "Computer Programming Java",
            credits: 3,
            prerequisites: [],
            choiceGroup: "programming",
            terms: ["Fall", "Spring"],
            note: "Choose one programming course from the approved options."
        },
        {
            id: "COP2360",
            name: "C# Programming",
            credits: 3,
            prerequisites: [],
            choiceGroup: "programming",
            terms: ["Fall", "Spring", "Summer"],
            note: "Alternative programming course. Select only one option."
        },
        {
            id: "COP2220",
            name: "Computer Programming C",
            credits: 3,
            prerequisites: [],
            choiceGroup: "programming",
            terms: ["Fall", "Spring", "Summer"],
            note: "Alternative programming course. Select only one option."
        },
        {
            id: "COT3100",
            name: "Discrete Analysis",
            credits: 3,
            prerequisites: [],
            terms: ["Fall", "Spring"],
            note: "Discrete mathematics requirement."
        },
        {
            id: "MAD2104",
            name: "Discrete Mathematics",
            credits: 3,
            prerequisites: [],
            terms: ["Fall"],
            note: "Alternative to COT3100 for the discrete requirement."
        },
        {
            id: "CTS3348",
            name: "Linux Administration",
            credits: 3,
            prerequisites: [
                { anyOf: ["MAC1105", "MAC1114", "MAC1140"] }
            ],
            terms: ["Fall"],
            note: "Requires MAC1105 or a higher mathematics course."
        },
        {
            id: "COP3530",
            name: "Data Structures",
            credits: 3,
            prerequisites: [
                { anyOf: ["COP2800", "COP2220", "COP2360"] },
                { anyOf: ["COT3100", "MAD2104"] }
            ],
            terms: ["Fall", "Spring"],
            note: "Requires one programming course AND one discrete mathematics course."
        },
        {
            id: "COP4708",
            name: "Applied Database I",
            credits: 3,
            prerequisites: [
                { anyOf: ["COP2800", "COP2220", "COP2360"] }
            ],
            terms: ["Fall", "Spring"],
            note: "Requires one approved programming course."
        },
        {
            id: "COP4610",
            name: "Operating Systems",
            credits: 3,
            prerequisites: [
                { anyOf: ["CTS3348"] }
            ],
            terms: ["Fall", "Spring"],
            note: "Requires Linux Administration."
        },
        {
            id: "CIS4360",
            name: "Applied Cybersecurity",
            credits: 3,
            prerequisites: [
                { anyOf: ["CTS3348"] },
                { anyOf: ["CET1600", "CNT3104"] }
            ],
            terms: ["Fall", "Spring", "Summer"],
            note: "Requires CTS3348 AND either CET1600 or CNT3104."
        },
        {
            id: "CEN4010",
            name: "Software Engineering",
            credits: 3,
            prerequisites: [
                { anyOf: ["COP3530"] }
            ],
            terms: ["Spring"],
            note: "Requires Data Structures."
        },
        {
            id: "COP4813",
            name: "Web Systems I",
            credits: 3,
            prerequisites: [
                { anyOf: ["COP3530"] }
            ],
            terms: ["Fall"],
            note: "Requires Data Structures."
        },
        {
            id: "CEN4801",
            name: "Systems Integration",
            credits: 3,
            prerequisites: [
                { anyOf: ["COP4708"] },
                { anyOf: ["COP3530"] }
            ],
            terms: ["Fall"],
            note: "Requires Applied Database I AND Data Structures."
        },
        {
            id: "CIS4510",
            name: "IT Project Management",
            credits: 3,
            prerequisites: [
                { anyOf: ["CEN4801"] }
            ],
            terms: ["Spring"],
            note: "Requires Systems Integration."
        }
    ]
};


// 2. STUDENT DATA

let completedCourses = [];
let coursePlan = [];


// 3. CHECK PREREQUISITES

function prerequisitesMet(course) {

    return course.prerequisites.every(requirement =>
        requirement.anyOf.some(courseID =>
            completedCourses.includes(courseID)
        )
    );
}


// 4. CHECK PROGRAMMING COURSE CHOICES

function getSelectedProgrammingCourse() {

    return advisorData.courses.find(course =>
        course.choiceGroup === "programming" &&
        completedCourses.includes(course.id)
    );
}


// 5. CREATE COMPLETED COURSE ELEMENTS DYNAMICALLY

function renderCompletedCourses() {

    const container = document.getElementById("completed-courses");

    container.innerHTML = "";

    advisorData.courses.forEach(course => {

        const selectedCourse = getSelectedProgrammingCourse();

        const isDisabled =
            course.choiceGroup === "programming" &&
            selectedCourse &&
            selectedCourse.id !== course.id;

        const courseElement = document.createElement("div");

        courseElement.className = "course-card";

        courseElement.innerHTML = `
            <label>
                <input
                    type="checkbox"
                    class="completed-checkbox"
                    value="${course.id}"
                    ${completedCourses.includes(course.id) ? "checked" : ""}
                    ${isDisabled ? "disabled" : ""}
                >
                <strong>${course.id}</strong> - ${course.name}
            </label>
            <p>${course.credits} credits</p>
        `;

        container.appendChild(courseElement);

    });
}


// 6. DISPLAY AVAILABLE COURSES

function renderAvailableCourses() {

    const container = document.getElementById("available-courses");

    container.innerHTML = "";

    const availableCourses = advisorData.courses.filter(course =>
        !completedCourses.includes(course.id) &&
        prerequisitesMet(course)
    );

    if (availableCourses.length === 0) {

        container.innerHTML = "<p>No courses are currently available based on your selections.</p>";

        return;
    }

    availableCourses.forEach(course => {

        const courseElement = document.createElement("div");

        courseElement.className = "course-card";

        courseElement.innerHTML = `
            <h3>${course.id} - ${course.name}</h3>
            <p>Credits: ${course.credits}</p>
            <p>Offered: ${course.terms.join(", ")}</p>
            <p><strong>Note:</strong> ${course.note}</p>
            <button class="add-course-button" data-course="${course.id}">
                Add to Course Plan
            </button>
        `;

        container.appendChild(courseElement);

    });
}


// 7. CREATE THE COURSE PLAN

function renderCoursePlan() {

    const container = document.getElementById("course-plan");

    container.innerHTML = "";

    if (coursePlan.length === 0) {

        container.innerHTML = "<p>Your course plan is currently empty.</p>";

        return;
    }

    coursePlan.forEach(courseID => {

        const course = advisorData.courses.find(item =>
            item.id === courseID
        );

        const courseElement = document.createElement("div");

        courseElement.className = "course-card";

        courseElement.innerHTML = `
            <h3>${course.id} - ${course.name}</h3>
            <p>${course.credits} credits</p>
            <button class="remove-course-button" data-course="${course.id}">
                Remove Course
            </button>
        `;

        container.appendChild(courseElement);

    });

    const totalCredits = coursePlan.reduce((total, courseID) => {

        const course = advisorData.courses.find(item =>
            item.id === courseID
        );

        return total + course.credits;

    }, 0);

    const total = document.createElement("p");

    total.innerHTML = `<strong>Total Credits: ${totalCredits}</strong>`;

    container.appendChild(total);
}


// 8. HANDLE COMPLETED COURSE EVENTS

document.getElementById("completed-courses").addEventListener("change", event => {

    if (event.target.classList.contains("completed-checkbox")) {

        const courseID = event.target.value;

        if (event.target.checked) {

            completedCourses.push(courseID);

        } else {

            completedCourses = completedCourses.filter(id =>
                id !== courseID
            );

        }

        coursePlan = coursePlan.filter(id =>
            prerequisitesMet(
                advisorData.courses.find(course => course.id === id)
            )
        );

        renderAll();

    }

});


// 9. HANDLE DYNAMIC BUTTON EVENTS

document.getElementById("available-courses").addEventListener("click", event => {

    if (event.target.classList.contains("add-course-button")) {

        const courseID = event.target.dataset.course;

        const course = advisorData.courses.find(item =>
            item.id === courseID
        );

        if (
            course &&
            prerequisitesMet(course) &&
            !coursePlan.includes(courseID)
        ) {

            coursePlan.push(courseID);

            renderCoursePlan();

        }

    }

});


// 10. REMOVE COURSES FROM THE PLAN

document.getElementById("course-plan").addEventListener("click", event => {

    if (event.target.classList.contains("remove-course-button")) {

        const courseID = event.target.dataset.course;

        coursePlan = coursePlan.filter(id =>
            id !== courseID
        );

        renderCoursePlan();

    }

});


// 11. UPDATE THE INTERFACE

function renderAll() {

    renderCompletedCourses();

    renderAvailableCourses();

    renderCoursePlan();

}


// 12. START THE ADVISOR

renderAll();
