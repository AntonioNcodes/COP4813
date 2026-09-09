// Assignment 3 - Confirmation Page

const confirmationInfo =
document.getElementById("confirmationInfo");

const formData =
JSON.parse(sessionStorage.getItem("formData"));

// If there is no saved form information,
// send the user back to the form.
if (!formData) {

confirmationInfo.innerHTML =
    "<p>No form information was found. Please return to the form.</p>";


} else {

confirmationInfo.innerHTML = `
    <div class="confirmation-item">
        <strong>Name:</strong>
        ${formData.firstName} ${formData.lastName}
    </div>

    <div class="confirmation-item">
        <strong>Address:</strong>
        ${formData.address}
    </div>

    <div class="confirmation-item">
        <strong>City:</strong>
        ${formData.city}
    </div>

    <div class="confirmation-item">
        <strong>State:</strong>
        ${formData.state}
    </div>

    <div class="confirmation-item">
        <strong>ZIP Code:</strong>
        ${formData.zip}
    </div>

    <div class="confirmation-item">
        <strong>Phone:</strong>
        ${formData.phone}
    </div>

    <div class="confirmation-item">
        <strong>Email:</strong>
        ${formData.email}
    </div>

    <div class="confirmation-item">
        <strong>Birth Date:</strong>
        ${formData.birthdate}
    </div>

    <div class="confirmation-item">
        <strong>Message:</strong>
        ${formData.message}
    </div>
`;


}

// Return to the form so the user can make changes.
document.getElementById("editButton").addEventListener("click", function () {

window.location.href = "assignment3.html";


});

// Confirm and submit the information.
document.getElementById("confirmButton").addEventListener("click", function () {

const emailBody =
    "Assignment 3 Form Submission\n\n" +
    "Name: " + formData.firstName + " " + formData.lastName + "\n" +
    "Address: " + formData.address + "\n" +
    "City: " + formData.city + "\n" +
    "State: " + formData.state + "\n" +
    "ZIP Code: " + formData.zip + "\n" +
    "Phone: " + formData.phone + "\n" +
    "Email: " + formData.email + "\n" +
    "Birth Date: " + formData.birthdate + "\n" +
    "Message: " + formData.message;


const mailtoLink =
    "mailto:navantonio13@gmail.com" +
    "?subject=Assignment%203%20Form%20Submission" +
    "&body=" +
    encodeURIComponent(emailBody);


window.location.href = mailtoLink;


});
