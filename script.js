// Assignment 3 - Form Validation

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const birthdate = document.getElementById("birthdate");

    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const zip = document.getElementById("zip");

    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const security = document.getElementById("security");


    const firstNameError = document.getElementById("firstNameError");
    const lastNameError = document.getElementById("lastNameError");
    const birthdateError = document.getElementById("birthdateError");

    const addressError = document.getElementById("addressError");
    const cityError = document.getElementById("cityError");
    const zipError = document.getElementById("zipError");

    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const securityError = document.getElementById("securityError");


    // --------------------------------------------------
    // Phone number input mask
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Prevent future birth dates
    // --------------------------------------------------

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    birthdate.max = `${year}-${month}-${day}`;


    // --------------------------------------------------
    // Form submission and validation
    // --------------------------------------------------

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        let valid = true;


        // Clear previous error messages

        firstNameError.textContent = "";
        lastNameError.textContent = "";
        birthdateError.textContent = "";

        addressError.textContent = "";
        cityError.textContent = "";
        zipError.textContent = "";

        phoneError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        securityError.textContent = "";


        // --------------------------------------------------
        // First name
        // --------------------------------------------------

        const firstNameValue = firstName.value.trim();

        if (firstNameValue === "") {

            firstNameError.textContent =
                "Please enter your first name.";

            valid = false;
        }


        // --------------------------------------------------
        // Last name
        // --------------------------------------------------

        const lastNameValue = lastName.value.trim();

        if (lastNameValue === "") {

            lastNameError.textContent =
                "Please enter your last name.";

            valid = false;
        }


        // --------------------------------------------------
        // Birth date
        // --------------------------------------------------

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
                    "Birth date cannot be in the future.";

                valid = false;
            }
        }


        // --------------------------------------------------
        // Street address
        // --------------------------------------------------

        const addressValue = address.value.trim();

        if (addressValue === "") {

            addressError.textContent =
                "Please enter your street address.";

            valid = false;

        } else if (!/\d/.test(addressValue)) {

            addressError.textContent =
                "Please include a street number.";

            valid = false;
        }


        // --------------------------------------------------
        // City
        // --------------------------------------------------

        const cityValue = city.value.trim();

        if (cityValue === "") {

            cityError.textContent =
                "Please enter your city.";

            valid = false;

        } else if (!/^[A-Za-zÀ-ÿ' -]+$/.test(cityValue)) {

            cityError.textContent =
                "Please enter a valid city.";

            valid = false;
        }


        // --------------------------------------------------
        // State
        // --------------------------------------------------

        if (state.value === "") {

            valid = false;

            state.focus();
        }


        // --------------------------------------------------
        // ZIP code
        // --------------------------------------------------

        const zipValue = zip.value.trim();

        const zipPattern = /^[0-9]{5}(-[0-9]{4})?$/;

        if (zipValue === "") {

            zipError.textContent =
                "Please enter your ZIP code.";

            valid = false;

        } else if (!zipPattern.test(zipValue)) {

            zipError.textContent =
                "Please enter a valid ZIP code.";

            valid = false;
        }


        // --------------------------------------------------
        // Phone number
        // --------------------------------------------------

        const phoneNumbers =
            phone.value.replace(/\D/g, "");

        if (phoneNumbers.length !== 10) {

            phoneError.textContent =
                "Please enter a complete 10-digit phone number.";

            valid = false;
        }


        // --------------------------------------------------
        // Email
        // --------------------------------------------------

        const emailValue = email.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === "") {

            emailError.textContent =
                "Please enter your email address.";

            valid = false;

        } else if (!emailPattern.test(emailValue)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;
        }


        // --------------------------------------------------
        // Message
        // --------------------------------------------------

        const messageValue = message.value.trim();

        if (messageValue === "") {

            messageError.textContent =
                "Please enter a message.";

            valid = false;

        } else if (messageValue.length < 10) {

            messageError.textContent =
                "Your message must contain at least 10 characters.";

            valid = false;
        }


        // --------------------------------------------------
        // Security question
        // --------------------------------------------------

        const securityValue =
            security.value.trim();

        if (securityValue !== "8") {

            securityError.textContent =
                "Incorrect answer. Please enter 8.";

            valid = false;
        }


        // --------------------------------------------------
        // HTML5 validation
        // --------------------------------------------------

        if (!form.checkValidity()) {

            valid = false;
        }


        // --------------------------------------------------
        // Stop submission if anything is invalid
        // --------------------------------------------------

        if (!valid) {

            form.reportValidity();
            return;
        }


        // --------------------------------------------------
        // Save information for confirmation page
        // --------------------------------------------------

        const formData = {

            firstName: firstNameValue,

            lastName: lastNameValue,

            birthdate: birthdate.value,

            address: addressValue,

            city: cityValue,

            state: state.options[state.selectedIndex].text,

            zip: zipValue,

            phone: phone.value,

            email: emailValue,

            message: messageValue
        };


        sessionStorage.setItem(
            "assignment3FormData",
            JSON.stringify(formData)
        );


        // --------------------------------------------------
        // Go to confirmation page
        // --------------------------------------------------

        window.location.href = "confirmation.html";

    });

});
