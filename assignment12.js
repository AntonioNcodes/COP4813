
document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("cms-table-body");

    if (!tableBody) {
        console.error("CMS table body was not found.");
        return;
    }

    fetch("cms-data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    `Unable to load cms-data.json. Status: ${response.status}`
                );
            }

            return response.json();
        })
        .then(data => {

            if (!data.cms || !Array.isArray(data.cms)) {
                throw new Error("The JSON file must contain a CMS array.");
            }

            tableBody.innerHTML = "";

            data.cms.forEach(cms => {

                const row = document.createElement("tr");

                function addCell(value, isName = false) {
                    const cell = document.createElement("td");

                    if (isName) {
                        const strong = document.createElement("strong");
                        strong.textContent = value;
                        cell.appendChild(strong);
                    } else {
                        cell.textContent = value;
                    }

                    row.appendChild(cell);
                }

                function addLinks(title, items) {
                    const cell = row.querySelector(".links-cell");

                    const heading = document.createElement("strong");
                    heading.textContent = title;
                    cell.appendChild(heading);
                    cell.appendChild(document.createElement("br"));

                    (items || []).forEach((item, index) => {
                        const link = document.createElement("a");

                        link.href = item.url;
                        link.textContent = item.name;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";

                        cell.appendChild(link);

                        if (index < items.length - 1) {
                            cell.appendChild(document.createElement("br"));
                        }
                    });
                }

                addCell(cms.system, true);
                addCell(cms.support);
                addCell(cms.technology);
                addCell(cms.capabilities);
                addCell(cms.limitations);

                const linksCell = document.createElement("td");
                linksCell.className = "links-cell";
                row.appendChild(linksCell);

                addLinks("Examples:", cms.examples);

                linksCell.appendChild(document.createElement("br"));
                linksCell.appendChild(document.createElement("br"));

                addLinks("Research Sources:", cms.sources);

                tableBody.appendChild(row);

            });

        })
        .catch(error => {
            console.error("Error loading CMS information:", error);

            tableBody.innerHTML = "";

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 6;
            cell.textContent =
                "Unable to load CMS information. Check the browser console for details.";

            row.appendChild(cell);
            tableBody.appendChild(row);
        });

});
