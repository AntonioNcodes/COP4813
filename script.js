// Assignment 3 - Form Validation

document.addEventListener("DOMContentLoaded", function () {

const form =
    document.getElementById("contactForm");


const phone =
    document.getElementById("phone");


const birthdate =
    document.getElementById("birthdate");



// ==========================================
// Set today's date as the latest birth date
// ==========================================


const today =
    new Date();


const year =
    today.getFullYear();


const month =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


const day =
    String(
        today.getDate()
    ).padStart(2, "0");


birthdate.max =
    `${year}-${month}-${day}`;



// ==========================================
// Phone Number Input Mask
// Format: (000)000-0000
// ==========================================


phone.addEventListener(
    "input",
    function () {


        let numbers =
            phone.value.replace(
                /\D/g,
                ""
            );


        numbers =
            numbers.substring(
                0,
                10
            );


        if (numbers.length > 6) {


            phone.value =
                "(" +
                numbers.substring(0, 3) +
                ")" +
                numbers.substring(3, 6) +
                "-" +
                numbers.substring(6, 10);


        } else if (numbers.length > 3) {


            phone.value =
                "(" +
                numbers.substring(0, 3) +
                ")" +
                numbers.substring(3);


        } else if (numbers.length > 0) {


            phone.value =
                "(" +
                numbers;


        } else {


            phone.value =
                "";

        }

    }
);



// ==========================================
// Form Validation
// ==========================================


form.addEventListener(
    "submit",
    function (event) {


        event.preventDefault();


        clearErrors();


        let valid =
            true;



        // ==========================================
        // First Name
        // ==========================================


        const firstName =
            document
                .getElementById("firstName")
                .value
                .trim();


        if (firstName === "") {


            showError(
                "firstNameError",
                "Please enter your first name."
            );


            valid =
                false;


        } else if (
            !/^[A-Za-zÀ-ÿ' -]+$/.test(
                firstName
            )
        ) {


            showError(
                "firstNameError",
                "Please enter a valid first name."
            );


            valid =
                false;

        }



        // ==========================================
        // Last Name
        // ==========================================


        const lastName =
            document
                .getElementById("lastName")
                .value
                .trim();


        if (lastName === "") {


            showError(
                "lastNameError",
                "Please enter your last name."
            );


            valid =
                false;


        } else if (
            !/^[A-Za-zÀ-ÿ' -]+$/.test(
                lastName
            )
        ) {


            showError(
                "lastNameError",
                "Please enter a valid last name."
            );


            valid =
                false;

        }



        // ==========================================
        // Birth Date
        // ==========================================


        const birthValue =
            birthdate.value;


        if (birthValue === "") {


            showError(
                "birthdateError",
                "Please enter your birth date."
            );


            valid =
                false;


        } else {


            const birth =
                new Date(
                    birthValue + "T00:00:00"
                );


            const currentDate =
                new Date();


            currentDate.setHours(
                0,
                0,
                0,
                0
            );


            if (
                isNaN(
                    birth.getTime()
                )
            ) {


                showError(
                    "birthdateError",
                    "Please enter a valid date."
                );


                valid =
                    false;


            } else if (
                birth > currentDate
            ) {


                showError(
                    "birthdateError",
                    "Birth date cannot be in the future."
                );


                valid =
                    false;

            }

        }



        // ==========================================
        // Street Address
        // ==========================================


        const address =
            document
                .getElementById("address")
                .value
                .trim();


        const addressPattern =
            /^\d+[A-Za-z]?\s+[A-Za-z0-9][A-Za-z0-9 .,'#-]*$/;


        if (address === "") {


            showError(
                "addressError",
                "Please enter your street address."
            );


            valid =
                false;


        } else if (
            !addressPattern.test(
                address
            )
        ) {


            showError(
                "addressError",
                "Please enter a valid street address, such as 123 Main Street."
            );


            valid =
                false;

        }



        // ==========================================
        // City
        // ==========================================


        const city =
            document
                .getElementById("city")
                .value
                .trim();


        if (city === "") {


            showError(
                "cityError",
                "Please enter your city."
            );


            valid =
                false;


        } else if (
            !/^[A-Za-zÀ-ÿ .'-]+$/.test(
                city
            )
        ) {


            showError(
                "cityError",
                "Please enter a valid city."
            );


            valid =
                false;

        }



        // ==========================================
        // State
        // ==========================================


        const state =
            document
                .getElementById("state")
                .value;


        if (state === "") {


            showError(
                "stateError",
                "Please select a state."
            );


            valid =
                false;

        }



        // ==========================================
        // ZIP Code
        // ==========================================


        const zip =
            document
                .getElementById("zip")
                .value
                .trim();


        const zipPattern =
            /^\d{5}(-\d{4})?$/;


        if (zip === "") {


            showError(
                "zipError",
                "Please enter your ZIP code."
            );


            valid =
                false;


        } else if (
            !zipPattern.test(
                zip
            )
        ) {


            showError(
                "zipError",
                "Please enter a valid 5-digit ZIP code or ZIP+4."
            );


            valid =
                false;

        }



        // ==========================================
        // Phone Number
        // ==========================================


        const phoneValue =
            phone.value.trim();


        const phonePattern =
            /^\(\d{3}\)\d{3}-\d{4}$/;


        if (phoneValue === "") {


            showError(
                "phoneError",
                "Please enter your phone number."
            );


            valid =
                false;


        } else if (
            !phonePattern.test(
                phoneValue
            )
        ) {


            showError(
                "phoneError",
                "Please enter your phone as (000)000-0000."
            );


            valid =
                false;

        }



        // ==========================================
        // Email
        // ==========================================


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const emailPattern =
            /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;


        if (email === "") {


            showError(
                "emailError",
                "Please enter your email address."
            );


            valid =
                false;


        } else if (
            !emailPattern.test(
                email
            )
        ) {


            showError(
                "emailError",
                "Please enter a valid email address."
            );


            valid =
                false;

        }



        // ==========================================
        // Message
        // ==========================================


        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (message === "") {


            showError(
                "messageError",
                "Please enter a message."
            );


            valid =
                false;


        } else if (
            message.length < 10
        ) {


            showError(
                "messageError",
                "Your message must contain at least 10 characters."
            );


            valid =
                false;

        }



        // ==========================================
        // Security Question
        // ==========================================


        const security =
            document
                .getElementById("security")
                .value
                .trim();


        if (security === "") {


            showError(
                "securityError",
                "Please answer the security question."
            );


            valid =
                false;


        } else if (
            security !== "8"
        ) {


            showError(
                "securityError",
                "Incorrect answer. What is 5 + 3?"
            );


            valid =
                false;

        }



        // ==========================================
        // Continue to Confirmation
        // ==========================================


        if (valid) {


            form.submit();


        } else {


            const firstError =
                document.querySelector(
                    "small.error"
                );


            if (firstError) {


                firstError.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "center"
                    }
                );

            }

        }

    }
);



// ==========================================
// Display Error
// ==========================================


function showError(
    id,
    message
) {


    const errorElement =
        document.getElementById(
            id
        );


    errorElement.textContent =
        message;


    errorElement.classList.add(
        "error"
    );

}



// ==========================================
// Clear Errors
// ==========================================


function clearErrors() {


    const errors =
        document.querySelectorAll(
            "small"
        );


    errors.forEach(
        function (error) {


            error.textContent =
                "";


            error.classList.remove(
                "error"
            );

        }
    );

}


});
