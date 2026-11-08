"use strict";

// =====================================================
// BSIT CLASS ADVISOR
// Daytona State College - 2026-2027 catalog
// =====================================================

// -----------------------------------------------------
// 1. PROGRAM INFORMATION
// -----------------------------------------------------

const advisorData = {
    program: "Bachelor of Science in Information Technology",
    college: "Daytona State College",
    catalogYear: "2026-2027",

    requirements: {
        generalEducation: 36,
        lowerLevel: 44,
        upperLevel: 48,
        total: 128
    }
};


// -----------------------------------------------------
// 2. COURSE INFORMATION
// -----------------------------------------------------
// Each course is represented as a JavaScript object.
// Prerequisites use AND between groups and OR within
// each group.
//
// Example:
// [
//   ["COP2800", "COP2220", "COP2360"],
//   ["COT3100", "MAD2104"]
// ]
//
// This means:
// One programming course AND one discrete math course.
// -----------------------------------------------------

const courses = [

    // ================= LOWER-LEVEL COURSES =================

    {
        id: "MAC1114",
        name: "College Trigonometry",
        credits: 3,
        category: "Lower-Level",
        description: "Develops mathematical skills for solving problems involving angles, triangles, and trigonometric functions.",
        topics: ["Angles and triangles", "Trigonometric functions", "Identities", "Applications"],
        prerequisites: [],
        notes: "Required mathematics course."
    },

    {
        id: "MAC1140",
        name: "Pre-Calculus",
        credits: 3,
        category: "Lower-Level",
        description: "Prepares students for calculus by developing algebraic and mathematical function skills.",
        topics: ["Functions", "Graphs", "Polynomial functions", "Exponential and logarithmic functions"],
        prerequisites: [],
        notes: "Check the catalog for the mathematics pathway that applies to your degree audit."
    },

    {
        id: "MAC2311C",
        name: "Calculus I",
        credits: 4,
        category: "Lower-Level",
        description: "Introduces limits, derivatives, and integrals and their applications.",
        topics: ["Limits", "Derivatives", "Rates of change", "Integrals"],
        prerequisites: [],
        notes: "One calculus option listed by DSC."
    },

    {
        id: "EGN2045",
        name: "Engineering and Technology Calculus I",
        credits: 4,
        category: "Lower-Level",
        description: "Introduces calculus concepts and their applications to engineering and technology problems.",
        topics: ["Limits", "Derivatives", "Rates of change", "Applied calculus"],
        prerequisites: [],
        notes: "Alternative calculus option listed in the current catalog."
    },

    {
        id: "STA2023",
        name: "Elementary Statistics",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces methods for collecting, organizing, analyzing, and interpreting data.",
        topics: ["Descriptive statistics", "Probability", "Distributions", "Hypothesis testing"],
        prerequisites: [],
        notes: "One statistics option listed by DSC."
    },

    {
        id: "EGN3443",
        name: "Probability and Statistics for Engineers",
        credits: 3,
        category: "Lower-Level",
        description: "Applies probability and statistical methods to engineering and technical problems.",
        topics: ["Probability", "Statistical distributions", "Sampling", "Statistical analysis"],
        prerequisites: [],
        notes: "Alternative statistics option listed in the current catalog."
    },

    {
        id: "COT3100",
        name: "Discrete Computational Analysis",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces mathematical reasoning and structures used in computer science.",
        topics: ["Logic", "Sets", "Relations", "Combinatorics", "Graph theory"],
        prerequisites: [],
        notes: "Recommended discrete mathematics option."
    },

    {
        id: "MAD2104",
        name: "Discrete Mathematics",
        credits: 3,
        category: "Lower-Level",
        description: "Covers mathematical concepts used in computing, programming, and problem solving.",
        topics: ["Logic", "Sets", "Counting", "Relations", "Graphs"],
        prerequisites: [],
        notes: "Alternative discrete mathematics option."
    },

    {
        id: "COP1000",
        name: "Principles of Computer Programming",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces basic programming concepts and problem-solving techniques.",
        topics: ["Variables", "Data types", "Conditions", "Loops", "Programming logic"],
        prerequisites: [],
        notes: "Required programming foundation."
    },

    {
        id: "COP2220",
        name: "C++ Computer Programming",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces programming and problem-solving using the C++ language.",
        topics: ["C++ syntax", "Variables", "Functions", "Loops", "Object-oriented concepts"],
        prerequisites: [],
        notes: "One option for the second programming course."
    },

    {
        id: "COP2360",
        name: "C# Computer Programming",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces programming and application development using C#.",
        topics: ["C# syntax", "Variables", "Methods", "Classes", "Objects"],
        prerequisites: [],
        notes: "Choose one second programming course, not all three."
    },

    {
        id: "COP2800",
        name: "Java Computer Programming",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces programming and object-oriented development using Java.",
        topics: ["Java syntax", "Variables", "Methods", "Classes", "Inheritance"],
        prerequisites: [],
        notes: "Choose one second programming course, not all three."
    },

    {
        id: "CET3116",
        name: "Digital Technology",
        credits: 4,
        category: "Lower-Level",
        description: "Introduces digital systems and the technical concepts behind computer hardware.",
        topics: ["Digital logic", "Number systems", "Logic gates", "Digital circuits"],
        prerequisites: [],
        notes: "Recommended digital technology option."
    },

    {
        id: "CET1112C",
        name: "Digital Fundamentals and Lab",
        credits: 4,
        category: "Lower-Level",
        description: "Introduces digital electronics through technical concepts and laboratory activities.",
        topics: ["Digital number systems", "Logic gates", "Boolean algebra", "Digital circuits"],
        prerequisites: [],
        notes: "Alternative digital technology option. Verify credits with the catalog."
    },

    {
        id: "EET3086",
        name: "Principles of Electrical Circuits",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces electrical circuit concepts and methods for analyzing circuits.",
        topics: ["Voltage", "Current", "Resistance", "Circuit analysis"],
        prerequisites: [],
        notes: "Recommended electrical fundamentals option."
    },

    {
        id: "EET3085",
        name: "Principles of Electrical Circuits (DC)",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces direct-current circuit principles and circuit analysis.",
        topics: ["Voltage", "Current", "Resistance", "DC circuit analysis"],
        prerequisites: [],
        notes: "Alternative electrical fundamentals pathway. Check the required companion course."
    },

    {
        id: "EET1011C",
        name: "Introduction to Electrical Circuits and Lab",
        credits: 3,
        category: "Lower-Level",
        description: "Introduces basic electrical circuit concepts through instruction and laboratory activities.",
        topics: ["Electrical safety", "Voltage", "Current", "Circuit components", "Measurements"],
        prerequisites: [],
        notes: "Alternative electrical fundamentals pathway. Confirm the credit value on your degree audit."
    },

    {
        id: "EET1021C",
        name: "Electrical Circuits and Lab",
        credits: 3,
        category: "Lower-Level",
        description: "Develops additional electrical circuit knowledge through technical instruction and laboratory work.",
        topics: ["Electrical circuits", "Circuit measurements", "Components", "Circuit analysis"],
        prerequisites: [],
        notes: "May be required with an electrical fundamentals option."
    },

    // ================= REQUIRED PROGRAM COURSES =================

    {
        id: "GEB3213",
        name: "Business Writing",
        credits: 3,
        category: "Program",
        description: "Develops professional writing and communication skills used in business and workplace settings.",
        topics: ["Professional emails", "Business documents", "Reports", "Workplace communication"],
        prerequisites: [],
        notes: "Program-specific course."
    },

    {
        id: "CIS4250",
        name: "Ethical Issues in IT",
        credits: 1,
        category: "Program",
        description: "Examines ethical responsibilities and challenges involving information technology.",
        topics: ["Technology ethics", "Privacy", "Intellectual property", "Professional conduct"],
        prerequisites: [],
        notes: "Program-specific course."
    },

    {
        id: "COP3530",
        name: "Data Structures",
        credits: 3,
        category: "Program",
        description: "Introduces methods for organizing, storing, searching, and processing information in computer programs.",
        topics: ["Data structures", "Searching", "Sorting", "Queues", "Algorithms"],
        prerequisites: [
            ["COP2800", "COP2220", "COP2360"],
            ["COT3100", "MAD2104"]
        ],
        notes: "Requires one programming option AND one discrete mathematics option."
    },

    {
        id: "CEN3722",
        name: "Human Computer Interfaces",
        credits: 3,
        category: "Program",
        description: "Focuses on designing and evaluating how people interact with computer systems.",
        topics: ["User interface design", "Usability", "User experience", "Accessibility"],
        prerequisites: [
            ["COP2800", "COP2220", "COP2360"]
        ],
        notes: "Programming prerequisite shown in earlier catalog information; verify against your catalog year."
    },

    {
        id: "COP4708",
        name: "Applied Database I",
        credits: 3,
        category: "Program",
        description: "Introduces database concepts and the development and management of database systems.",
        topics: ["Database design", "Tables", "Relationships", "SQL", "Queries"],
        prerequisites: [
            ["COP2800", "COP2220", "COP2360"]
        ],
        notes: "Programming prerequisite shown in earlier catalog information; verify against your catalog year."
    },

    {
        id: "COP4610",
        name: "Operating Systems",
        credits: 3,
        category: "Program",
        description: "Examines how operating systems manage hardware and software resources.",
        topics: ["Processes", "Memory management", "File systems", "Scheduling"],
        prerequisites: [
            ["CTS3348"]
        ],
        notes: "Linux Administration is listed as the prerequisite in earlier catalog information."
    },

    {
        id: "CIS4360",
        name: "Applied Cybersecurity",
        credits: 3,
        category: "Program",
        description: "Introduces technologies and practices used to protect computer systems, networks, and information.",
        topics: ["Cryptography", "Authentication", "Digital signatures", "Firewalls", "Intrusion detection"],
        prerequisites: [
            ["CTS3348"],
            ["CET1600", "CNT3104"]
        ],
        notes: "Requires CTS3348 AND one of CET1600 or CNT3104, based on earlier catalog information."
    },

    {
        id: "CNT3104",
        name: "Introduction to Telecommunications",
        credits: 2,
        category: "Program",
        description: "Introduces technologies and concepts used to transmit information through communication networks.",
        topics: ["Telecommunications", "Communication systems", "Network fundamentals", "Data transmission"],
        prerequisites: [],
        notes: "Earlier catalog information lists EET1021C or EET3086 as a prerequisite. Verify for your catalog year."
    },

    {
        id: "CNT4007",
        name: "Data and Computer Communications",
        credits: 3,
        category: "Program",
        description: "Examines how computers exchange information through communication systems and networks.",
        topics: ["Data communication", "Network architecture", "Transmission media", "Protocols"],
        prerequisites: [
            ["CNT3104"],
            ["STA2023", "EGN3443"]
        ],
        notes: "Requires CNT3104 AND one statistics option, based on earlier catalog information."
    },

    {
        id: "CNT4703",
        name: "Voice and Data Network Design",
        credits: 3,
        category: "Program",
        description: "Introduces planning and design of networks that support voice and data communication.",
        topics: ["Network design", "Voice communication", "Data networks", "Network infrastructure"],
        prerequisites: [
            ["CNT4007"]
        ],
        notes: "CNT4007 is listed as a prerequisite in earlier catalog information."
    },

    {
        id: "CDA4101",
        name: "Computer Organization and Design",
        credits: 3,
        category: "Program",
        description: "Examines how computer hardware components work together to execute instructions.",
        topics: ["Computer architecture", "Processor organization", "Memory systems", "Instruction sets"],
        prerequisites: [
            ["CET1112C", "CET3116"]
        ],
        notes: "Digital Technology or Digital Fundamentals is listed as a prerequisite in earlier catalog information."
    },

    {
        id: "CEN4801",
        name: "Systems Integration",
        credits: 3,
        category: "Program",
        description: "Examines how separate hardware and software components are combined into a functioning system.",
        topics: ["System architecture", "Integration planning", "Hardware and software", "Testing"],
        prerequisites: [
            ["COP4708"],
            ["COP3530"]
        ],
        notes: "Requires both Applied Database I and Data Structures, based on earlier catalog information."
    },

    {
        id: "CEN4010",
        name: "Software Engineering",
        credits: 3,
        category: "Program",
        description: "Introduces methods for planning, designing, developing, testing, and maintaining software.",
        topics: ["Software development life cycle", "Requirements", "Software design", "Testing"],
        prerequisites: [
            ["COP3530"]
        ],
        notes: "Data Structures is listed as a prerequisite in earlier catalog information."
    },

    {
        id: "COP4813",
        name: "Web Systems I",
        credits: 3,
        category: "Program",
        description: "Introduces the development and implementation of web-based applications and systems.",
        topics: ["HTML", "CSS", "JavaScript", "Web programming", "Client-side development"],
        prerequisites: [
            ["COP3530"]
        ],
        notes: "Data Structures is listed as a prerequisite in earlier catalog information."
    },

    {
        id: "CIS4510",
        name: "IT Project Management",
        credits: 3,
        category: "Program",
        description: "Introduces methods used to plan, organize, manage, and complete IT projects.",
        topics: ["Project planning", "Scheduling", "Budgets", "Risk management", "Project teams"],
        prerequisites: [
            ["CEN4801"]
        ],
        notes: "Systems Integration is listed as a prerequisite in earlier catalog information."
    },

    {
        id: "CTS3348",
        name: "Linux Administration",
        credits: 3,
        category: "Program",
        description: "Introduces the administration and maintenance of Linux operating systems.",
        topics: ["Linux commands", "User management", "File permissions", "System administration", "Networking"],
        prerequisites: [],
        notes: "Required program-specific course in the current catalog."
    },

    // ================= PROGRAM ELECTIVES =================

    {
        id: "CAI4002",
        name: "Introduction to Artificial Intelligence",
        credits: 3,
        category: "Program Elective",
        description: "Introduces concepts and applications of artificial intelligence.",
        topics: ["AI fundamentals", "Intelligent systems", "Machine learning concepts", "AI applications"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CAI4805",
        name: "Artificial Intelligence Implementation and Maintenance",
        credits: 3,
        category: "Program Elective",
        description: "Focuses on implementing and maintaining artificial intelligence solutions.",
        topics: ["AI implementation", "Model deployment", "Testing", "System maintenance"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CAP3744",
        name: "Data Analytics and Visualization",
        credits: 3,
        category: "Program Elective",
        description: "Introduces techniques for analyzing data and presenting findings visually.",
        topics: ["Data analysis", "Data preparation", "Charts", "Data visualization"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "COP4709",
        name: "Applied Database II",
        credits: 3,
        category: "Program Elective",
        description: "Builds on database fundamentals and explores more advanced database development and management.",
        topics: ["Advanced SQL", "Database development", "Data management", "Database applications"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "COP4834",
        name: "Web Systems II",
        credits: 3,
        category: "Program Elective",
        description: "Builds on web development fundamentals and explores more advanced web application development.",
        topics: ["Advanced web development", "Web applications", "Client-side programming", "Web technologies"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CET4860",
        name: "Introduction to Digital Forensics",
        credits: 3,
        category: "Program Elective",
        description: "Introduces methods used to identify, collect, preserve, and examine digital evidence.",
        topics: ["Digital evidence", "Evidence preservation", "Forensic procedures", "Computer investigations"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CET4861",
        name: "Advanced Digital Forensics",
        credits: 3,
        category: "Program Elective",
        description: "Explores advanced methods for investigating digital devices and analyzing evidence.",
        topics: ["Digital investigations", "Forensic analysis", "Evidence examination", "Investigation methods"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CET4862",
        name: "Network Forensics and Incident Response",
        credits: 3,
        category: "Program Elective",
        description: "Examines network investigations and responses to cybersecurity incidents.",
        topics: ["Network evidence", "Incident response", "Network investigations", "Security events"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    },

    {
        id: "CET4884",
        name: "Security Methods and Practice",
        credits: 3,
        category: "Program Elective",
        description: "Examines methods and professional practices used to protect information systems.",
        topics: ["Security practices", "Risk assessment", "Security controls", "Threats"],
        prerequisites: [],
        notes: "Choose ONE approved 3-credit program elective."
    }

];


// -----------------------------------------------------
// 3. APPLICATION STATE
// -----------------------------------------------------

const completedCourses = new Set();
const plannedCourses = [];

let generalEducationCredits = 0;
let lowerLevelCredits = 0;


// -----------------------------------------------------
// 4. HELPER FUNCTIONS
// -----------------------------------------------------

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


function getCourse(courseId) {
    return courses.find(course => course.id === courseId);
}


function isCompleted(courseId) {
    return completedCourses.has(courseId);
}


function getPrerequisiteText(course) {
    if (!course.prerequisites || course.prerequisites.length === 0) {
        return "No prerequisite entered in this advisor.";
    }

    return course.prerequisites
        .map(group => {
            return "(" + group.join(" OR ") + ")";
        })
        .join(" AND ");
}


function prerequisitesMet(course) {
    if (!course.prerequisites || course.prerequisites.length === 0) {
        return true;
    }

    return course.prerequisites.every(group =>
        group.some(courseId => isCompleted(courseId))
    );
}


function getStatus(course) {
    if (isCompleted(course.id)) {
        return "Completed";
    }

    if (prerequisitesMet(course)) {
        return "Eligible";
    }

    return "Prerequisites needed";
}


function getCourseCard(course, showButton = true) {
    const status = getStatus(course);
    const isPlanned = plannedCourses.some(item => item.id === course.id);

    const topicsHTML = course.topics.map(topic =>
        `<li>${escapeHTML(topic)}</li>`
    ).join("");

    let buttonHTML = "";

    if (showButton && !isCompleted(course.id) && !isPlanned) {
        buttonHTML = `
            <button
                type="button"
                class="primary-button add-course-button"
                data-course="${escapeHTML(course.id)}">
                Add to Semester Plan
            </button>
        `;
    } else if (isPlanned) {
        buttonHTML = `<span class="planned-label">Already planned</span>`;
    } else if (isCompleted(course.id)) {
        buttonHTML = `<span class="completed-label">Completed</span>`;
    }

    return `
        <article class="course-card">
            <div class="course-card-top">
                <div>
                    <span class="course-code">${escapeHTML(course.id)}</span>
                    <h3>${escapeHTML(course.name)}</h3>
                </div>

                <span class="credit-label">
                    ${course.credits} credits
                </span>
            </div>

            <p class="course-description">
                ${escapeHTML(course.description)}
            </p>

            <div class="course-status ${status.toLowerCase().replaceAll(" ", "-")}">
                ${status}
            </div>

            <details class="course-details">
                <summary>View Course Information</summary>

                <p>
                    <strong>Course:</strong>
                    ${escapeHTML(course.name)}
                </p>

                <p>
                    <strong>Course Code:</strong>
                    ${escapeHTML(course.id)}
                </p>

                <p>
                    <strong>Credits:</strong>
                    ${course.credits}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${escapeHTML(course.description)}
                </p>

                <p><strong>Topics Covered:</strong></p>
                <ul>${topicsHTML}</ul>

                <p>
                    <strong>Prerequisites:</strong>
                    ${escapeHTML(getPrerequisiteText(course))}
                </p>

                <p>
                    <strong>Additional Information:</strong>
                    ${escapeHTML(course.notes || "No additional notes.")}
                </p>
            </details>

            ${buttonHTML}
        </article>
    `;
}


// -----------------------------------------------------
// 5. MAIN PAGE RENDERING
// -----------------------------------------------------

function renderAdvisor() {
    const app = document.getElementById("advisor-app");

    app.innerHTML = `
        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">01</span>
                <div>
                    <h2>Program Overview</h2>
                    <p>Explore the credit requirements for the BSIT degree.</p>
                </div>
            </div>

            <div class="overview-grid">
                <div class="overview-card">
                    <span>General Education</span>
                    <strong>36</strong>
                    <small>Credit hours</small>
                </div>

                <div class="overview-card">
                    <span>Lower-Level Technical</span>
                    <strong>44</strong>
                    <small>Credit hours</small>
                </div>

                <div class="overview-card">
                    <span>Upper-Level Program</span>
                    <strong>48</strong>
                    <small>Credit hours</small>
                </div>

                <div class="overview-card total-card">
                    <span>Total Degree</span>
                    <strong>128</strong>
                    <small>Credit hours</small>
                </div>
            </div>
        </section>

        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">02</span>
                <div>
                    <h2>Select Completed Courses</h2>
                    <p>
                        Check the courses you have already completed.
                        Your selections update the eligibility list.
                    </p>
                </div>
            </div>

            <div class="input-group">
                <label for="course-search">Find a course</label>
                <input
                    type="search"
                    id="course-search"
                    placeholder="Search by course code or name...">
            </div>

            <div id="completed-course-list"></div>

            <p class="helper-text">
                Only select courses you have successfully completed.
                Courses with an OR option are alternatives; you do not
                need to complete every alternative.
            </p>
        </section>

        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">03</span>
                <div>
                    <h2>Course Eligibility</h2>
                    <p>
                        Courses are evaluated using their prerequisite
                        information and your completed-course selections.
                    </p>
                </div>
            </div>

            <div class="filter-row">
                <label for="eligibility-filter">Show courses</label>

                <select id="eligibility-filter">
                    <option value="all">All courses</option>
                    <option value="eligible">Eligible courses</option>
                    <option value="blocked">Prerequisites needed</option>
                    <option value="completed">Completed courses</option>
                </select>
            </div>

            <div id="eligible-course-list" class="course-grid"></div>
        </section>

        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">04</span>
                <div>
                    <h2>Semester Planner</h2>
                    <p>
                        Add eligible courses to organize a possible
                        semester schedule.
                    </p>
                </div>
            </div>

            <div class="planner-controls">
                <div class="input-group">
                    <label for="semester-name">Semester</label>
                    <select id="semester-name">
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                    </select>
                </div>

                <div class="input-group">
                    <label for="semester-year">Year</label>
                    <input
                        type="number"
                        id="semester-year"
                        value="2027"
                        min="2026"
                        max="2040">
                </div>
            </div>

            <div id="semester-plan"></div>
        </section>

        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">05</span>
                <div>
                    <h2>Graduation Progress</h2>
                    <p>
                        Track your progress toward the 128-credit
                        BSIT degree.
                    </p>
                </div>
            </div>

            <div class="progress-inputs">
                <div class="input-group">
                    <label for="general-credits">
                        Completed General Education Credits
                    </label>
                    <input
                        type="number"
                        id="general-credits"
                        min="0"
                        max="36"
                        value="0">
                </div>

                <div class="input-group">
                    <label for="lower-credits">
                        Completed Lower-Level Technical Credits
                    </label>
                    <input
                        type="number"
                        id="lower-credits"
                        min="0"
                        max="44"
                        value="0">
                </div>
            </div>

            <p class="helper-text">
                Enter the credits shown as completed on your degree audit.
                Include lower-level courses in the lower-level total.
                Do not count the same credits twice.
            </p>

            <div id="graduation-progress"></div>
        </section>

        <section class="advisor-section">
            <div class="section-heading">
                <span class="section-number">06</span>
                <div>
                    <h2>Program Course Information</h2>
                    <p>
                        Browse all required upper-level courses and
                        approved program electives.
                    </p>
                </div>
            </div>

            <div id="program-course-information" class="course-grid"></div>
        </section>
    `;

    renderCompletedCourses();
    renderEligibleCourses();
    renderSemesterPlan();
    renderGraduationProgress();
    renderProgramInformation();
    attachEvents();
}


// -----------------------------------------------------
// 6. COMPLETED COURSE SELECTION
// -----------------------------------------------------

function renderCompletedCourses(searchTerm = "") {
    const container = document.getElementById("completed-course-list");

    const filteredCourses = courses.filter(course => {
        const searchText =
            (course.id + " " + course.name).toLowerCase();

        return searchText.includes(searchTerm.toLowerCase());
    });

    const groups = {
        "Lower-Level": filteredCourses.filter(course => course.category === "Lower-Level"),
        "Program": filteredCourses.filter(course => course.category === "Program"),
        "Program Elective": filteredCourses.filter(course => course.category === "Program Elective")
    };

    container.innerHTML = Object.entries(groups).map(([groupName, groupCourses]) => {
        if (groupCourses.length === 0) return "";

        return `
            <div class="completed-group">
                <h3>${escapeHTML(groupName)} Courses</h3>

                <div class="checkbox-grid">
                    ${groupCourses.map(course => `
                        <label class="course-checkbox">
                            <input
                                type="checkbox"
                                class="completed-course-checkbox"
                                value="${escapeHTML(course.id)}"
                                ${isCompleted(course.id) ? "checked" : ""}>
                            <span>
                                <strong>${escapeHTML(course.id)}</strong>
                                <small>${escapeHTML(course.name)}</small>
                            </span>
                        </label>
                    `).join("")}
                </div>
            </div>
        `;
    }).join("");
}


// -----------------------------------------------------
// 7. COURSE ELIGIBILITY
// -----------------------------------------------------

function renderEligibleCourses() {
    const container = document.getElementById("eligible-course-list");
    const filter = document.getElementById("eligibility-filter").value;

    let filteredCourses = courses;

    if (filter === "eligible") {
        filteredCourses = courses.filter(course =>
            !isCompleted(course.id) && prerequisitesMet(course)
        );
    }

    if (filter === "blocked") {
        filteredCourses = courses.filter(course =>
            !isCompleted(course.id) && !prerequisitesMet(course)
        );
    }

    if (filter === "completed") {
        filteredCourses = courses.filter(course =>
            isCompleted(course.id)
        );
    }

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No courses match this filter.
            </p>
        `;
        return;
    }

    container.innerHTML = filteredCourses.map(course =>
        getCourseCard(course)
    ).join("");
}


// -----------------------------------------------------
// 8. SEMESTER PLANNER
// -----------------------------------------------------

function renderSemesterPlan() {
    const container = document.getElementById("semester-plan");

    if (plannedCourses.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                Your semester plan is empty. Add eligible courses
                from the Course Eligibility section.
            </p>
        `;
        return;
    }

    const semester = document.getElementById("semester-name").value;
    const year = document.getElementById("semester-year").value;

    const totalCredits = plannedCourses.reduce(
        (total, course) => total + course.credits,
        0
    );

    container.innerHTML = `
        <div class="plan-heading">
            <div>
                <h3>${escapeHTML(semester)} ${escapeHTML(year)}</h3>
                <p>${plannedCourses.length} planned courses</p>
            </div>

            <strong>${totalCredits} credits</strong>
        </div>

        <div class="planned-list">
            ${plannedCourses.map(course => `
                <div class="planned-course">
                    <div>
                        <strong>${escapeHTML(course.id)}</strong>
                        <span>${escapeHTML(course.name)}</span>
                        <small>${course.credits} credits</small>
                    </div>

                    <button
                        type="button"
                        class="remove-course-button"
                        data-remove-course="${escapeHTML(course.id)}"
                        aria-label="Remove ${escapeHTML(course.id)}">
                        Remove
                    </button>
                </div>
            `).join("")}
        </div>

        <button type="button" id="clear-plan" class="secondary-button">
            Clear Semester Plan
        </button>
    `;
}


function addCourseToPlan(courseId) {
    const course = getCourse(courseId);

    if (!course || isCompleted(courseId)) return;

    if (!prerequisitesMet(course)) {
        alert("You must complete the listed prerequisites before adding this course.");
        return;
    }

    if (plannedCourses.some(item => item.id === courseId)) {
        return;
    }


// -----------------------------------------------------
// 9. GRADUATION PROGRESS
// -----------------------------------------------------

function renderGraduationProgress() {
    const generalInput = document.getElementById("general-credits");
    const lowerInput = document.getElementById("lower-credits");

    generalEducationCredits = Math.min(
        36,
        Math.max(0, Number(generalInput.value) || 0)
    );

    lowerLevelCredits = Math.min(
        44,
        Math.max(0, Number(lowerInput.value) || 0)
    );

    const upperLevelCompleted = courses
        .filter(course =>
            course.category === "Program" ||
            course.category === "Program Elective"
        )
        .filter(course => isCompleted(course.id))
        .reduce((total, course) => total + course.credits, 0);

    const upperLevelCredits = Math.min(48, upperLevelCompleted);

    const totalCompleted =
        generalEducationCredits +
        lowerLevelCredits +
        upperLevelCredits;

    const percentage = Math.min(
        100,
        Math.round((totalCompleted / 128) * 100)
    );

    const container = document.getElementById("graduation-progress");

    container.innerHTML = `
        <div class="progress-summary">
            <div>
                <strong>${totalCompleted} / 128</strong>
                <span>Estimated completed credits</span>
            </div>

            <strong>${percentage}%</strong>
        </div>

        <div
            class="progress-track"
            role="progressbar"
            aria-label="Estimated degree progress"
            aria-valuenow="${percentage}"
            aria-valuemin="0"
            aria-valuemax="100">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>

        <div class="progress-breakdown">
            <div>
                <span>General Education</span>
                <strong>${generalEducationCredits} / 36</strong>
            </div>

            <div>
                <span>Lower-Level Technical</span>
                <strong>${lowerLevelCredits} / 44</strong>
            </div>

            <div>
                <span>Upper-Level Program</span>
                <strong>${upperLevelCredits} / 48</strong>
            </div>
        </div>

        <p class="helper-text">
            This is an estimate based on the values entered and the
            courses checked. It does not replace your official degree audit.
        </p>
    `;
}


// -----------------------------------------------------
// 10. PROGRAM COURSE INFORMATION
// -----------------------------------------------------

function renderProgramInformation() {
    const container = document.getElementById("program-course-information");

    const programCourses = courses.filter(course =>
        course.category === "Program" ||
        course.category === "Program Elective"
    );

    container.innerHTML = programCourses.map(course =>
        getCourseCard(course, false)
    ).join("");
}


// -----------------------------------------------------
// 11. EVENT LISTENERS
// -----------------------------------------------------

function attachEvents() {
    const app = document.getElementById("advisor-app");

    // Completed course selection
    app.addEventListener("change", event => {
        if (event.target.classList.contains("completed-course-checkbox")) {
            const courseId = event.target.value;

            if (event.target.checked) {
                completedCourses.add(courseId);

                // Remove completed courses from the semester plan.
                const index = plannedCourses.findIndex(
                    course => course.id === courseId
                );

                if (index !== -1) {
                    plannedCourses.splice(index, 1);
                }
            } else {
                completedCourses.delete(courseId);
            }

            renderCompletedCourses(
                document.getElementById("course-search").value
            );

            renderEligibleCourses();
            renderSemesterPlan();
            renderGraduationProgress();
        }

        // Eligibility filter
        if (event.target.id === "eligibility-filter") {
            renderEligibleCourses();
        }

        // Graduation credit inputs
        if (
            event.target.id === "general-credits" ||
            event.target.id === "lower-credits"
        ) {
            renderGraduationProgress();
        }
    });


    // Search courses
    document.getElementById("course-search").addEventListener("input", event => {
        renderCompletedCourses(event.target.value);
    });


    // Add a course using event delegation
    app.addEventListener("click", event => {
        const addButton = event.target.closest(".add-course-button");

        if (addButton) {
            addCourseToPlan(addButton.dataset.course);
        }

        const removeButton = event.target.closest(".remove-course-button");

        if (removeButton) {
            const courseId = removeButton.dataset.removeCourse;

            const index = plannedCourses.findIndex(
                course => course.id === courseId
            );

            if (index !== -1) {
                plannedCourses.splice(index, 1);
            }

            renderSemesterPlan();
            renderEligibleCourses();
        }

        if (event.target.id === "clear-plan") {
            plannedCourses.length = 0;
            renderSemesterPlan();
            renderEligibleCourses();
        }
    });


    // Update the plan heading when the semester changes
    document.getElementById("semester-name").addEventListener("change", renderSemesterPlan);
    document.getElementById("semester-year").addEventListener("change", renderSemesterPlan);
}


// -----------------------------------------------------
// 12. START THE APPLICATION
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", renderAdvisor);
