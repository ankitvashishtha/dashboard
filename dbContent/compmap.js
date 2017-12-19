//var myFunction = 
function OnSuccess_2(reponse) {
    var allData = reponse;
    

    cgData2 = allData[0];
    aData2 = allData[1];
    b = cgData2.values;
    // for chart only
    barData = Object.keys(aData).map(function (e) { return aData[e].values; });
    barData2 = Object.keys(aData2).map(function (e) { return aData2[e].values; });
    barLable = Object.keys(aData).map(function (e) { return aData[e].name; });

    var tempData = JSON.parse(JSON.stringify(aData2));
    var sortData = tempData.sort(SortByRank);
    n = Object.keys(sortData).map(function (e) { return sortData[e].name; });
    ds2 = Object.keys(sortData).map(function (e) { return sortData[e].values; });

    if (cgData2.unit == 'Percent' || cgData2.unit == 'Ratio') {
        mins = 0.01;
        tofix = 2;
        var appElement = document.querySelector('[ng-app=myApp]');
        var $scope = angular.element(appElement).scope();
        $scope = $scope.$$childHead;
        $scope.$apply(function () {
            $scope.stp2 = 0.01;
        });
    }
    else {
        mins = 1;
        tofix = 0;
        var appElement = document.querySelector('[ng-app=myApp]');
        var $scope = angular.element(appElement).scope();
        $scope = $scope.$$childHead;
        $scope.$apply(function () {
            $scope.stp2 = 1;
        });
    }
    if (aData2.length != 0) {
        $('#map2').text('');
        //setMap2(cgData2, aData2);
        
        setLegend2();
        if (cgData2.values == 'NA')
            $('#legendsection2').hide();
        else
            $('#legendsection2').show();
    }
    else {
        $('#map2').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
        $('#chartSection2').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");
    }
    $('.tooltip').css("opacity", 0);
    
}
OnErrorCall_2 = function OnErrorCall_(reponse) {
    alert(reponse);
}
var setMap2 = function (cgData2, aData2) {
    aData2.sort(SortByName);
    var width = 368,
height = 580,
centered;
    d3.select("#mapsvg2").remove();
    var canvas = d3.select("body").select("#map2").append("svg").attr("id", "mapsvg2")
.attr("width", 350).attr("height", 570);
    d3.json("map/cg27.json", function (data) {
        var group = canvas.selectAll("g")
        .data(data.features)
        .enter()
        .append("g")
    .on("click", clicked)

        var projection = d3.geo.mercator().scale(4780)
          .center([82.3224595, 20.97702712140104])
         .translate([width / 2, height / 2]);
      
        var path = d3.geo.path().projection(projection);
        var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);
        var area = group.append("path")
        .attr("d", path)
       .style("fill", function (d, i) { return aData2[i].color; })
        .style("stroke", "white")
.style("stroke-width", 1)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout);
        group.append("text")
             //.attr("fill", function (d, i) { return aData2[i].color; })
        .attr("x", function (d, i) {
            if (aData[i].name == 'BILASPUR')
            { return (path.centroid(d)[0]) / 1.1; }
            else if (aData[i].name == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
            else if (aData[i].name == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
            else if (aData[i].name == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.08; }
            else if (aData[i].name == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
            else {
                return path.centroid(d)[0];
            }
        })
        .attr("y", function (d, i) {
            if (aData[i].name == 'BILASPUR')
            { return (path.centroid(d)[1]) / 1.2; }
            else {
                return path.centroid(d)[1];
            }
        })
        .attr("text-anchor", "middle")
        .text(function (d, i) { return aData2[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
          .attr("font-size", 11.5);
        group.append("text")
            //.attr("fill", function (d, i) { return aData2[i].color; })
       .attr("x", function (d, i) {
           if (aData[i].name == 'BILASPUR')
           { return (path.centroid(d)[0]) / 1.07; }
           else if (aData[i].name == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
           else if (aData[i].name == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
           else {
               return path.centroid(d)[0];
           }
       })
       .attr("y", function (d, i) {
           if (aData[i].name == 'BILASPUR')
           { return (path.centroid(d)[1]) / 1.2; }
           else {
               return path.centroid(d)[1];
           }
       })
       .attr("text-anchor", "middle")
             .html(function (d, i) { return aData2[i].values.toFixed(tofix); })
            .attr("transform", "translate(0,10)")
        .attr("font-size", 10)
            .on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout);

       
        function mouseover(d, i) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .8);
        };
        function mousemove(d, i) {
            tooltip.html("District: " + aData2[i].name + "<br/> Rank: " + aData2[i].rank + "<br/>" + aData2[i].values.toFixed(tofix))
              .style("left", (d3.event.pageX - 35) + "px")
              .style("top", (d3.event.pageY - 110) + "px");
        }
        function mouseout() {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        }
        function clicked(d) {
            //zoom function start
            var x, y, k;
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
            } else {
                $('#yearChart').hide();
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }
            group.selectAll("path")
                .classed("active", centered && function (d) { return d === centered; });
            group.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");
            // zoom function end

        }

    });

}

/* set lower limit for chart */
$('#lowerLimit').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        lowerLimit = parseInt($('#lowerLimit').val());
        loadChart(n, ds2);
    }
});
// flip legend
$('.flip').click(function () {
    $(this).find('.card').addClass('flipped').dblclick(function () {
        $(this).removeClass('flipped');
    });
    return false;
});

//set indicator dropdown
var setIndicators2 = function () {
    if ($('#ddlSector2').val() == 1)
        $('#src2').text('Census');
    if ($('#ddlSector2').val() == 2)
        $('#src2').text('CRVS MIS');

    $.ajax({
        url: 'api/dashboard/getIndicator',
        data: { sectorId: $('#ddlSector2').val() },
        type: 'get',
        contentType: 'application/json'
    }).success(function (data) {
        var indis = data[0];
        var years = data[1];
        $("#ddlIndicator2").empty();
        $("#ddlYear2").empty();
        $.each(indis, function (key, value) {
            $("#ddlIndicator2").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
           
        });
        $.each(years, function (key, value) {
            $("#ddlYear2").append($("<option></option>").val(value.year).html(value.year));
          
        });
        $("select#ddlYear2").val('2001');
       getAllData2();
    }).error(function (error) {
        alert("Error!");
    });
}
var getAllData2 = function () {
    //$('#yearChart').hide();
    //lowerLimit = parseInt($('#lowerLimit2').val());
    var col = $('#ddlIndicator2').val();
    IndicatorName2 = $('#ddlIndicator2 option:selected').text();
    $.ajax({
        type: "GET",
        url: "api/dashboard/getAllData",
        data: { sectorId: $("#ddlSector2").val(), val: col, year: $("#ddlYear2").val() },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccess_2,
        error: OnErrorCall_2
    });
}

//-------------- set legend----------------
var setLegend2 = function () {
    var firstMid = 0, secondMid = 0, dataLength = 0;
    $.each(ds, function (i, value) {
        if (value != -1) {
            dataLength++;
        }
    })
    if (dataLength > 2) {
        firstMid = Math.floor(dataLength / 3);
        secondMid = 2 * firstMid;
        if (dataLength % 3 == 2) {
            firstMid++;
            secondMid++;
        }
    }

    $('#2txthigh2').val((ds[firstMid] + mins).toFixed(tofix)); $('#2txthigh1').val(ds[0].toFixed(tofix));
    $('#2txtmid2').val((ds[secondMid] + mins).toFixed(tofix)); $('#2txtmid1').val(ds[firstMid].toFixed(tofix));
    $('#2txtlow2').val(ds[dataLength - 1].toFixed(tofix)); $('#2txtlow1').val(ds[secondMid].toFixed(tofix));

    setCustomLegend2();
}

var setCustomLegend2 = function () {
    var highDistrict = '', midDistrict = '', lowDistrict = '';
    var txtmid1 = parseFloat($('#2txtmid1').val());
    var txtmid2 = parseFloat($('#2txtmid2').val());
    var txtlow1 = parseFloat($('#2txtlow1').val());
    var txtlow2 = parseFloat($('#2txtlow2').val());
    var txthigh1 = parseFloat($('#2txthigh1').val());
    var txthigh2 = parseFloat($('#2txthigh2').val());
    var tmpVal;
    var highTotal = 0, midTotal = 0, lowTotal = 0;
    if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {
        aData2.sort(SortByRank);
        for (i = 0; i < ds.length; i++) {
            tmpVal = parseFloat((aData2[i].values).toFixed(tofix));
            if ((tmpVal >= txtlow2 && tmpVal <= txtlow1) || (tmpVal < txtlow2)) {
                aData2[i].color = '#db564b';   // red
                lowDistrict = lowDistrict + ' ' + aData2[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                lowTotal = lowTotal + 1;
            }
            if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                aData2[i].color = '#ddb63e';   // yellow
                midDistrict = midDistrict + ' ' + aData2[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                midTotal = midTotal + 1;
            }
            if ((tmpVal >= txthigh2 && tmpVal <= txthigh1) || (tmpVal > txthigh1)) {
                aData2[i].color = '#78AB46';   // green
                highDistrict = highDistrict + ' ' + aData2[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                highTotal = highTotal + 1;
            }
        }
        //--- set indicator lable
        $('#2high2').text($('#2txthigh2').val()); $('#2high1').text($('#2txthigh1').val());
        $('#2mid2').text($('#2txtmid2').val()); $('#2mid1').text($('#2txtmid1').val());
        $('#2low2').text($('#2txtlow2').val()); $('#2low1').text($('#2txtlow1').val());

        setMap2(cgData2, aData2);
        loadDoughnut();
        loadChart2(n, ds2);
        loadHbarChart();
    }
    else {
        alert('invalid value');
    }
}
//======= for disable right click and ctrl, alt, F12
//if (document.layers) {
//    document.captureEvents(Event.MOUSEDOWN);
//    document.onmousedown = function () {
//        return false;
//    };
//}
//else {
//    document.onmouseup = function (e) {
//        if (e != null && e.type == "mouseup") {
//            if (e.which == 2 || e.which == 3) {
//                return false;
//            }
//        }
//    };
//}
//document.oncontextmenu = function () {
//    return false;
//};
//document.onkeydown = function (event) {
//    event = (event || window.event);
//    if (event.keyCode == 123 || event.keyCode == 17 || event.keyCode == 18) {
//        return false;
//    }
//
var loadHbarChart = function () {
    //get difference data
    var differenceData = [];
    for (var i = 0; i < barData.length; i++)
    {
        differenceData.push(barData[i].toFixed(2) - barData2[i].toFixed(2))
    }
    var year1 = $('#ddlYear option:selected').text();
    var year2 = $('#ddlYear2 option:selected').text();
    document.getElementById('hBarSection').innerHTML = ' <canvas id="hBar" height="400%"> </canvas>';
    var ctxHbar = document.getElementById("hBar");
    var myHChart = new Chart(ctxHbar, {
        type: 'horizontalBar',
        data: {
            labels: barLable,
            datasets: [
                {
                    label: 'Difference (' + IndicatorName + ' ' + year1 + ' - ' + IndicatorName2 + ' ' + year2+') ',
                    data: differenceData,
                    //scaleFontColor: "#fff",
                    backgroundColor: "#26B99A"
                }
            ]
        },
        options: {
            events: false,
            showTooltips: false,
            animation: {
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    var chart = this;
                    var datasets = this.config.data.datasets;

                    datasets.forEach(function (dataset, i) {
                        ctx.font = "10px Arial";
                        ctx.fillStyle = "#0086b3";
                        chart.getDatasetMeta(i).data.forEach(function (p, j) {
                            if (datasets[i].data[j] > 0) {
                                ctx.fillText(datasets[i].data[j], p._model.x + 20, p._model.y);
                            }
                            else {
                                ctx.fillText(datasets[i].data[j], p._model.x - 20, p._model.y);
                            }
                        });
                    });
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: '11',
                        fontColor: "#666"
                    },
                    barPercentage: .5
                }],
                xAxes: [{
                    ticks: {
                        fontSize: '12',
                        categorySpacing: '20',
                        fontColor: "#666"
                    }
                }]
            }
        }
    });
}

var loadDoughnut = function () {
    var year1 = $('#ddlYear option:selected').text();
    var year2 = $('#ddlYear2 option:selected').text();
        var a = cgData.values;
        var b = cgData2.values;
        $('#cgDifference').text(a-b);
        document.getElementById('donutChartSection').innerHTML = ' <canvas id="donutChart" height="150px"> </canvas>';
        var data = {
            labels: [
                IndicatorName+' '+year1,
                IndicatorName2+' '+year2
            ],
            datasets: [
                {
                    label:"",
                    data: [a, b],   
                    backgroundColor: [
                        "#00b3b3",
                        "#ff6666"
                    ],
                    hoverBackgroundColor: [
                        "#008080",
                        "#ff4d4d"
                    ]
                },
            ]
        };
        var ctx = document.getElementById("donutChart");
        var myDoughnutChart = new Chart(ctx, {
            type: 'bar',
            data: data, options: { legend: { display: false } }
        });
}
function loadChart2(n, ds2) {
   
    Chart.defaults.global.defaultFontColor = '#666';
    var year1 = $('#ddlYear option:selected').text();
    var year2 = $('#ddlYear2 option:selected').text();
    document.getElementById('chartSection2').innerHTML = ' <canvas id="barChart2" height="100%"> </canvas>';

    var ctx2 = document.getElementById("barChart2");

    var myChart2 = new Chart(ctx2, {
        type: 'bar',

        data: {
            labels: barLable,
            datasets: [
                {
                    label: IndicatorName + ' ' + year1,
                data: barData,
                scaleFontColor: "#fff",
                backgroundColor: "#0AB0B4"
            },
            {
                label: IndicatorName2+' '+year2,
                data: barData2,
                scaleFontColor: "#fff",
                backgroundColor: "#666"
            }
            ]
        },

        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        min: 0,
                        //backgroundColor: 'rgba(255,255,255,.2)',
                        fontColor: "#666"
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: '10',
                        categorySpacing: '20',
                        fontColor: "#666"
                    },
                    barPercentage: .4
                }]
            }
        }
    });
};

$('#btnView').click(function () {
    getAllData2();
    getAllData();
  
})
//$('#ddlYear').change(function () {
//    loadDoughnut();
//    loadChart2(n, ds2);
//    loadHbarChart();
//})