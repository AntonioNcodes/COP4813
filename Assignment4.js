document.getElementById("compoundForm").addEventListener("submit", function (event) {

    event.preventDefault();

    // Get values from the form
    const principal = parseFloat(document.getElementById("principal").value);
    const rate = parseFloat(document.getElementById("rate").value) / 100;
    const compounds = parseInt(document.getElementById("compoundings").value);
    const years = parseInt(document.getElementById("years").value);

    // Create an array for the chart
    const data = [];

    // Calculate the balance for each year
    for (let t = 0; t <= years; t++) {

        const amount = principal *
            Math.pow(1 + rate / compounds, compounds * t);

        data.push([t, Number(amount.toFixed(2))]);
    }

    // Calculate final amount
    const finalAmount = principal *
        Math.pow(1 + rate / compounds, compounds * years);

    const interestEarned = finalAmount - principal;

    // Display calculation results
    document.getElementById("result").innerHTML =
        "Final Amount: $" + finalAmount.toFixed(2) +
        "<br>Total Interest Earned: $" + interestEarned.toFixed(2);

    // Create the plot
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

        series: [{
            name: "Account Balance",
            data: data
        }]

    });

});
