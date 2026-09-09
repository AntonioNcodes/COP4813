// Assignment 3 - Form Validation

const form = document.getElementById("contactForm");
const phone = document.getElementById("phone");
const birthdate = document.getElementById("birthdate");

// Prevent future birth dates
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

// Validate the form
form.addEventListener("submit", function (event) {

// Stop the normal mailto submission
event.preventDefault();


// Get form information
const firstName =
    document.getElementById("firstName").value.trim();

const lastName =
    document.getElementById("lastName").value.trim();

const address =
    document.getElementById("address").value.trim();

const city =
    document.getElementById("city").value.trim();

const state =
    document.getElementById("state").value;

const zip =
    document.getElementById("zip").value.trim();

const email =
    document.getElementById("email").value.trim();

const message =
    document.getElementById("message").value.trim();

const security =
    document.getElementById("security").value.trim();

const birthDateValue =
    birthdate.value;


// Check required fields
if (!form.checkValidity()) {

    form.reportValidity();

    return;
}


// Check first and last name
if (firstName === "" || lastName === "") {

    alert("Please enter both your first and last name.");

    return;
}


// Check phone number
const phoneNumbers =
    phone.value.replace(/\D/g, "");

if (phoneNumbers.length !== 10) {

    alert("Please enter a complete 10-digit phone number.");

    return;
}


// Check ZIP code
const zipPattern =
    /^[0-9]{5}(-[0-9]{4})?$/;

if (!zipPattern.test(zip)) {

    alert("Please enter a valid ZIP code.");

    return;
}


// Check email
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {

    alert("Please enter a valid email address.");

    return;
}


// Check birth date
const selectedDate =
    new Date(birthDateValue + "T00:00:00");

const currentDate =
    new Date();

currentDate.setHours(0, 0, 0, 0);

if (selectedDate > currentDate) {

    alert("Birth date cannot be in the future.");

    return;
}


// Check security question
if (security !== "12") {

    alert("Incorrect security answer. Please try again.");

    return;
}


// Save information for the confirmation page
const formData = {

    firstName: firstName,

    lastName: lastName,

    address: address,

    city: city,

    state: state,

    zip: zip,

    phone: phone.value,

    email: email,

    birthdate: birthDateValue,

    message: message

};


sessionStorage.setItem(
    "formData",
    JSON.stringify(formData)
);


// Go to confirmation page
window.location.href = "confirmation.html";


});
