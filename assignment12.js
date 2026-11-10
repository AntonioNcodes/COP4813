
document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("cms-table-body");

    fetch("cms-data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load CMS data.");
            }

            return response.json();
        })
        .then(data => {

            data.cms.forEach(cms => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td><strong>${cms.system}</strong></td>
                    <td>${cms.support}</td>
                    <td>${cms.technology}</td>
                    <td>${cms.capabilities}</td>
                    <td>${cms.limitations}</td>
                    <td>
                        ${cms.examples.map(site =>
                            `<a href="${site.url}" target="_blank" rel="noopener noreferrer">
                                ${site.name}
                            </a>`
                        ).join("<br>")}
                    </td>
                `;

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading CMS information:", error);

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load CMS information. Please try again.
                    </td>
                </tr>
            `;
        });

});
