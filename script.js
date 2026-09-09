// Assignment 3 - Form Validation

const form = document.getElementById("contactForm");
const phone = document.getElementById("phone");
const birthdate = document.getElementById("birthdate");

// Set today's date as the maximum possible birth date.
const today = new Date().toISOString().split("T")[0];
birthdate.max = today;


// Phone number input mask
phone.addEventListener("input", function () {

    let numbers = phone.value.replace(/\D/g, "");

    if (numbers.length > 10) {
        numbers = numbers.substring(0, 10);
    }

    if (numbers.length >= 7) {
        phone.value =
            "(" +
            numbers.substring(0, 3) +
            ") " +
            numbers.substring(3, 6) +
            "-" +
            numbers.substring(6, 10);

    } else if (numbers.length >= 4) {
        phone.value =
            "(" +
            numbers.substring(0, 3) +
            ") " +
            numbers.substring(3);

    } else if (numbers.length > 0) {
        phone.value = "(" + numbers;
    }

});


// Form validation
form.addEventListener("submit", function (event) {

    // Remove spaces from names and check that they are not blank.
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    if (firstName === "" || lastName === "") {
        alert("Please enter both your first and last name.");
        event.preventDefault();
        return;
    }


    // Validate phone number.
    const phoneNumbers = phone.value.replace(/\D/g, "");

    if (phoneNumbers.length !== 10) {
        alert("Please enter a complete 10-digit phone number.");
        event.preventDefault();
        return;
    }


    // Validate ZIP code.
    const zip = document.getElementById("zip").value.trim();
    const zipPattern = /^[0-9]{5}(-[0-9]{4})?$/;

    if (!zipPattern.test(zip)) {
        alert("Please enter a valid ZIP code.");
        event.preventDefault();
        return;
    }


    // Validate email address.
    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        event.preventDefault();
        return;
    }


    // Validate birth date.
    const birthDateValue = birthdate.value;

    if (birthDateValue === "") {
        alert("Please enter your birth date.");
        event.preventDefault();
        return;
    }

    const selectedDate = new Date(birthDateValue);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
        alert("Birth date cannot be in the future.");
        event.preventDefault();
        return;
    }


    // Security question.
    const securityAnswer =
        document.getElementById("security").value.trim();

    if (securityAnswer !== "12") {
        alert("Incorrect security answer. Please try again.");
        event.preventDefault();
        return;
    }


    // Make sure all required HTML fields are valid.
    if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
    }

    // If all validation passes, the form is allowed to submit.
});
