var cordinates = ["country", "pestle", "region", "sector", "topic"],
    measuresArray = ["intensity", "likelihood", "relevance"],
    xCord = cordinates[0],
    xCordData = [],
    yCord = cordinates[3],
    yCordData = [],
    yearRange = [],
    measures = measuresArray[0],
    maxMeasuredValue = 0,
    colorRange = {
        'intensity': [{
                from: -1,
                to: 0,
                name: '0',
                color: 'rgb(255, 226, 154);'
            },
            {
                from: 1,
                to: 6,
                name: '1-6',
                color: 'rgb(140, 249, 122)'
            },
            {
                from: 7,
                to: 14,
                name: '7-14',
                color: 'rgb(131, 245, 214)'
            },
            {
                from: 15,
                to: 21,
                name: '15-21',
                color: 'rgb(63, 172, 247)'
            },
            {
                from: 22,
                to: 50,
                name: '22-50',
                color: 'rgb(184, 149, 255)'
            },
            {
                from: 51,
                to: 72,
                name: '51-72',
                color: 'rgb(251, 52, 94)'
            }
        ],
        'relevance': [{
                from: 0,
                to: 0,
                name: '0',
                color: 'rgb(255, 226, 154)'
            },
            {
                from: 1,
                to: 2,
                name: '1-2',
                color: 'rgb(140, 249, 122)'
            },
            {
                from: 3,
                to: 4,
                name: '3-4',
                color: 'rgb(131, 245, 214)'
            },
            {
                from: 5,
                to: 6,
                name: '5-6',
                color: 'rgb(63, 172, 247)'
            },
            {
                from: 7,
                to: 7,
                name: '7',
                color: 'rgb(251, 52, 94)'
            }
        ],
        'likelihood': [{
                from: 0,
                to: 0,
                name: '0',
                color: 'rgb(255, 226, 154);'
            },
            {
                from: 1,
                to: 1,
                name: '1',
                color: 'rgb(140, 249, 122)'
            },
            {
                from: 2,
                to: 2,
                name: '2',
                color: 'rgb(63, 172, 247)'
            },
            {
                from: 3,
                to: 3,
                name: '3',
                color: 'rgb(184, 149, 255)'
            },
            {
                from: 4,
                to: 4,
                name: '4',
                color: 'rgb(251, 52, 94)'
            }
        ]
    };


$.getJSON("jsondata.json", (data) => {

    var createBase = () => {
        xCordData = [];
        yCordData = [];
        data.forEach(element => {
            if (element[xCord] !== "" && element[yCord] !== "")
                xCordData.push(element[xCord])
            if (element[yCord] !== "" && element[xCord] !== "")
                yCordData.push(element[yCord])
        });

        // function to remove similar data
        let uniqueArray = (element) => element.filter((el, index) => index == $.inArray(el, element)).sort();

        xCordData = uniqueArray(xCordData);
        yCordData = uniqueArray(yCordData);
    }

    var generateYData = (x, yRowName) => {
        var measuredValue = 0;
        data.forEach(e => {
            if (e[xCord] === x && e[yCord] === yRowName) {
                if (measuredValue < e[measures]) {
                    measuredValue = e[measures];
                }
                /* if (!yearRange.length) {
                    if (measuredValue < e[measures]) {
                        measuredValue = e[measures];
                    }
                } else if (e.end_year >= yearRange[0] && e.end_year <= yearRange[1]) {
                    if (measuredValue < e[measures]) {
                        measuredValue = e[measures];
                    }
                } */
            }
        });
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
        [{
            name: yCordData[0],
            data: generateData(yCordData[0])
        }];

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
        // color
        plotOptions: {
            heatmap: {
                radius: 3,
                enableShades: false,
                colorScale: {
                    ranges: colorRange[measures]
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        series: createSeries(),
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
        setPrameters();
        chart.updateOptions({
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: colorRange[measures]
                    }
                }
            }
        });
        chart.updateOptions({
            series: createSeries()
        })
    });
})