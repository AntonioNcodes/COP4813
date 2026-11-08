
// Assignment 11 - Dynamic Objects
// Daytona State College - BSIT Class Advisor

// 1. COURSE DATA (JSON)

const advisorData = JSON.parse(`{
    "program": "Bachelor of Science in Information Technology (BSIT)",
    "courses": [
        {
            "id": "COP1000",
            "name": "Principles of Computer Programming",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall", "Spring", "Summer"],
            "choiceGroup": null,
            "note": "Foundational programming requirement.",
            "description": "Introduces the basic concepts of computer programming and problem-solving.",
            "topics": ["Programming fundamentals", "Variables and data types", "Decision structures", "Loops and problem-solving"]
        },
        {
            "id": "COP2800",
            "name": "Computer Programming Java",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall", "Spring"],
            "choiceGroup": "programming",
            "note": "Choose one programming course from the approved options.",
            "description": "Introduces programming using Java and object-oriented programming concepts.",
            "topics": ["Java syntax", "Classes and objects", "Methods", "Arrays and control structures"]
        },
        {
            "id": "COP2360",
            "name": "C# Programming",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall", "Spring", "Summer"],
            "choiceGroup": "programming",
            "note": "Alternative programming course. Select only one option.",
            "description": "Introduces programming concepts using the C# programming language.",
            "topics": ["C# syntax", "Variables and data types", "Methods", "Object-oriented programming"]
        },
        {
            "id": "COP2220",
            "name": "Computer Programming C",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall", "Spring", "Summer"],
            "choiceGroup": "programming",
            "note": "Alternative programming course. Select only one option.",
            "description": "Introduces computer programming using the C language.",
            "topics": ["C programming", "Variables and operators", "Functions", "Arrays and pointers"]
        },
        {
            "id": "COT3100",
            "name": "Discrete Analysis",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall", "Spring"],
            "choiceGroup": "discrete",
            "note": "Discrete mathematics requirement.",
            "description": "Explores mathematical concepts used in computer science and information technology.",
            "topics": ["Logic", "Sets", "Relations", "Counting and problem-solving"]
        },
        {
            "id": "MAD2104",
            "name": "Discrete Mathematics",
            "credits": 3,
            "prerequisites": [],
            "terms": ["Fall"],
            "choiceGroup": "discrete",
            "note": "Alternative to COT3100 for the discrete requirement.",
            "description": "Covers mathematical reasoning and concepts that support computing and technology.",
            "topics": ["Mathematical logic", "Sets", "Functions", "Combinatorics"]
        },
        {
            "id": "CTS3348",
            "name": "Linux Administration",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["MAC1105", "MAC1114", "MAC1140"]}
            ],
            "terms": ["Fall"],
            "choiceGroup": null,
            "note": "Requires MAC1105 or a higher mathematics course.",
            "description": "Introduces Linux operating system administration and command-line management.",
            "topics": ["Linux commands", "File permissions", "User management", "System administration"]
        },
        {
            "id": "COP3530",
            "name": "Data Structures",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["COP2800", "COP2220", "COP2360"]},
                {"anyOf": ["COT3100", "MAD2104"]}
            ],
            "terms": ["Fall", "Spring"],
            "choiceGroup": null,
            "note": "Requires one programming course AND one discrete mathematics course.",
            "description": "Studies how data is organized, stored, and accessed in computer programs.",
            "topics": ["Arrays", "Linked lists", "Stacks and queues", "Trees and sorting"]
        },
        {
            "id": "COP4708",
            "name": "Applied Database I",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["COP2800", "COP2220", "COP2360"]}
            ],
            "terms": ["Fall", "Spring"],
            "choiceGroup": null,
            "note": "Requires one approved programming course.",
            "description": "Introduces database concepts, design, and working with database systems.",
            "topics": ["Database design", "SQL", "Tables and relationships", "Queries"]
        },
        {
            "id": "COP4610",
            "name": "Operating Systems",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["CTS3348"]}
            ],
            "terms": ["Fall", "Spring"],
            "choiceGroup": null,
            "note": "Requires Linux Administration.",
            "description": "Explores how operating systems manage computer hardware and software resources.",
            "topics": ["Processes and threads", "Memory management", "File systems", "Operating system concepts"]
        },
        {
            "id": "CIS4360",
            "name": "Applied Cybersecurity",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["CTS3348"]},
                {"anyOf": ["CET1600", "CNT3104"]}
            ],
            "terms": ["Fall", "Spring", "Summer"],
            "choiceGroup": null,
            "note": "Requires CTS3348 AND either CET1600 or CNT3104.",
            "description": "Introduces practical cybersecurity concepts and techniques used to protect computer systems and networks.",
            "topics": ["Network security", "Security tools", "System protection", "Cybersecurity practices"]
        },
        {
            "id": "CEN4010",
            "name": "Software Engineering",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["COP3530"]}
            ],
            "terms": ["Spring"],
            "choiceGroup": null,
            "note": "Requires Data Structures.",
            "description": "Explores the processes used to plan, design, develop, and maintain software.",
            "topics": ["Software development life cycle", "Requirements", "Software design", "Testing and maintenance"]
        },
        {
            "id": "COP4813",
            "name": "Web Systems I",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["COP3530"]}
            ],
            "terms": ["Fall"],
            "choiceGroup": null,
            "note": "Requires Data Structures.",
            "description": "Introduces web development and the technologies used to build interactive websites.",
            "topics": ["HTML", "CSS", "JavaScript", "Web application development"]
        },
        {
            "id": "CEN4801",
            "name": "Systems Integration",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["COP4708"]},
                {"anyOf": ["COP3530"]}
            ],
            "terms": ["Fall"],
            "choiceGroup": null,
            "note": "Requires Applied Database I AND Data Structures.",
            "description": "Studies how different hardware and software systems are connected to work together.",
            "topics": ["System integration", "Business requirements", "Technology components", "Testing and implementation"]
        },
        {
            "id": "CIS4510",
            "name": "IT Project Management",
            "credits": 3,
            "prerequisites": [
                {"anyOf": ["CEN4801"]}
            ],
            "terms": ["Spring"],
            "choiceGroup": null,
            "note": "Requires Systems Integration.",
            "description": "Introduces project management methods used to plan and manage information technology projects.",
            "topics": ["Project planning", "Scheduling", "Risk management", "Project communication"]
        }
    ]
}`);


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


// 4. CHECK ALTERNATIVE COURSE SELECTIONS

function getSelectedCourseInGroup(groupName) {

    return advisorData.courses.find(course =>
        course.choiceGroup === groupName &&
        completedCourses.includes(course.id)
    );
}


// 5. DISPLAY PREREQUISITES AND COURSE DETAILS

function courseDetailsHTML(course) {

    const prerequisiteText = course.prerequisites.length === 0
        ? "None listed in this advisor."
        : course.prerequisites.map(requirement => {

            const options = requirement.anyOf.join(" OR ");

            return requirement.anyOf.length > 1
                ? `(${options})`
                : options;

        }).join(" AND ");

    return `
        <details class="course-details">
            <summary>View Course Details</summary>

            <p><strong>Description:</strong> ${course.description}</p>

            <p><strong>Prerequisites:</strong> ${prerequisiteText}</p>

            <p><strong>What You'll Learn:</strong></p>

            <ul>
                ${course.topics.map(topic => `<li>${topic}</li>`).join("")}
            </ul>
        </details>
    `;
}


// 6. DISPLAY COMPLETED COURSES

function renderCompletedCourses() {

    const container = document.getElementById("completed-courses");

    container.innerHTML = "";

    advisorData.courses.forEach(course => {

        const selectedCourse = course.choiceGroup
            ? getSelectedCourseInGroup(course.choiceGroup)
            : null;

        const isDisabled =
            selectedCourse && selectedCourse.id !== course.id;

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

            ${courseDetailsHTML(course)}
        `;

        container.appendChild(courseElement);

    });
}


// 7. DISPLAY AVAILABLE COURSES

function renderAvailableCourses() {

    const container = document.getElementById("available-courses");

    container.innerHTML = "";

    const availableCourses = advisorData.courses.filter(course =>
        !completedCourses.includes(course.id) &&
        prerequisitesMet(course)
    );

    if (availableCourses.length === 0) {

        container.innerHTML =
            "<p>No courses are currently available based on your selections.</p>";

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

            ${courseDetailsHTML(course)}

            <button class="add-course-button" data-course="${course.id}">
                Add to Course Plan
            </button>
        `;

        container.appendChild(courseElement);

    });
}


// 8. CREATE THE COURSE PLAN

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

        if (!course) return;

        const courseElement = document.createElement("div");

        courseElement.className = "course-card";

        courseElement.innerHTML = `
            <h3>${course.id} - ${course.name}</h3>

            <p>${course.credits} credits</p>

            ${courseDetailsHTML(course)}

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

        return total + (course ? course.credits : 0);

    }, 0);

    const total = document.createElement("p");

    total.innerHTML = `<strong>Total Credits: ${totalCredits}</strong>`;

    container.appendChild(total);
}


// 9. HANDLE COMPLETED COURSE EVENTS

document.getElementById("completed-courses").addEventListener("change", event => {

    if (event.target.classList.contains("completed-checkbox")) {

        const courseID = event.target.value;

        const course = advisorData.courses.find(item =>
            item.id === courseID
        );

        if (event.target.checked) {

            if (course.choiceGroup) {

                const selectedCourse = getSelectedCourseInGroup(course.choiceGroup);

                if (selectedCourse && selectedCourse.id !== courseID) {
                    event.target.checked = false;
                    return;
                }
            }

            if (!completedCourses.includes(courseID)) {
                completedCourses.push(courseID);
            }

        } else {

            completedCourses = completedCourses.filter(id =>
                id !== courseID
            );

        }

        coursePlan = coursePlan.filter(id => {

            const plannedCourse = advisorData.courses.find(course =>
                course.id === id
            );

            return plannedCourse && prerequisitesMet(plannedCourse);

        });

        renderAll();

    }

});


// 10. HANDLE ADD COURSE BUTTONS

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


// 11. REMOVE COURSES FROM THE PLAN

document.getElementById("course-plan").addEventListener("click", event => {

    if (event.target.classList.contains("remove-course-button")) {

        const courseID = event.target.dataset.course;

        coursePlan = coursePlan.filter(id =>
            id !== courseID
        );

        renderCoursePlan();

    }

});


// 12. UPDATE THE INTERFACE

function renderAll() {

    renderCompletedCourses();

    renderAvailableCourses();

    renderCoursePlan();

}


// 13. START THE ADVISOR

renderAll();
