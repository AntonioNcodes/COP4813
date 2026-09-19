document
    .getElementById("compoundForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        // Get the values entered by the user
        const principal =
            parseFloat(document.getElementById("principal").value);

        const rate =
            parseFloat(document.getElementById("rate").value) / 100;

        const compounds =
            parseInt(document.getElementById("compoundings").value);

        const years =
            parseInt(document.getElementById("years").value);


        // Check that the values are valid
        if (
            isNaN(principal) ||
            isNaN(rate) ||
            isNaN(compounds) ||
            isNaN(years) ||
            principal < 0 ||
            rate < 0 ||
            compounds <= 0 ||
            years <= 0
        ) {

            document.getElementById("result").innerHTML =
                "Please enter valid numbers in all fields.";

            return;
        }


        // Create an array to hold the graph data
        const data = [];


        // Calculate the balance for each year
        for (let t = 0; t <= years; t++) {

            const amount =
                principal *
                Math.pow(
                    1 + rate / compounds,
                    compounds * t
                );

            data.push([
                t,
                Number(amount.toFixed(2))
            ]);
        }


        // Calculate the final amount
        const finalAmount =
            principal *
            Math.pow(
                1 + rate / compounds,
                compounds * years
            );


        // Calculate the interest earned
        const interestEarned =
            finalAmount - principal;


        // Display the results
        document.getElementById("result").innerHTML =
            "Final Amount: $" +
            finalAmount.toFixed(2) +
            "<br>Total Interest Earned: $" +
            interestEarned.toFixed(2);


        // Create the graph
        Highcharts.chart("chart", {

            title: {
                text: "Compound Interest Growth"
            },

            xAxis: {
                title: {
                    text: "Time (Years)"
                }
            },

            yAxis: {
                title: {
                    text: "Account Balance ($)"
                }
            },

            tooltip: {
                pointFormat:
                    "Balance: <b>${point.y:,.2f}</b>"
            },

            series: [
                {
                    name: "Account Balance",
                    data: data
                }
            ]

        });

    });
