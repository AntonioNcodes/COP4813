
"use strict";

/* ==========================================
   BSIT CLASS ADVISOR
   Daytona State College
   ========================================== */

const courses = [

    // SUPPORTING AND PREREQUISITE COURSES

    {
        id: "MAC1114",
        name: "Trigonometry",
        credits: 3,
        category: "Prerequisite",
        description: "Introduces trigonometric functions and their applications.",
        topics: ["Angles and triangles", "Trigonometric functions", "Identities"],
        prerequisites: []
    },
    {
        id: "MAC1140",
        name: "Pre-Calculus",
        credits: 3,
        category: "Prerequisite",
        description: "Prepares students for calculus through algebra and functions.",
        topics: ["Functions", "Algebra", "Graphs", "Trigonometry"],
        prerequisites: []
    },
    {
        id: "MAC2311C",
        name: "Calculus I",
        credits: 4,
        category: "Prerequisite",
        description: "Introduces limits, derivatives, and integration.",
        topics: ["Limits", "Derivatives", "Integrals"],
        prerequisites: []
    },
    {
        id: "STA2023",
        name: "Elementary Statistics",
        credits: 3,
        category: "Prerequisite",
        description: "Introduces statistical methods used to analyze and interpret data.",
        topics: ["Descriptive statistics", "Probability", "Data analysis"],
        prerequisites: []
    },
    {
        id: "COT3100",
        name: "Discrete Analysis",
        credits: 3,
        category: "Prerequisite",
        description: "Covers mathematical concepts used in computer science.",
        topics: ["Logic", "Sets", "Relations", "Algorithms"],
        prerequisites: []
    },
    {
        id: "MAD2104",
        name: "Discrete Mathematics",
        credits: 3,
        category: "Prerequisite",
        description: "Studies mathematical structures and reasoning used in computing.",
        topics: ["Logic", "Sets", "Combinatorics"],
        prerequisites: []
    },
    {
        id: "COP2360",
        name: "C# Computer Programming",
        credits: 3,
        category: "Prerequisite",
        description: "Introduces programming using the C# language.",
        topics: ["Variables", "Loops", "Methods", "Object-oriented programming"],
        prerequisites: []
    },
    {
        id: "COP2800",
        name: "Java Computer Programming",
        credits: 3,
        category: "Prerequisite",
        description: "Introduces programming concepts using Java.",
        topics: ["Java syntax", "Classes", "Methods", "Object-oriented programming"],
        prerequisites: []
    },
    {
        id: "CET3116",
        name: "Digital Technology",
        credits: 4,
        category: "Prerequisite",
        description: "Introduces digital electronics and computer hardware concepts.",
        topics: ["Digital logic", "Computer circuits", "Number systems"],
        prerequisites: []
    },
    {
        id: "EET3086",
        name: "Electrical Circuits",
        credits: 3,
        category: "Prerequisite",
        description: "Introduces electrical circuit principles and analysis.",
        topics: ["Voltage", "Current", "Resistance", "Circuit analysis"],
        prerequisites: []
    },
    {
        id: "ENC1101",
        name: "English Composition I",
        credits: 3,
        category: "Supporting Course",
        description: "Develops college-level writing, research, and communication skills.",
        topics: ["Essay writing", "Research", "Grammar", "Critical thinking"],
        prerequisites: []
    },
    {
        id: "MAC1105",
        name: "College Algebra",
        credits: 3,
        category: "Supporting Course",
        description: "Covers algebraic concepts used in higher-level mathematics.",
        topics: ["Equations", "Functions", "Polynomials", "Graphs"],
        prerequisites: []
    },
    {
        id: "EET1021C",
        name: "Introduction to Electrical Circuits",
        credits: 3,
        category: "Supporting Course",
        description: "Introduces basic electrical circuit concepts and laboratory work.",
        topics: ["Circuit components", "Voltage", "Current", "Measurements"],
        prerequisites: []
    },
    {
        id: "EGN3443",
        name: "Probability and Statistics for Engineers",
        credits: 3,
        category: "Supporting Course",
        description: "Applies probability and statistics to engineering problems.",
        topics: ["Probability", "Statistical analysis", "Data interpretation"],
        prerequisites: []
    },
    {
        id: "CET1600",
        name: "Network Fundamentals",
        credits: 3,
        category: "Supporting Course",
        description: "Introduces computer networking concepts and technologies.",
        topics: ["Network devices", "IP addressing", "Network models"],
        prerequisites: []
    },
    {
        id: "CET1112C",
        name: "Digital Fundamentals",
        credits: 3,
        category: "Supporting Course",
        description: "Introduces the digital systems used in computing.",
        topics: ["Binary numbers", "Logic gates", "Digital circuits"],
        prerequisites: []
    },

    // REQUIRED BSIT PROGRAM COURSES

    {
        id: "CTS3348",
        name: "Linux Administration",
        credits: 3,
        category: "Program",
        description: "Covers Linux system administration and command-line operations.",
        topics: ["Linux commands", "Users and permissions", "System administration"],
        prerequisites: []
    },
    {
        id: "GEB3213",
        name: "Business Writing",
        credits: 3,
        category: "Program",
        description: "Develops professional writing skills for business and technical workplaces.",
        topics: ["Business communication", "Professional writing", "Reports", "Presentations"],
        prerequisites: [["ENC1101"]]
    },
    {
        id: "CIS4250",
        name: "Ethics in Computing",
        credits: 1,
        category: "Program",
        description: "Explores ethical and professional responsibilities in computing.",
        topics: ["Computer ethics", "Privacy", "Security", "Professional responsibility"],
        prerequisites: [["GEB3213"]]
    },
    {
        id: "COP3530",
        name: "Data Structures",
        credits: 3,
        category: "Program",
        description: "Studies how computer programs organize, store, and process information.",
        topics: ["Arrays", "Linked lists", "Stacks", "Queues", "Trees", "Algorithms"],
        prerequisites: [
            ["COP2360", "COP2800"],
            ["COT3100", "MAD2104"]
        ]
    },
    {
        id: "CEN3722",
        name: "Human Computer Interfaces",
        credits: 3,
        category: "Program",
        description: "Studies how users interact with software and computer systems.",
        topics: ["User experience", "Interface design", "Usability", "Accessibility"],
        prerequisites: [["COP2360", "COP2800"]]
    },
    {
        id: "COP4708",
        name: "Applied Database I",
        credits: 3,
        category: "Program",
        description: "Introduces database design, development, and management.",
        topics: ["SQL", "Database design", "Tables", "Queries", "Relationships"],
        prerequisites: [["COP2360", "COP2800"]]
    },
    {
        id: "COP4610",
        name: "Operating Systems",
        credits: 3,
        category: "Program",
        description: "Explores how operating systems manage computer hardware and software resources.",
        topics: ["Processes", "Memory management", "File systems", "Linux"],
        prerequisites: [["CTS3348"]]
    },
    {
        id: "CIS4360",
        name: "Applied Cybersecurity",
        credits: 3,
        category: "Program",
        description: "Introduces practical cybersecurity concepts and techniques for protecting systems and networks.",
        topics: ["System security", "Network security", "Threats", "Security tools"],
        prerequisites: [
            ["CTS3348"],
            ["CET1600", "CNT3104"]
        ]
    },
    {
        id: "CNT3104",
        name: "Introduction to Telecommunications",
        credits: 2,
        category: "Program",
        description: "Introduces telecommunications systems and technologies used to transmit information.",
        topics: ["Communication systems", "Transmission", "Networking"],
        prerequisites: [["EET1021C", "EET3086"]]
    },
    {
        id: "CNT4007",
        name: "Data Communication",
        credits: 3,
        category: "Program",
        description: "Studies how data moves between computers and network devices.",
        topics: ["Data transmission", "Network protocols", "Communication media"],
        prerequisites: [
            ["CNT3104"],
            ["STA2023", "EGN3443"]
        ]
    },
    {
        id: "CNT4703",
        name: "Voice/Data Network Design",
        credits: 3,
        category: "Program",
        description: "Covers the design and planning of voice and data networks.",
        topics: ["Network design", "Network infrastructure", "Voice networks", "Data networks"],
        prerequisites: [["CNT4007"]]
    },
    {
        id: "CDA4101",
        name: "Computer Organization and Design",
        credits: 3,
        category: "Program",
        description: "Explores computer architecture and how hardware components work together.",
        topics: ["Computer architecture", "Processors", "Memory", "Digital systems"],
        prerequisites: [["CET1112C", "CET3116"]]
    },
    {
        id: "CEN4801",
        name: "Systems Integration",
        credits: 3,
        category: "Program",
        description: "Studies how hardware, software, networks, and business processes work together.",
        topics: ["System integration", "Testing", "Requirements", "Implementation"],
        prerequisites: [
            ["COP4708"],
            ["COP3530"]
        ]
    },
    {
        id: "CEN4010",
        name: "Software Engineering",
        credits: 3,
        category: "Program",
        description: "Covers the processes used to plan, design, develop, and maintain software.",
        topics: ["Software development", "Requirements", "Testing", "Project planning"],
        prerequisites: [["COP3530"]]
    },
    {
        id: "COP4813",
        name: "Web Systems I",
        credits: 3,
        category: "Program",
        description: "Introduces web application development and technologies used to build websites.",
        topics: ["HTML", "CSS", "JavaScript", "Web development"],
        prerequisites: [["COP3530"]]
    },
    {
        id: "CIS4510",
        name: "IT Project Management",
        credits: 3,
        category: "Program",
        description: "Introduces the planning and management of information technology projects.",
        topics: ["Project planning", "Scheduling", "Risk management", "Team coordination"],
        prerequisites: [["CEN4801"]]
    },

    // PROGRAM ELECTIVE OPTIONS

    {
        id: "CAI4002",
        name: "Introduction to Artificial Intelligence",
        credits: 3,
        category: "Program Elective",
        description: "Introduces artificial intelligence and its applications in modern technology.",
        topics: ["AI concepts", "Machine learning basics", "AI applications"],
        prerequisites: []
    },
    {
        id: "CAI4805",
        name: "AI Implementation and Maintenance",
        credits: 3,
        category: "Program Elective",
        description: "Explores the implementation and maintenance of artificial intelligence solutions.",
        topics: ["AI systems", "Implementation", "Maintenance", "Testing"],
        prerequisites: []
    },
    {
        id: "CAP3744",
        name: "Data Analytics and Visualization",
        credits: 3,
        category: "Program Elective",
        description: "Introduces tools and methods for analyzing and presenting data.",
        topics: ["Data analysis", "Visualization", "Reports", "Data interpretation"],
        prerequisites: []
    },
    {
        id: "COP4709",
        name: "Applied Database II",
        credits: 3,
        category: "Program Elective",
        description: "Builds on database concepts and explores advanced database applications.",
        topics: ["Advanced SQL", "Database development", "Database applications"],
        prerequisites: [["COP4708"]]
    },
    {
        id: "COP4834",
        name: "Applied Web Systems II",
        credits: 3,
        category: "Program Elective",
        description: "Builds on web development skills through more advanced web applications.",
        topics: ["Advanced web development", "Web applications", "Programming"],
        prerequisites: [["COP4813"]]
    },
    {
        id: "CET4860",
        name: "Introduction to Digital Forensics",
        credits: 3,
        category: "Program Elective",
        description: "Introduces methods used to identify and examine digital evidence.",
        topics: ["Digital evidence", "Forensic tools", "Evidence collection"],
        prerequisites: []
    },
    {
        id: "CET4861",
        name: "Advanced Digital Forensics",
        credits: 3,
        category: "Program Elective",
        description: "Explores advanced techniques for examining digital evidence.",
        topics: ["Forensic analysis", "Evidence examination", "Investigation methods"],
        prerequisites: [["CET4860"]]
    },
    {
        id: "CET4862",
        name: "Network Forensics and Incident Response",
        credits: 3,
        category: "Program Elective",
        description: "Covers network investigations and responding to cybersecurity incidents.",
        topics: ["Network evidence", "Incident response", "Traffic analysis"],
        prerequisites: []
    },
    {
        id: "CET4884",
        name: "Security Methods and Practices",
        credits: 3,
        category: "Program Elective",
        description: "Explores methods and practices used to protect information systems.",
        topics: ["Security policies", "Risk management", "Security controls"],
        prerequisites: []
    }
];


// ==========================================
// STUDENT SELECTIONS
// ==========================================

const completedCourses = new Set();
const plannedCourses = [];


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getCourse(courseId) {
    return courses.find(course => course.id === courseId);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function getPrerequisiteText(course) {
    if (!course.prerequisites.length) {
        return "No prerequisite rule entered in this advisor.";
    }

    return course.prerequisites.map(group => {
        if (group.length === 1) {
            return group[0];
        }

        return "(" + group.join(" OR ") + ")";
    }).join(" AND ");
}

function prerequisitesMet(course) {
    return course.prerequisites.every(group =>
        group.some(prerequisiteId => completedCourses.has(prerequisiteId))
    );
}

function getTotalCredits(courseIds) {
    return courseIds.reduce((total, courseId) => {
        const course = getCourse(courseId);
        return total + (course ? course.credits : 0);
    }, 0);
}


// ==========================================
// COURSE CARDS
// ==========================================

function getCourseCard(course) {
    const isCompleted = completedCourses.has(course.id);
    const isPlanned = plannedCourses.includes(course.id);
    const eligible = prerequisitesMet(course);

    let status = "Prerequisites met";
    let statusClass = "eligible";

    if (isCompleted) {
        status = "Completed";
        statusClass = "completed";
    } else if (isPlanned) {
        status = "In semester plan";
        statusClass = "planned";
    } else if (!eligible) {
        status = "Prerequisites not met";
        statusClass = "not-eligible";
    }

    let button = "";

    if (!isCompleted && !isPlanned && eligible) {
        button = `
            <button type="button"
                data-add-course="${escapeHTML(course.id)}">
                Add to Semester Plan
            </button>
        `;
    }

    return `
        <article class="course-card">
            <div class="course-card-header">
                <h3>${escapeHTML(course.id)} – ${escapeHTML(course.name)}</h3>
                <span>${course.credits} credits</span>
            </div>

            <p><strong>Category:</strong> ${escapeHTML(course.category)}</p>

            <p>${escapeHTML(course.description)}</p>

            <p><strong>Topics covered:</strong></p>
            <ul>
                ${course.topics.map(topic =>
                    `<li>${escapeHTML(topic)}</li>`
                ).join("")}
            </ul>

            <p>
                <strong>Prerequisites:</strong>
                ${escapeHTML(getPrerequisiteText(course))}
            </p>

            <p class="course-status ${statusClass}">${status}</p>

            ${button}
        </article>
    `;
}


// ==========================================
// COMPLETED COURSE CHECKLIST
// ==========================================

function renderCompletedCourses() {
    const container = document.getElementById("completed-courses");

    if (!container) {
        throw new Error('HTML is missing id="completed-courses"');
    }

    const categories = [...new Set(courses.map(course => course.category))];

    container.innerHTML = categories.map(category => {
        const categoryCourses = courses.filter(course =>
            course.category === category
        );

        return `
            <section class="course-group">
                <h3>${escapeHTML(category)}</h3>

                <div class="course-checkbox-list">
                    ${categoryCourses.map(course => `
                        <label class="completed-course-option">
                            <input
                                type="checkbox"
                                data-completed-course="${escapeHTML(course.id)}"
                                ${completedCourses.has(course.id) ? "checked" : ""}
                            >

                            <span>
                                <strong>${escapeHTML(course.id)}</strong>
                                – ${escapeHTML(course.name)}
                                (${course.credits} credits)
                            </span>
                        </label>
                    `).join("")}
                </div>
            </section>
        `;
    }).join("");
}


// ==========================================
// AVAILABLE COURSES
// ==========================================

function renderAvailableCourses() {
    const container = document.getElementById("available-courses");

    if (!container) {
        throw new Error('HTML is missing id="available-courses"');
    }

    const programCourses = courses.filter(course =>
        course.category === "Program" ||
        course.category === "Program Elective"
    );

    container.innerHTML = programCourses.map(course =>
        getCourseCard(course)
    ).join("");
}


// ==========================================
// SEMESTER PLAN
// ==========================================

function renderCoursePlan() {
    const container = document.getElementById("course-plan");

    if (!container) {
        throw new Error('HTML is missing id="course-plan"');
    }

    if (plannedCourses.length === 0) {
        container.innerHTML = `
            <p>You have not added any courses to your semester plan yet.</p>
        `;
        updateProgress();
        return;
    }

    container.innerHTML = `
        <div class="semester-plan-list">
            ${plannedCourses.map(courseId => {
                const course = getCourse(courseId);

                return `
                    <article class="course-card">
                        <div class="course-card-header">
                            <h3>${escapeHTML(course.id)} – ${escapeHTML(course.name)}</h3>
                            <span>${course.credits} credits</span>
                        </div>

                        <p>${escapeHTML(course.description)}</p>

                        <button
                            type="button"
                            data-remove-course="${escapeHTML(course.id)}">
                            Remove from Plan
                        </button>
                    </article>
                `;
            }).join("")}
        </div>

        <p class="plan-total">
            <strong>Total planned credits:</strong>
            ${getTotalCredits(plannedCourses)} credits
        </p>
    `;

    updateProgress();
}


// ==========================================
// PROGRESS SUMMARY
// ==========================================

function updateProgress() {
    const container = document.getElementById("progress-summary");

    if (!container) return;

    const completedCreditTotal = getTotalCredits(
        Array.from(completedCourses)
    );

    const plannedCreditTotal = getTotalCredits(plannedCourses);

    container.innerHTML = `
        <p><strong>Completed courses:</strong> ${completedCourses.size}</p>
        <p><strong>Completed credits:</strong> ${completedCreditTotal}</p>
        <p><strong>Courses in semester plan:</strong> ${plannedCourses.length}</p>
        <p><strong>Planned credits:</strong> ${plannedCreditTotal}</p>
    `;
}


// ==========================================
// ADD COURSE TO PLAN
// ==========================================

function addCourseToPlan(courseId) {
    const course = getCourse(courseId);

    if (!course) return;

    if (completedCourses.has(courseId)) {
        alert("You have already completed this course.");
        return;
    }

    if (plannedCourses.includes(courseId)) {
        alert("This course is already in your semester plan.");
        return;
    }

    if (!prerequisitesMet(course)) {
        alert("You have not completed the prerequisites for this course.");
        return;
    }

    // Students can add multiple program electives.
    plannedCourses.push(courseId);

    renderAll();
}


// ==========================================
// REMOVE COURSE FROM PLAN
// ==========================================

function removeCourseFromPlan(courseId) {
    const index = plannedCourses.indexOf(courseId);

    if (index !== -1) {
        plannedCourses.splice(index, 1);
    }

    renderAll();
}


// ==========================================
// UPDATE COMPLETED COURSES
// ==========================================

function updateCompletedCourse(courseId, checked) {
    if (checked) {
        completedCourses.add(courseId);

        const index = plannedCourses.indexOf(courseId);

        if (index !== -1) {
            plannedCourses.splice(index, 1);
        }
    } else {
        completedCourses.delete(courseId);
    }

    renderAll();
}


// ==========================================
// RENDER ALL SECTIONS
// ==========================================

function renderAll() {
    renderCompletedCourses();
    renderAvailableCourses();
    renderCoursePlan();
    updateProgress();
}


// ==========================================
// EVENT HANDLING
// ==========================================

// Handles completed-course checkboxes.
document.addEventListener("change", function(event) {
    const courseId = event.target.dataset.completedCourse;

    if (courseId) {
        updateCompletedCourse(courseId, event.target.checked);
    }
});

// Handles dynamically created Add and Remove buttons.
document.addEventListener("click", function(event) {
    const addButton = event.target.closest("[data-add-course]");

    if (addButton) {
        addCourseToPlan(addButton.dataset.addCourse);
        return;
    }

    const removeButton = event.target.closest("[data-remove-course]");

    if (removeButton) {
        removeCourseFromPlan(removeButton.dataset.removeCourse);
    }
});


// ==========================================
// START ADVISOR
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    try {
        renderAll();
    } catch (error) {
        console.error("BSIT Class Advisor error:", error);

        const app = document.getElementById("advisor-app");

        if (app) {
            app.innerHTML = `
                <h2>Unable to load the BSIT Class Advisor</h2>
                <p>Please check the HTML element IDs and JavaScript file.</p>
            `;
        }
    }
});
