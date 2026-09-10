// Assignment 3 - Form Validation

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const phone = document.getElementById("phone");
    const birthdate = document.getElementById("birthdate");
    const security = document.getElementById("security");

    const phoneError = document.getElementById("phoneError");
    const birthdateError = document.getElementById("birthdateError");
    const securityError = document.getElementById("securityError");


    // Phone number formatting
    phone.addEventListener("input", function () {

        let numbers = phone.value.replace(/\D/g, "");

        if (numbers.length > 10) {
            numbers = numbers.substring(0, 10);
        }

        if (numbers.length >= 7) {

            phone.value =
                "(" +
                numbers.substring(0, 3) +
                ")" +
                numbers.substring(3, 6) +
                "-" +
                numbers.substring(6);

        } else if (numbers.length >= 4) {

            phone.value =
                "(" +
                numbers.substring(0, 3) +
                ")" +
                numbers.substring(3);

        } else if (numbers.length > 0) {

            phone.value = "(" + numbers;

        } else {

            phone.value = "";
        }

    });


    // Prevent future birth dates
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    birthdate.max = `${year}-${month}-${day}`;


    // Form validation
    form.addEventListener("submit", function (event) {

        let valid = true;

        phoneError.textContent = "";
        birthdateError.textContent = "";
        securityError.textContent = "";


        // Check first and last name
        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        if (firstName === "" || lastName === "") {

            valid = false;
        }


        // Phone validation
        const phoneNumbers =
            phone.value.replace(/\D/g, "");

        if (phoneNumbers.length !== 10) {

            phoneError.textContent =
                "Please enter a complete 10-digit phone number.";

            valid = false;
        }


        // Birth date validation
// Birth date validation
if (birthdate.value === "") {

    birthdateError.textContent =
        "Please enter your birth date.";

    valid = false;

} else {

    const selectedDate =
        new Date(birthdate.value + "T00:00:00");

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate > currentDate) {

        birthdateError.textContent =
            "Warning: Birth date cannot be in the future.";

        birthdateError.style.color = "#e21b2d";
        birthdateError.style.fontWeight = "bold";

        valid = false;
    }
}



        // Security question
        if (security.value.trim() !== "8") {

           securityError.textContent =
    "Incorrect answer. Please try again.";


            valid = false;
        }


        // HTML5 validation
        if (!form.checkValidity()) {

            form.reportValidity();

            valid = false;
        }


        // Stop if information is invalid
        if (!valid) {

            event.preventDefault();
            return;
        }


        // Save information for confirmation page
        const formData = {

            firstName: firstName,

            lastName: lastName,

            birthdate:
                birthdate.value,

            address:
                document.getElementById("address").value.trim(),

            city:
                document.getElementById("city").value.trim(),

            state:
                document.getElementById("state").value,

            zip:
                document.getElementById("zip").value.trim(),

            phone:
                phone.value,

            email:
                document.getElementById("email").value.trim(),

            message:
                document.getElementById("message").value.trim()
        };


        sessionStorage.setItem(
            "assignment3FormData",
            JSON.stringify(formData)
        );

    });

});
