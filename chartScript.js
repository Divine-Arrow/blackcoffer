var cordinates = ["country", "pestle", "region", "sector", "topic"],
    measuresArray = ["intensity", "likelihood", "relevance"],
    xCord = cordinates[0],
    xCordData = [],
    yCord = cordinates[3],
    yCordData = [],
    years = [],
    yearRange = {
        allYear: true,
        counter: 0
    },
    measures = measuresArray[0],
    maxMeasuredValue = 0,
    allColors = ["rgb(255, 226, 154)", "rgb(140, 249, 122)", "rgb(131, 245, 214)", "rgb(63, 172, 247)", "rgb(184, 149, 255)", "rgb(251, 52, 94)"];

$.getJSON("jsondata.json", (data) => {

    var createBase = () => {
        xCordData = [];
        yCordData = [];
        data.forEach(element => {
            // Corinates
            if (element[xCord] !== "" && element[yCord] !== "") {
                if (yearRange.allYear) {
                    xCordData.push(element[xCord]);
                    yCordData.push(element[yCord]);
                } else if ((Math.floor(element.start_year) >= yearRange.start_year) && (Math.floor(element.end_year) <= yearRange.end_year)) {
                    // remove unwanted empty cells when year range used
                    xCordData.push(element[xCord]);
                    yCordData.push(element[yCord]);
                }
            }
            // years data
            if (element["start_year"] !== "" && element["end_year"] !== "") {
                years.push(element["start_year"]);
                years.push(element["end_year"]);
            }
        });

        // function to remove similar data
        let uniqueArray = (element) => element.filter((el, index) => index == $.inArray(el, element)).sort();

        xCordData = uniqueArray(xCordData);
        yCordData = uniqueArray(yCordData);
        // for years
        if (!yearRange.counter) {
            years = uniqueArray(years);
            yearRange.start_year = Math.min.apply(Math, years);
            yearRange.end_year = Math.max.apply(Math, years);
            createYearOptions();
            yearRange.counter++;
        }
    }

    var generateColor = (maxValue) => {
        var temp = [{
                from: 0,
                to: 0,
                /* name: "", // leaving name will automatically take ranges*/
                color: allColors[0]
            }],
            counter = 0,
            endValue = Math.floor(maxValue / 5);
        while (counter < 5) {
            temp.push({
                from: temp[temp.length - 1].to + 1,
                to: temp[temp.length - 1].to + 1 + endValue,
                /* name: "", // leaving name will automatically take ranges*/
                color: allColors[counter + 1]
            });
            if (temp[temp.length - 1].to >= maxValue) {
                break;
            }
            counter++
        }
        return temp;
    }

    var generateYData = (x, yRowName) => {
        var measuredValue = 0;
        // console.log("year: ", yearRange);
        data.forEach(e => {
            if (e[xCord] === x && e[yCord] === yRowName && measuredValue < e[measures]) {
                if (yearRange.allYear) {
                    measuredValue += e[measures];
                } else {
                    if ((Math.floor(e.start_year) >= yearRange.start_year) && (Math.floor(e.end_year) <= yearRange.end_year)) {
                        measuredValue += e[measures];
                    }
                }
            }
        });
        // adding max value to globally
        if (maxMeasuredValue < measuredValue)
            maxMeasuredValue = measuredValue
        return measuredValue;
    }

    var generateData = (yRowName) => {
        var i = 0;
        var series = [];
        while (i < xCordData.length) {
            var x = xCordData[i];
            var y = generateYData(x, yRowName);
            series.push({
                x: x,
                y: y
            });
            i++;
        }
        return series;
    }

    // createSeries
    var createSeries = () => {
        createBase();
        var tempArr = [];
        for (var i = 0; i < yCordData.length; i++) {
            var innerObj = {};
            innerObj.name = yCordData[i];
            innerObj.data = generateData(yCordData[i]);
            tempArr.push(innerObj);
        }
        return tempArr;
    }

    // 1 - chart Options
    var options = {
        chart: {
            type: "heatmap",
            height: "540",
            width: "100%",
            background: "#f7f7f7",
            foreColor: "#333"
        },
        dataLabels: {
            enabled: false
        },
        series: createSeries(),
        // color
        plotOptions: {
            heatmap: {
                radius: 3,
                enableShades: false,
                colorScale: {
                    ranges: generateColor(maxMeasuredValue)
                }
            }
        },
        title: {
            text: 'Heatmap Chart',
            align: 'center',
            margin: 20,
            offsetY: 20,
            style: {
                fontSize: '25px',
                fontFamily: "'Lato', sans-serif"
            }
        }
    };

    // 2 Init Chart
    var chart = new ApexCharts(
        $("#chart")[0],
        options
    );

    // 3 Render Chart
    chart.render();


    // switch
    $("#apply").click(() => {
        maxMeasuredValue = 0;
        setPrameters();
        chart.updateOptions({
            series: createSeries()
        });

        chart.updateOptions({
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: generateColor(maxMeasuredValue)
                    }
                }
            }
        });
    });
});