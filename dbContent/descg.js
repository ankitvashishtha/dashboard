//var myFunction = 
//function OnSuccess_(reponse) {
    
//    var allData = reponse;
//    cgData = allData[0];
//    aData = allData[1];
   
//    $('.tooltip').hide();
//    mapUrl = 'map/' + cgData.mapUrl;
//    $('#barCount').text(aData.length);
//    $('#src').text(cgData.sourceName);
//    a = cgData.values;
//    var tempData = JSON.parse(JSON.stringify(aData));
//    var sortData = tempData.sort(SortByRank);
//    n = Object.keys(sortData).map(function (e) { return sortData[e].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); });
//    ds = Object.keys(sortData).map(function (e) { return sortData[e].values; });
    
//    higherLimit = ds[0];
//    $('#higherLimit').text(higherLimit);

//    if (cgData.unit == 'Percent' || cgData.unit == 'Ratio') {
//        mins = 0.01;
//        tofix = 2;
//        var appElement = document.querySelector('[ng-app=dashboardApp]');
//        var $scope = angular.element(appElement).scope();
//        $scope = $scope.$$childHead;
//        $scope.$apply(function () {
//            $scope.stp = 0.01;
//        });
//    }
//    else {
//        mins = 1;
//        tofix = 0;
//        var appElement = document.querySelector('[ng-app=dashboardApp]');
//        var $scope = angular.element(appElement).scope();
//        $scope = $scope.$$childHead;
//        $scope.$apply(function () {
//            $scope.stp = 1;
//        });
//    }
//    if (aData.length != 0) {
//        $('#map').text('');
//        setLegend();
//        if (cgData.values == 'NA')
//            $('#legendsection').hide();
//        else
//            $('#legendsection').show();

//        // cg population
//        $('#distName').text(cgData.name);
//        $('#cgData').text(cgData.values.toFixed(tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//        $('#txtUnit').text(cgData.unit);
//        // IUS
//        //var ddlSubgroup = document.getElementById("ddlSubgroup");
//        //below code temporary
//        $('#txtCG').text(IndicatorName);

//        setCentralTendancy(n, ds);
//        loadChart(n, ds);
//    }
//    else {
//        $('#map').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
//        $('#chartSection').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");

//    }
//    $("#wait").css("display", "none");
//}
//OnErrorCall_ = function OnErrorCall_(reponse) {
//    alert(reponse);
//}
//function SortByRank(a, b) {
//    var aName = parseInt(a.rank);
//    var bName = parseInt(b.rank);
//    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
//}
//function SortByVal(a, b) {
//    var aName = parseInt(a.values);
//    var bName = parseInt(b.values);
//    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
//}

//function SortByName(a, b) {
//    var aName = a.name;
//    var bName = b.name;
//    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
//}
//var setMap = function (cgData, aData) {
//    aData.sort(SortByName);
//    var width = 358,
//height = 580,
//centered;
//    d3.select("#mapsvg").remove();
//    var feature = "";
//    var projection = d3.geo.mercator().scale(4780)
//         .center([82.3224595, 20.97702712140104])
//        .translate([width / 2, height / 2]);
//    var path = d3.geo.path().projection(projection);
//    var canvas = d3.select("body").select("#map").append("svg").attr("id", "mapsvg")

//.attr("width", 350).attr("height", 570);
//    d3.json(mapUrl, function (data) {
//        var group = canvas.selectAll("g")
//        .data(data.features)
//        .enter()
//        .append("g")
//    .on("click", clicked);
//        //var projection = d3.geo.mercator().scale(4550).translate([-6370, 1980]);
//        //var projection = d3.geo.mercator();
//        //var path = d3.geo.path().projection(projection);
//        var tooltip = d3.select("body")
//.append("div")
//.attr("class", "tooltip")
//.style("opacity", 0);
//        var area = group.append("path")
//        .attr("d", path)
//       .style("fill", function (d, i) { return aData[i].color; })
//        .style("stroke", "white")
//           // .style("stroke:hover", "black")

//.on("mouseover", mouseover)
//.on("mousemove", mousemove)
//.on("mouseout", mouseout).style("stroke-width", 1);
//        group.append("text").attr("class", "maptxt")
//             //.attr("fill", function (d, i) { return aData[i].color; })
//        .attr("x", function (d, i) {
//            if (aData[i].name.toUpperCase() == 'BILASPUR'){ return (path.centroid(d)[0]) / 1.1; }
//            else if (aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
//            else if (aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
//            else if (aData[i].name.toUpperCase() == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.08; }
//            else if (aData[i].name.toUpperCase() == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
//            else if (aData[i].name.toUpperCase() == 'RAIPUR' && mapUrl=='map/cg18.json') { return (path.centroid(d)[0]) / 1; }
//            else {
//                return path.centroid(d)[0];
//            }
            
//        })
//        .attr("y", function (d,i) {
//            if (aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
//            else if (aData[i].name.toUpperCase() == 'RAIPUR' && (mapUrl == 'map/cg18.json' || mapUrl == 'map/cg16.json')) { return (path.centroid(d)[1]) / 1.2; }
//            else {
//                return path.centroid(d)[1];
//            }
//        })
//        .attr("text-anchor", "middle")
//        .text(function (d, i) { return aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
//          .attr("font-size", 11.5)
//            .on("mouseover", mouseover)
//.on("mousemove", mousemove)
//.on("mouseout", mouseout);
//        group.append("text").attr("class", "mapvals")
//            //.attr("fill", function (d, i) { return aData[i].color; })
//       .attr("x", function (d,i) {
//           if (aData[i].name.toUpperCase() == 'BILASPUR')
//           { return (path.centroid(d)[0]) / 1.07; }
//           else if (aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
//           else if (aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
//           else if (aData[i].name.toUpperCase() == 'RAIPUR' && (mapUrl == 'map/cg18.json' || mapUrl == 'map/cg16.json')) { return (path.centroid(d)[0]) / 1; }
//           else {
//               return path.centroid(d)[0];
//           }
//       })
//       .attr("y", function (d,i) {
//           if (aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
//           else if (aData[i].name.toUpperCase() == 'RAIPUR' && (mapUrl == 'map/cg18.json' || mapUrl == 'map/cg16.json')
//               ) { return (path.centroid(d)[1]) / 1.2; }
//           else {
//               return path.centroid(d)[1];
//           }
//       })
//       .attr("text-anchor", "middle")
//             .html(function (d, i) { return aData[i].values.toFixed(tofix); })
//            .attr("transform", "translate(0,10)")
//        .attr("font-size", 10)
//            .on("mouseover", mouseover)
//.on("mousemove", mousemove)
//.on("mouseout", mouseout);
//        function mouseover(d, i) {
//            //d3.select("body").style("stroke-width", '4px')
//            tooltip.transition()
//              .duration(200)
//              .style("opacity", .8);
//            $('#cgData').html(aData[i].values.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//            $('#distName').text(aData[i].name);
//        }
//        function mousemove(d, i) {
//            tooltip.html("District: " + aData[i].name + "<br/> Rank: " + aData[i].rank + "<br/>" + aData[i].values.toFixed(tofix))
//              .style("left", (d3.event.pageX-35) + "px")
//              .style("top", (d3.event.pageY - 110) + "px");
//        }
//        function mouseout() {
//            tooltip.transition()
//              .duration(500)
//              .style("opacity", 0);
       
//            $('#cgData').html(cgData.values.toFixed(tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//            $('#distName').text(cgData.name);
//        }
//        function clicked(d) {
//            //zoom function start
//            var x, y, k;
//            if (d && centered !== d) {
//                var centroid = path.centroid(d);
//                x = centroid[0];
//                y = centroid[1];
//                k = 4;
//                centered = d;
//                // All year district chart start
//                //$('#yearChart').show();
//                //var districtId = d.properties.ID_;
//                //var na = d.properties.name;
//                //$('#ChartDistName').text(d.properties.name);
//                //$.ajax({
//                //    type: "GET",
//                //    url: "api/dashboard/allYearDistChart",
//                //    data: { val: $('#ddlIndicator').val(), distId: districtId },
//                //    contentType: "application/json; charset=utf-8",
//                //    dataType: "json",
//                //    success: OnSuccessChart,
//                //    error: OnEr
//                //});
//                //function OnSuccessChart(reponse) {
//                //    var yearData = reponse.d;
//                //    var data = {
//                //        labels: ['1991', '2001', '2011'],
//                //        datasets: [{
//                //            label: "-",
//                //            fillColor: "rgba(3, 88, 106, 0.2)",
//                //            strokeColor: "rgba(3, 88, 106, 0.80)",
//                //            pointColor: "rgba(38, 185, 154, 0.7)",
//                //            pointStrokeColor: "#fff",
//                //            pointHighlightFill: "#fff",
//                //            pointHighlightStroke: "rgba(220,220,220,1)",
//                //            data: yearData
//                //        }]
//                //    };

//                //    document.getElementById('canvasDiv').innerHTML = ' <canvas id="canvas000"> </canvas>';
//                //    var ctx = $("#canvas000").get(0).getContext('2d');
//                //    ctx.canvas.height = 200;  // setting height of canvas
//                //    ctx.canvas.width = 300; // setting width of canvas

//                //    var lineChart = new Chart(ctx).Line(data, {
//                //        bezierCurve: false, scaleFontColor: "#E0F8E0"
//                //    });
//                //}
//                //function OnEr(reponse) {
//                //    alert(reponse);
//                //}
//                // All year district chart end
//            } else {
//                $('#yearChart').hide();
//                x = width / 2;
//                y = height / 2;
//                k = 1;
//                centered = null;

//            }
//            group.selectAll("path")
//                .classed("active", centered && function (d) { return d === centered; });
//            group.transition()
//                .duration(750)
//                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
//                .style("stroke-width", 1.5 / k + "px");
//            // zoom function end
//        }
        
//    });
//}
//function loadChart(n, ds) {
//    //document.getElementById('chartSection').innerHTML = ' <canvas id="barChart" height="135px"> </canvas>';
//    $('#chartSection').html(' <canvas id="barChart" height="135px" style="width:100%;"> </canvas>');
//    Chart.defaults.global.animation.duration = chartAnimation;
//    Chart.defaults.global.defaultFontColor = chartFontColor;
//    var ctx = document.getElementById("barChart");

//    var myChart = new Chart(ctx, {
//        type: 'bar',
        
//        data: {
//            labels: n,
//            datasets: [{
//                label: IndicatorName,
//                data: ds,
//                scaleFontColor: "#ff0000",
//                backgroundColor: chartColor
//            }]
//        },
//        options: {
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero: false,
//                        min: lowerLimit,
//                        //backgroundColor: 'rgba(255,255,255,.2)',
//                        fontColor: chartFontColor
//                    },
//                    gridLines: {
//                        display: false
//                    }
//                }],
//                xAxes: [{
//                    ticks: {
//                        fontSize: '12',
//                        categorySpacing: '20',
//                        fontColor: chartFontColor
//                    },
//                    barPercentage: 0.5,
//                    gridLines: {
//                        display: false
//                    }
//                }]
//            }
//        }
//    });
//};

/*---------------- Population Clock Start---------------*/
//function currencyFormat(num) {
//    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
//}
//function birth() {
//    var birthPerSec = 0.018308203;
//    today = new Date();
//    statsdate = new Date("March 1, 2011");
//    var population = 25545198;
//    var timeDiff = Math.abs((today - statsdate) / 1000);
//    var current_population = parseInt(population) + parseFloat(timeDiff * birthPerSec);
//    $('#population').html(currencyFormat(current_population));
//}
//setInterval(birth, 1000);
/*---------------- Population Clock End ---------------*/

///* set lower limit for chart */
//$('#lowerLimit').keypress(function (e) {
//    var key = e.which;
//    if (key == 13)  // the enter key code
//    {
//        lowerLimit = parseInt($('#lowerLimit').val());
//        var barCount = 0;
//        for (var i = 0; i < ds.length; i++)
//        {
//            if (ds[i] > lowerLimit)
//            { barCount = barCount + 1; }
//        }
//        $('#barCount').text(barCount);
//        $scope.loadChart(n, ds);
        
//    }
//});

// flip legend

//set indicator dropdown
//var setIndicators = function () {
//    $.ajax({
//        url: 'api/dashboard/getIndicator',
//        data: { sectorId: $('#ddlSector').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        var indis = data;
//        $("#ddlIndicator").empty();
        
//        $.each(indis, function (key, value) {
//            $("#ddlIndicator").append($("<option></option>").val(value.Id).html(value.indicatorName));
//            $("#ddlNumerator").append($("<option></option>").val(value.Id).html(value.indicatorName));
//            $("#ddlDenominator").append($("<option></option>").val(value.Id).html(value.indicatorName));
//        });
//        setYearDdl();
//    }).error(function (error) {
//        alert("Error!");
//    });
//}
//var setYearDdl = function () {
//    $.ajax({
//        url: 'api/dashboard/getYear',
//        data: {sectorId: $('#ddlSector').val(), indicatorId: $('#ddlIndicator').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        var years = data;
//        $("#ddlYear").empty();
//        $.each(years, function (key, value) {
//            $("#ddlYear").append($("<option></option>").val(value.year).html(value.year));
//            $("#ddlYearNum").append($("<option></option>").val(value.year).html(value.year));
//            $("#ddlYearDen").append($("<option></option>").val(value.year).html(value.year));
//        });
//        setSourceDdl();
//    }).error(function (error) {
//        alert("Error!");
//    });
//}
//var setSourceDdl = function () {
//    $.ajax({
//        url: 'api/dashboard/getSources',
//        data: {sectorId: $('#ddlSector').val(), indicatorId: $('#ddlIndicator').val(), yearId: $('#ddlYear').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        $("#ddlSource").empty();

//        var sources = data;
//        $.each(sources, function (key, value) {
//            $("#ddlSource").append($("<option></option>").val(value.id).html(value.sourceName));
//        });
//        setMapDdl();
//    }).error(function (error) {
//        alert("Error!");
//    });
//}
//var setMapDdl = function () {
//    $.ajax({
//        url: 'api/dashboard/getMapName',
//        data: {sectorId: $('#ddlSector').val(), indicatorId: $('#ddlIndicator').val(), yearId: $('#ddlYear').val(), sourceId: $('#ddlSource').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        $("#ddlMap").empty();

//        var maps = data;
//        $.each(maps, function (key, value) {
//            $("#ddlMap").append($("<option></option>").val(value.id).html(value.mapName));
//        });
//        getAllData();
//    }).error(function (error) {
//        alert("Error!");
//    });
//}
//var getAllData = function () {
//    //$("#wait").css("display", "block");
//    lowerLimit = parseInt($('#lowerLimit').val());
//    var col = $('#ddlIndicator').val();
//    IndicatorName = $('#ddlIndicator option:selected').text();
//    $.ajax({
//        type: "GET",
//        url: "api/dashboard/getAllData",
//        data: { sectorId: $("#ddlSector").val(), indicatorId: $('#ddlIndicator').val(), yearId: $("#ddlYear").val(), sourceId: $("#ddlSource").val(), mapId: $("#ddlMap").val() },
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: OnSuccess_,
//        error: OnErrorCall_
//    });
//    //$("#wait").css("display", "block");
//}
// Start displaying List of Units

function getDistList(type) {
    $("#ModalHeader").text(' ');
    $('#dlist').empty();
    $.ajax({
        url: 'api/dashboard/getDistList',
        type: 'get',
        data: {  DisType: type },
        contentType: 'application/json'
    }).success(function (data) {
       
        var strResult = '';
        if (type == 'D') {
            $("#ModalHeader").text("District List");
            strResult = "<table class='table  table-striped table-condensed' ><th>S No.</th><th> District Name</th><th> District Code</th>";
            $.each(data, function (key, val) {
                strResult += '<tr><td>' + val.SNo + '</td><td>' + val.DistName + '</td><td>' + val.DistCode + '</td></tr>';
            });
            strResult += '</table>';
            $('#dlist').html(strResult);
        }
        else if (type == 'T') {
            $("#ModalHeader").text("Tehsil List");
            strResult = "<table class='table  table-striped table-condensed' ><th>S No.</th><th> District Name</th><th> Tehsil Name</th><th> Tehsil Code</th>";
            $.each(data, function (key, val) {
                strResult += '<tr><td>' + val.SNo + '</td><td>' + val.DistName + '</td><td>' + val.TehsilName + '</td><td>' + val.DistCode + '</td></tr>';
            });
            strResult += '</table>';
            $('#dlist').html(strResult);
        }
        else if (type == 'B') {
            $("#ModalHeader").text("Blocks List");
            strResult = "<table class='table  table-striped table-condensed' ><th>S No.</th><th> District Name</th><th> Block Name</th><th> Block Code</th>";
            $.each(data, function (key, val) {
                strResult += '<tr><td>' + val.SNo + '</td><td>' + val.DistName + '</td><td>' + val.BlockName + '</td><td>' + val.DistCode + '</td></tr>';
            });
            strResult += '</table>';
            $('#dlist').html(strResult);
        }
        else if (type == 'R') {
            $("#ModalHeader").text("Gram Panchayat List");
            strResult = "<table class='table  table-striped table-condensed' ><th>S No.</th><th> District Name</th><th> Block Name</th><th> Gram Panchayat Name</th><th> Gram Panchayat Code</th>";
            $.each(data, function (key, val) {
                strResult += '<tr><td>' + val.SNo + '</td><td>' + val.DistName + '</td><td>' + val.BlockName + '</td><td>' + val.RuralName + '</td><td>' + val.DistCode + '</td></tr>';
            });
            strResult += '</table>';
            $('#dlist').html(strResult);
        }
        
    }).error(function (error) {
        alert("Error!");
    });
    if (type == 'V') {
        $("#ModalHeader").text("Division");
        strResult = "<table class='table  table-striped table-condensed' ><th>S No.</th><th> Division Name</th>";
        strResult += '<tr><td>1</td><td>Bastar</td></tr> <tr><td>2</td><td>Bilaspur</td></tr> <tr><td>3</td><td>Durg</td></tr> <tr><td>4</td><td>Raipur</td></tr> <tr><td>5</td><td>Surguja</td></tr>';
        strResult += '</table>';
        $('#dlist').html(strResult);
    }
}
//var GetCount = function () {
//    $.ajax({
//        url: 'api/dashboard/GetCount',
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        $("#DisValue").text(data.District);
//        $("#TehValue").text(data.Tehsil);
//        $("#BlkValue").text(data.Block);
//        $("#GpValue").text(data.Rural);
//    }).error(function (error) {
//        alert("Error!");
//    });
//}

//var setNumerator = function () {
//    $.ajax({
//        url: 'api/dashboard/getIndicator',
//        data: { sectorId: $('#ddlSector1').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        var indis = data[0];
//        var years = data[1];
//        $("#ddlNumerator").empty();
//        $("#ddlYearNum").empty();
//        $.each(indis, function (key, value) {
//            $("#ddlNumerator").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
//        });
//        $.each(years, function (key, value) {
//            $("#ddlYearNum").append($("<option></option>").val(value.year).html(value.year));
//        });
//    }).error(function (error) {
//        alert("Error!");
//    });
//}
//var setDenominator = function () {
//    $.ajax({
//        url: 'api/dashboard/getIndicator',
//        data: { sectorId: $('#ddlSector2').val() },
//        type: 'get',
//        contentType: 'application/json'
//    }).success(function (data) {
//        var indis = data[0];
//        var years = data[1];
//        $("#ddlDenominator").empty();
//        $("#ddlYearDen").empty();
//        $.each(indis, function (key, value) {
//            $("#ddlDenominator").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
//        });
//        $.each(years, function (key, value) {
//            $("#ddlYearDen").append($("<option></option>").val(value.year).html(value.year));
//        });
//    }).error(function (error) {
//        alert("Error!");
//    });

//}

//-------- custom indicator -----------------
//var getCstmIndi = function () {
//    mins = 0.01;
//    tofix = 2;
//    cgData.unit = "Ratio";
//    IndicatorName = $('#custIndicator').val();
//    //$('#yearChart').hide();
//    lowerLimit = parseInt($('#lowerLimit').val());
//    var sectorId1 = $('#ddlSector1').val();
//    var sectorId2 = $('#ddlSector2').val();
//    var num = $('#ddlNumerator').val();
//    var den = $('#ddlDenominator').val();
//    var yearNum = $('#ddlYearNum').val();
//    var yearDen = $('#ddlYearDen').val();
//    var mul = $('#txtMul').val();
//    $.ajax({
//        type: "GET",
//        url: "api/dashboard/getCustomIndicator",
//        data: { sectorId1: sectorId1, num: num, yearNum: yearNum, sectorId2: sectorId2, den: den, yearDen: yearDen, mul: mul },
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: OnSuccess_,
//        error: OnErrorCall_
//    });
//    $('#filters').hide();
//    $('#customFilters').text($('#txtCG').text()+' ('+$('#txtUnit').te);
//    $('#customFilters').show();
//    $("#wait").css("display", "block");
//}

//--------- set central tendency -----------
//var setCentralTendancy = function (label, data) {
//    //mean
//    var distMean = 0;
//    for (i = 0; i < data.length; i++) {
//        distMean = distMean + data[i];
//    }
//    distMean = distMean / data.length;
//    $('.distMean').text(distMean.toFixed(tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//    $('#nearMean').text(label[getClosest(distMean, data)].replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }));

//    // median
//    var medianValue=0;
//    var middle = Math.floor(data.length / 2);
//    if (data.length % 2 == 1) {
//        $('.distMedian').text(data[middle].toFixed(tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//        $('#nearMedian').text(label[middle].replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }));
//    } else {
//        medianValue = (data[middle - 1] + data[middle]) / 2.0;
//        $('.distMedian').text(medianValue.toFixed(tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
//        $('#nearMedian').html(label[middle - 1].replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ' and<br><br>' + label[middle].replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }));
//    }
//    //Range
//    $('#range').text(data[data.length - 1].toFixed(tofix) + '-' + data[0].toFixed(tofix));

//    // Variance
//    var total = 0;
//    for (i = 0; i < data.length; i++) {
//        total = total + Math.pow((data[i] - distMean), 2);
//    }
//    var variance = total / data.length;
//    $('#variance').text(variance.toFixed(2));

//    // Standard Deviation
//    $('#standardDeviation').text(Math.sqrt(variance).toFixed(2));
//}
//var getClosest = function (number, array) {
//    var current = 0;
//    var difference = Math.abs(number - current);
//    var index = array.length;
//    while (index--) {
//        var newDifference = Math.abs(number - array[index]);
//        if (newDifference < difference) {
//            difference = newDifference;
//            current = index;
//        }
//    }
//    return current;
//};
////-------------- set legend----------------
//var setLegend = function () {
//    var firstMid = 0, secondMid = 0, dataLength = 0;
//    $.each(ds, function (i, value) {
//        if (value != -1) {
//            dataLength++;
//        }
//    })
//    if (dataLength > 2) {
//        firstMid = Math.floor(dataLength / 3);
//        secondMid = 2 * firstMid;
//        if (dataLength % 3 == 2) {
//            firstMid++;
//            secondMid++;
//        }
//    }
//    $('#txthigh2').val((ds[firstMid] + mins).toFixed(tofix)); $('#txthigh1').val(ds[0].toFixed(tofix));
//    $('#txtmid2').val((ds[secondMid] + mins).toFixed(tofix)); $('#txtmid1').val(ds[firstMid].toFixed(tofix));
//    $('#txtlow2').val(ds[dataLength - 1].toFixed(tofix)); $('#txtlow1').val(ds[secondMid].toFixed(tofix));
//    setCustomLegend();
//}
//var setCustomLegend = function () {
//    var highDistrict = '', midDistrict = '', lowDistrict = '';
//    var txtmid1 = parseFloat($('#txtmid1').val());
//    var txtmid2 = parseFloat($('#txtmid2').val());
//    var txtlow1 = parseFloat($('#txtlow1').val());
//    var txtlow2 = parseFloat($('#txtlow2').val());
//    var txthigh1 = parseFloat($('#txthigh1').val());
//    var txthigh2 = parseFloat($('#txthigh2').val());
//    var tmpVal;
//    var highTotal = 0, midTotal = 0, lowTotal = 0;
//    if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {
//        aData.sort(SortByRank);
//        for (i = 0; i < ds.length; i++) {
//            tmpVal = parseFloat((aData[i].values).toFixed(tofix));
//            if (tmpVal >= txtlow2 && tmpVal <= txtlow1) {
//                aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
//                lowDistrict = lowDistrict + ' ' + aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
//                lowTotal = lowTotal + 1;
//            }
//            if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
//                aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
//                midDistrict = midDistrict + ' ' + aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
//                midTotal = midTotal + 1;
//            }
//            if (tmpVal >= txthigh2 && tmpVal <= txthigh1) {
//                aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
//                highDistrict = highDistrict + ' ' + aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
//                highTotal = highTotal + 1;
//            }
//        }
//        //--- set indicator lable
//        $('.high2').text($('#txthigh2').val()); $('.high1').text($('#txthigh1').val());
//        $('.mid2').text($('#txtmid2').val()); $('.mid1').text($('#txtmid1').val());
//        $('.low2').text($('#txtlow2').val()); $('.low1').text($('#txtlow1').val());

//        $('#highDist').text(highDistrict);
//        $('#midDist').text(midDistrict);
//        $('#lowDist').text(lowDistrict);

//        $('#highTotal').text(highTotal);
//        $('#midTotal').text(midTotal);
//        $('#lowTotal').text(lowTotal);
//        aData.sort(SortById);
//        setMap(cgData, aData);

//    }
//    else {
//        alert('invalid value');
//    }
//}
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
//}

// uplaod data start
//var X = XLSX;
//function fixdata(data) {
//    var o = "", l = 0, w = 10240;
//    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
//    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
//    return o;
//}
//function to_json(workbook) {
//    var result = {};
//    var s = {};
//    workbook.SheetNames.forEach(function (sheetName) {
//        var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//        if (roa.length > 0) {
//            result[sheetName] = roa;
//        }
//        s = Object.keys(workbook.Sheets);
//    });
//    $("#ddlIndicatorExcel").empty();
//    $("#ddlYearExcel").empty();
//    $("#ddlIndicator").hide();
//    $("#ddlYear").hide();
//    $("#ddlIndicatorExcel").show();
//    $("#ddlYearExcel").show();
//    var k = Object.keys(result[s[0]][0]);
//    $.each(k, function (key, value) {
//        if (key > 1)
//            $("#ddlIndicatorExcel").append($("<option></option>").val(value).html(value));
//    });
//    $.each(s, function (key, value) {
//        $("#ddlYearExcel").append($("<option></option>").val(value).html(value));
//    });
//    return result;
//}
//function process_wb(wb) {
//    var output = JSON.stringify(to_json(wb), 2, 2);
//    excelOutput = output;
//    output = $.parseJSON(output);
//    excelOutput = $.parseJSON(excelOutput);
//    yearName = $("#ddlYearExcel").val();
//    columnName = $("#ddlIndicatorExcel").val();
//    IndicatorName = $('#ddlIndicatorExcel option:selected').text();

//    var ad = [];
//    //var ad = Object.keys(output).map(function (e) { return output[e][columnName]; });
//    var sector = output[yearName][28]['Name'];
//    var source = output[yearName][29]['Name'];
//    var unit = output[yearName][30];
//    $("#ddlSector").empty();
//    $("#ddlSector").append($("<option></option>").val(sector).html(sector));
//    $("#src").text(source);
//    // set data for 27 district
//    for (var k = 0; k < ds.length; k++) {
//        ad.push({
//            id: output[yearName][k]['Id'],
//            rank: 0,
//            name: output[yearName][k]['Name'],
//            values: parseFloat(output[yearName][k][columnName]),
//            color: 'silver',
//            unit: unit[0]
//        });
//    }
//    var tempData = JSON.parse(JSON.stringify(ad));
//    var sortData = tempData.sort(SortByVal);
//    for (var rank = 0; rank < ds.length; rank++) {
//        sortData[rank].rank = ds.length - rank;
//    }
//    var nd = tempData.sort(SortByName);
//    // set data for chhattisgarh
//    var cd = {
//        id: output[yearName][ds.length]['Id'],
//        rank: 28,
//        name: output[yearName][ds.length]['Name'],
//        values: parseFloat(output[yearName][ds.length][columnName]),
//        color: '#000',
//        unit: unit[0]
//    };
//    //var unit = output[yearName][30];
//    var ac = [cd, nd];
//    //uploadData.push(sector);
//    //uploadData.push(source);
//    //uploadData.push(unit);
//    //uploadData.push(cd);
//    //uploadData.push(nd);
//    OnSuccess_(ac);
//    //if (out.innerText === undefined) out.textContent = output;
//    //else out.innerText = output;
//    //if (typeof console !== 'undefined') console.log("output", new Date());
//}
//var drop = document.getElementById('drop');
//function handleDrop(e) {
//    e.stopPropagation();
//    e.preventDefault();
//    var files = e.dataTransfer.files;
//    var f = files[0];
//    {
//        var reader = new FileReader();
//        var name = f.name;
//        reader.onload = function (e) {
//            var data = e.target.result;
//            var wb;
//            var arr = fixdata(data);
//            wb = X.read(btoa(arr), { type: 'base64' });
//            process_wb(wb);
//        };
//        reader.readAsArrayBuffer(f);
//    }
//}
//function handleDragover(e) {
//    e.stopPropagation();
//    e.preventDefault();
//    e.dataTransfer.dropEffect = 'copy';
//}
//if (drop.addEventListener) {
//    drop.addEventListener('dragenter', handleDragover, false);
//    drop.addEventListener('dragover', handleDragover, false);
//    drop.addEventListener('drop', handleDrop, false);
//}
//var xlf = document.getElementById('xlf');
////var xlf = $('#xlf');

//function handleFile(e) {
//    var files = e.target.files;
//    var f = files[0];
//    {
//        var reader = new FileReader();
//        var name = f.name;
//        reader.onload = function (e) {
//            var data = e.target.result;
//            var wb;
//            var arr = fixdata(data);
//            wb = X.read(btoa(arr), { type: 'base64' });
//            process_wb(wb);
//        };
//        reader.readAsArrayBuffer(f);
//    }
//}
//var getAllDataExcel = function () {
//    yearName = $("#ddlYearExcel").val();
//    columnName = $("#ddlIndicatorExcel").val();
//    IndicatorName = $('#ddlIndicatorExcel option:selected').text();
//    var ad = [];
//    var sector = excelOutput[yearName][28]['Name'];
//    var source = excelOutput[yearName][29]['Name'];
//    var unit = excelOutput[yearName][30];
//    $("#ddlSector").empty();
//    $("#ddlSector").append($("<option></option>").val(sector).html(sector));
//    $("#src").text(source);
//    for (var k = 0; k < ds.length; k++) {
//        ad.push({
//            id: excelOutput[yearName][k]['Id'],
//            rank: 0,
//            name: excelOutput[yearName][k]['Name'],
//            values: parseFloat(excelOutput[yearName][k][columnName]),
//            color: 'silver',
//            unit: unit[columnName]
//        });
//    }
//    var tempData = JSON.parse(JSON.stringify(ad));
//    var sortData = tempData.sort(SortByVal);
//    for (var rank = 0; rank < ds.length; rank++) {
//        sortData[rank].rank = ds.length - rank;
//    }
//    var nd = tempData.sort(SortByName);
//    var cd = {
//        id: excelOutput[yearName][ds.length]['Id'],
//        rank: 28,
//        name: excelOutput[yearName][ds.length]['Name'],
//        values: parseFloat(excelOutput[yearName][ds.length][columnName]),
//        color: '#000',
//        unit: unit[columnName]
//    };
//    var ac = [cd, nd];
//    OnSuccess_(ac);
//}

//if (xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
// upload data end

// download pdf start
//$(document).ready(function () {
//    var element = $("#map"); // global variablebarChart
//    var element2 = $("#chartSection"); // global variablebarChart
//    var getCanvas; // global variable

//    $("#btn-Preview-Image").on('click', function () {
//        //$("#wait").css("display", "block");
//        //chartAnimation = 1;
//        //chartFontColor = '#000';
//        //chartColor = '#333';
//       // loadChart(n, ds);
//        $("#map").css("color", "rgba(255,0,0,0)");
//       $("#map").css('background-color', 'white');
//       $("#barChart").css('background-color', 'rgb(255,255,255)');
        
//        $(".hidepane").hide();
//        var doc = new jsPDF('landscape');
//        var width = doc.internal.pageSize.width;
//        var height = doc.internal.pageSize.height;
//        html2canvas(element, {
//            onrendered: function (canvas) {
//                getCanvas = canvas;

//                var imgData = getCanvas.toDataURL('image/jpeg', 1.0);
//                doc.addImage(imgData, 'JPEG', 10, 50, width - 200, height - 86);//295, 200 
//                $("#map").removeAttr("style");

//                // Draw Legends Square
//                doc.setDrawColor(0);
//                doc.setFillColor(0, 102, 0);
//                doc.rect(60, 140, 5, 5, 'FD'); // filled green square                     
//                doc.setFillColor(255, 204, 0);
//                doc.rect(60, 148, 5, 5, 'FD'); // filled yellow square                   
//                doc.setFillColor(255, 0, 0);
//                doc.rect(60, 156, 5, 5, 'FD'); // filled red square 
//                doc.setFillColor(152, 159, 165);
//                doc.rect(60, 164, 5, 5, 'FD'); // filled grey square 
//                //Legends Value(Range)
//                doc.text(70, 145, document.getElementById('high2').innerText + ' - ' + document.getElementById('high1').innerText);
//                doc.text(70, 153, document.getElementById('mid2').innerText + ' - ' + document.getElementById('mid1').innerText);
//                doc.text(70, 161, document.getElementById('low2').innerText + ' - ' + document.getElementById('low1').innerText);
//                doc.text(70, 169, 'Not Available');
//            }
//        });
//        html2canvas(element2, {
//            onrendered: function (canvas) {
//                getCanvas = canvas;
//                var imgDataChart = getCanvas.toDataURL("image/jpeg", 1.0);
//                doc.addImage(imgDataChart, 'JPEG', 90, 45, 200, 90);
//                //$("#barChart").removeAttr("style");
//                //chartAnimation = 1000;
//                //chartFontColor = '#fff';
//                //chartColor = '#fff';
//                //loadChart(n,ds)
//                doc.save("DesCgDasboard.pdf");
//                $("#wait").css("display", "none");
//                //$("#map").removeAttr("style");
//            }
//        });
//        //Chart
//        doc.setFontSize(15);

//        //SectorIndicator
//        doc.text(100, 40, document.getElementById('txtCG').innerText + ' (' + document.getElementById('txtUnit').innerText + ')');
//        //doc.text(100, 40, $("#ddlSector option:selected").text() + ' : ');
//        //doc.text(130, 40, $("#ddlIndicator option:selected").text() + ' ( ' + $("#ddlYear option:selected").text() + ' ) ');
       

//        //Upper Block Values
//        doc.text(15, 30, document.getElementById('DivisionValue').innerText);
//        doc.text(55, 30, document.getElementById('DisValue').innerText);
//        doc.text(95, 30, document.getElementById('TehValue').innerText);
//        doc.text(145, 30, document.getElementById('BlkValue').innerText);
//        doc.text(190, 30, document.getElementById('GpValue').innerText);
//        doc.text(width - 45, 30, document.getElementById('VilValue').innerText);

//        // Mean Median Values
//        doc.text(110, 160, document.getElementById('cgData').innerText); // cG data
//        doc.text(161, 160, document.getElementById('nearMean').innerText); // mean data
//        doc.text(211, 160, document.getElementById('nearMedian').innerText);

//        $("#population").removeClass('popCounter');
//        doc.text(10, 192, document.getElementById('population').innerText);  //population clock
//        $("#population").addClass('popCounter');

//        // Font Size Small, Colour Black
//        doc.setFontSize(10);

//        //Rank Dist
//        var splitTitle = doc.splitTextToSize(document.getElementById('highDist').innerText, 75);
//        var splitTitle1 = doc.splitTextToSize(document.getElementById('midDist').innerText, 75);
//        var splitTitle2 = doc.splitTextToSize(document.getElementById('lowDist').innerText, 75);
//        doc.text(55, 187, splitTitle);
//        doc.text(135, 187, splitTitle1);
//        doc.text(215, 187, splitTitle2);

//        // Mean Median Values
//        doc.text(250, 155, document.getElementById('meanLower').innerText);
//        doc.text(250, 163, document.getElementById('medianLower').innerText);
//        doc.text(250, 170, document.getElementById('rangeText').innerText);
//        //doc.text(251, 170, document.getElementById('range').innerText);//document.getElementById('').innerText + ' : ' +
//        doc.text(10, 10, document.getElementById('txtHeading').innerText);

//        //DateTime Display
//        var newDate = new Date();
//        $("#chartText").html(newDate);
//        doc.text(190, 10, document.getElementById('chartText').innerText);
//        $("#chartText").text('  ');

//        // Font Size Small, Colour Red
//        doc.setTextColor(165, 0, 0);

//        // Horizontal line 
//        doc.setLineWidth(0.2);
//        doc.line(10, 12, width - 10, 12); //Top horizontal line  
//        doc.line(10, 32, width - 10, 32); // Mid horizontal line  
//        doc.line(10, 140, width - 10, 140); // legends start line
//        doc.line(10, 175, width - 10, 175);  // bottom line

//        //Upper Block Text
//        doc.setTextColor(165, 0, 0);
//        doc.text(10, 20, document.getElementById('DivisionText').innerText + ":");
//        doc.text(50, 20, document.getElementById('DisText').innerText + ":");
//        doc.text(90, 20, document.getElementById('TehText').innerText + ":");
//        doc.text(140, 20, document.getElementById('BlkText').innerText + ":");
//        doc.text(185, 20, document.getElementById('GpText').innerText + ":");
//        doc.text(width - 50, 20, document.getElementById('VilText').innerText + ":");

//        //Source Above Map
//        doc.text(10, 47, document.getElementById('txtSource').innerText);


 

//        // Chhattisgarh data
//        doc.text(110, 147, document.getElementById('distName').innerText);
//        doc.text(110, 170, document.getElementById('txtCG').innerText + ' (' + document.getElementById('txtUnit').innerText + ')');

//        //Nearest Mean
//        doc.text(160, 147, document.getElementById('nearMeanTxt').innerText);
//        doc.text(160, 170, document.getElementById('meanLower').innerText);

//        //Nearest Median    
//        doc.text(210, 147, document.getElementById('nearMedianTxt').innerText);
//        doc.text(210, 170, document.getElementById('medianLower').innerText);
//        //Nearest Median    
//        doc.text(250, 147, document.getElementById('ctText').innerText);

//        //Population Clock
//        doc.text(10, 181, document.getElementById('PopClock').innerText);
//        doc.text(10, 202, document.getElementById('PopState').innerText);

//        //Rank
//        doc.text(55, 181, document.getElementById('highText').innerText);
//        doc.text(135, 181, document.getElementById('midText').innerText);
//        doc.text(215, 181, document.getElementById('lowText').innerText);
//        doc.text(55, 202, 'Total : ' + document.getElementById('highTotal').innerText);
//        doc.text(135, 202, 'Total : ' + document.getElementById('midTotal').innerText);
//        doc.text(215, 202, 'Total : ' + document.getElementById('lowTotal').innerText);

//        // Font Size Small, Colour Red
//        doc.setTextColor(0, 0, 0);

//        doc.text(25, 47, document.getElementById('src').innerText);

//        var download = document.getElementById('download');
//        //doc.save("DesCgDasboard.pdf");

//        $(".hidepane").show();

//    });
//});
// download only map
//var downloadMap=function () {
//    var element = $("#FullMapSection"); // global variable
//    var getCanvas; // global variable
   
//       $("#map").css("color", "rgba(255,0,0,0)");
//        $("#map").css('background-color', 'white');
//        $("#legendBack").hide();
//       $("#legendname").css('color', 'black');
//        html2canvas(element, {
//            onrendered: function (canvas) {
//                //$("#previewImage").append(canvas);
//                getCanvas = canvas;
//                var imgageData = getCanvas.toDataURL("image/png");
//                // Now browser starts downloading it instead of just showing it
//                var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
//                $("#map_dwld").attr("download", "cgMap.png").attr("href", newData);
//            }
//        });
//        $("#legendname").removeAttr("style");
//        $("#map").removeAttr("style");
//        $("#legendBack").show();
    
//};
////optional label
//$("#cbDistName").change(function () {
//    if (this.checked) {
//        $('.maptxt').show();
//    }
//    else {
//        $('.maptxt').hide();
//    }
//});
//$("#cbDistValue").change(function () {
//    if (this.checked) {
//        $('.mapvals').show();
//    }
//    else {
//        $('.mapvals').hide();
//    }
//});
// sortable start
//$(function () {
//    "use strict";
//    //Make the dashboard widgets sortable Using jquery UI
//    $(".connectedSortable").sortable({ dropOnEmpty: true });
//    $(".rowSortable").sortable({ dropOnEmpty: true });
//    //$(".row-fluid").css("cursor", "move");
//});
// sortable end

// for 18 district map
//var setFilters = function () {
//    if ($('#ddlDistNo').val() == 1)
//        mapUrl = 'map/cg27.json';
//    else if ($('#ddlDistNo').val() == 2)
//        mapUrl = 'map/cg18.json';
//    else if ($('#ddlDistNo').val() == 3)
//        mapUrl = 'cg16.json';

    //$.ajax({
    //    url: 'api/dashboard/getFilters',
    //    data: { DistNo: $('#ddlDistNo').val() },
    //    type: 'get',
    //    contentType: 'application/json'
    //}).success(function (data) {
    //    var indis = data[0];
    //    var years = data[1];
    //    $("#ddlIndicator").empty();
    //    $("#ddlYear").empty();
    //    $.each(indis, function (key, value) {
    //        $("#ddlIndicator").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
    //        $("#ddlNumerator").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
    //        $("#ddlDenominator").append($("<option></option>").val(value.ColumnName).html(value.indicatorName));
    //    });
    //    $.each(years, function (key, value) {
    //        $("#ddlYear").append($("<option></option>").val(value.year).html(value.year));
    //        $("#ddlYearNum").append($("<option></option>").val(value.year).html(value.year));
    //        $("#ddlYearDen").append($("<option></option>").val(value.year).html(value.year));
    //    });
    //    getAllData();
    //}).error(function (error) {
    //    alert("Error!");
    //});
//}
//NProgress.configure({ showSpinner: true });