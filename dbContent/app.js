//var app = angular.module('myApp', []);
//var baseUrl = 'http://localhost:52815/';
var baseUrl = 'http://descg.gov.in/emps/';
var app = angular.module('dashboardApp', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'dbView/dbHome.html',
            controller: 'globleCtrl'
        })
     .state('compDashboard', {
         url: '/compDashboard',
         templateUrl: 'dbView/dbComp.html',
         controller: 'globleCtrl'
     })
        .state('india', {
            url: '/india',
            templateUrl: 'dbView/dbIndia.html',
            controller: 'globleCtrl'
        })
    .state('setting', {
        url: '/setting',
        templateUrl: 'dbView/dbSetting.html',
        controller: 'globleCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'dbView/dbLogin.html',
        controller: 'globleCtrl'
    })
    .state('additionalData', {
        url: '/additionalData',
        templateUrl: 'dbView/dbAdditionalData.html',
        controller: 'globleCtrl'
    })
    ;
    $locationProvider.html5Mode(true);
}]);

app.controller('filterCtrl', ['$scope', '$http', function ($scope, $http) {
   
    //$scope.ddlSector = 1;
    $scope.setSectors = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl+'api/dashboard/getSector'
        }).then(function mySucces(response) {
            $scope.sectors = response.data;
            $scope.ddlSector = $scope.sectors[0];
            $scope.setIndicators();
        }, function myError(response) {
            alert("Error indicator");
        });
    }
    $scope.setIndicators = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getIndicator',
            params: { sectorId: $scope.ddlSector.id }
        }).then(function mySucces(response) {
            $scope.indicators = response.data;
            $scope.ddlIndicator = $scope.indicators[0];
            $scope.setYearDdl();
        }, function myError(response) {
            alert("Error indicator");
        });
    }
    $scope.setYearDdl = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getYear',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id }
        }).then(function mySucces(response) {
            $scope.years = response.data;
            $scope.ddlYear = $scope.years[0];
            $scope.setSourceDdl();
        }, function myError(response) {
            alert("Error year");
        });
    }
    $scope.setSourceDdl = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSources',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year }
        }).then(function mySucces(response) {
            $scope.sources = response.data;
            $scope.ddlSource = $scope.sources[0];
            $scope.setMapDdl();
        }, function myError(response) {
            alert("Error source");
        });
    }
    $scope.setMapDdl = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getMapName',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year, sourceId: $scope.ddlSource.id }
        }).then(function mySucces(response) {
            $scope.maps = response.data;
            $scope.ddlMap = $scope.maps[0];
            $scope.getAllData();
        }, function myError(response) {
            alert("Error map");
        });
    }
    $scope.getAllData = function () {
        NProgress.start();
        lowerLimit = parseInt($('#lowerLimit').val());
        var col = $('#ddlIndicator').val();
        IndicatorName = $('#ddlIndicator option:selected').text();
        $http({
            method: "GET",
            url: baseUrl + "api/dashboard/getAllData",
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year, sourceId: $scope.ddlSource.id, mapId: $scope.ddlMap.id, areaLevel:$scope.areaLevel },
        }).then(function mySucces(response) {
            $scope.setDashboard(response.data);
            //$scope.setDashboard2(response.data);
            NProgress.done();

        }, function myError(response) {
            alert("Error dashboard");
        });
    }
    $scope.setSectors();
    
}]);
app.controller('dashboardCtrl', ['$scope', '$http',  function ($scope, $http) {
    $scope.stp = 1;
    $scope.pdfLoader = 'fa-file-pdf-o';
    $scope.pdfBook = 'fa-book';
    $scope.areaLevel = 2; // for chhattisgarh
    $("#ddlIndicatorExcel").hide();
    $("#ddlYearExcel").hide();
    //set indicator dropdown
    $scope.setDashboard = function (allData) {
        $scope.cgData = allData[0];
        $scope.aData = allData[1];
        //hide tooltip every filter
        $('.tooltip').hide();
        //set all variables
        $scope.mapUrl = 'map/' + $scope.cgData.mapUrl;
        $scope.natureId = $scope.cgData.natureId;
        $scope.noOfDist = $scope.aData.length;
        //$scope.sourcesName = $scope.aData.sourceName;
        var tempData = JSON.parse(JSON.stringify($scope.aData));
        var sortData = tempData.sort($scope.SortByRank);
        $scope.n = Object.keys(sortData).map(function (e) { return sortData[e].name + '(' + sortData[e].rank + ')'; });
        $scope.label = Object.keys(sortData).map(function (e) { return sortData[e].name; });
        $scope.ds = Object.keys(sortData).map(function (e) { return sortData[e].values; });
        $scope.higherLimit = $scope.ds[0];
        // set step for legend
        if ($scope.cgData.unit == 'Percent' || $scope.cgData.unit == 'Ratio' || $scope.cgData.unit == 'Rate') {
            $scope.mins = 0.01;
            $scope.tofix = 2;
            $scope.stp = 0.01;
        }
        else {
            $scope.mins = 1;
            $scope.tofix = 0;
            $scope.stp = 1;
        }
        if ($scope.aData.length != 0) {
            $('#map').text('');
            $scope.setLegend();
            if ($scope.cgData.values == 'NA')
                $('#legendsection').hide();
            else
                $('#legendsection').show();

            // cg population
            $('#distName').text($scope.cgData.name);
            $('#cgData').text($scope.cgData.values.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            $('#txtUnit').text($scope.cgData.unit);
            // IUS
            //below code temporary
            $('#txtCG').text(IndicatorName);

            $scope.setCentralTendancy($scope.label, $scope.ds);
            $scope.loadChart($scope.n, $scope.ds);
        }
        else {
            $('#map').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
            $('#chartSection').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");
        }
    }
    $scope.setChartLimit = function () {
        var barCount = 0;
        var tempds = JSON.parse(JSON.stringify($scope.ds));
        //var tempds = $scope.ds;
        for (var i = 0; i < $scope.ds.length; i++) {
            if ($scope.ds[i] > $scope.lowerLimit) {
                barCount = barCount + 1;
            }
            else {
                tempds[i] = $scope.lowerLimit;
            }
        }
        $scope.noOfDist = barCount;
        $scope.loadChart($scope.n, tempds);
    }
    $scope.SortByRank = function (a, b) {
        var aName = parseInt(a.rank);
        var bName = parseInt(b.rank);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByVal = function (a, b) {
        var aName = parseFloat(a.values);
        var bName = parseFloat(b.values);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByRankDesc = function (a, b) {
        var aName = parseInt(b.rank);
        var bName = parseInt(a.rank);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByName = function (a, b) {
        var aName = a.name;
        var bName = b.name;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.setMap = function () {
        $scope.aData.sort($scope.SortByName);
        var width = 358,
    height = 580,
    centered;
        d3.select("#mapsvg").remove();
        var feature = "";
        var projection = d3.geo.mercator().scale(4780)
             .center([82.3224595, 20.97702712140104])
            .translate([width / 2, height / 2]);
        var path = d3.geo.path().projection(projection);
        
        d3.json($scope.mapUrl, function (data) {
            // ==============for automatic scale start==============
            //var center = d3.geo.centroid(data)
            //var scale = 4280;
            //      var bounds = path.bounds(data);
            //      var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
            //      var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
            //      var scale = (hscale < vscale) ? hscale : vscale;
            //      var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
            //                        height - (bounds[0][1] + bounds[1][1]) / 2];

            //      projection = d3.geo.mercator().center(center)
            //.scale(scale).translate(offset);
            //      path = path.projection(projection);

            //================ for automatic scale end===================
            var canvas = d3.select("body").select("#map").append("svg").attr("id", "mapsvg")

    .attr("width", 350).attr("height", 570);
            var group = canvas.selectAll("g")
            .data(data.features)
            .enter()
            .append("g")
        .on("click", clicked);
            //var projection = d3.geo.mercator().scale(4550).translate([-6370, 1980]);
            //var projection = d3.geo.mercator();
            //var path = d3.geo.path().projection(projection);
            var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
            var area = group.append("path")
            .attr("d", path)
           .style("fill", function (d, i) { return $scope.aData[i].color; })
            .style("stroke", "white")
               // .style("stroke:hover", "black")

    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout).style("stroke-width", 1);
            group.append("text").attr("class", "maptxt")
                 //.attr("fill", function (d, i) { return aData[i].color; })
            .attr("x", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[0]) / 1.1; }
                else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
                else if ($scope.aData[i].name.toUpperCase() == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.07; }
                else if ($scope.aData[i].name.toUpperCase() == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && $scope.mapUrl == 'map/cg18.json') { return (path.centroid(d)[0]) / 1; }
                else {
                    return path.centroid(d)[0];
                }

            })
            .attr("y", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[1]) / 1.2; }
                else {
                    return path.centroid(d)[1];
                }
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) { return $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
              .attr("font-size", 11.5)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            group.append("text").attr("class", "mapvals")
                //.attr("fill", function (d, i) { return aData[i].color; })
           .attr("x", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR')
               { return (path.centroid(d)[0]) / 1.07; }
               else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
               else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[0]) / 1; }
               else {
                   return path.centroid(d)[0];
               }
           })
           .attr("y", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')
                   ) { return (path.centroid(d)[1]) / 1.2; }
               else {
                   return path.centroid(d)[1];
               }
           })
           .attr("text-anchor", "middle")
                 .html(function (d, i) {
                     if ($scope.aData[i].values == -1)
                         return '';
                     else
                        return $scope.aData[i].values.toFixed($scope.tofix);
                 })
                .attr("transform", "translate(0,10)")
            .attr("font-size", 10)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            function mouseover(d, i) {
                //d3.select("body").style("stroke-width", '4px')
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .8);
                $('#cgData').html($scope.aData[i].values.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#distName').text($scope.aData[i].name);
            }
            function mousemove(d, i) {
                tooltip.html("District: " + $scope.aData[i].name + "<br/> Rank: " + $scope.aData[i].rank + "<br/>" + $scope.aData[i].values.toFixed($scope.tofix))
                  .style("left", (d3.event.pageX - 35) + "px")
                  .style("top", (d3.event.pageY - 110) + "px");
            }
            function mouseout() {
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);

                $('#cgData').html($scope.cgData.values.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#distName').text($scope.cgData.name);
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
    $scope.loadChart = function (n, ds) {
        //document.getElementById('chartSection').innerHTML = ' <canvas id="barChart" height="135px"> </canvas>';
        $('#chartSection').html(' <canvas id="barChart" height="135px" style="width:100%;"> </canvas>');
        //Chart.defaults.global.animation.duration = chartAnimation;
        //Chart.defaults.global.defaultFontColor = chartFontColor;
        var ctx = document.getElementById("barChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: n,
                datasets: [{
                    label: IndicatorName,
                    data: ds,
                    scaleFontColor: "#ff0000",
                    backgroundColor: '#26B99A'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            min: $scope.lowerLimit,
                           
                            //backgroundColor: 'rgba(255,255,255,.2)',
                            fontColor: '#000'
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: '10',
                            categorySpacing: '20',
                            fontColor: '#000'

                        },
                        barPercentage: 0.3,
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
    };
    $scope.setCentralTendancy = function (label, data) {
        //mean
        var distMean = 0;
        for (i = 0; i < data.length; i++) {
            distMean = distMean + data[i];
        }
        distMean = distMean / data.length;
        $scope.meanValue = distMean.toFixed($scope.tofix);
        $scope.nearMean = label[$scope.getClosest(distMean, data)];
        // median
        var medianValue = 0;
        var middle = Math.floor(data.length / 2);
        if (data.length % 2 == 1) {
            $scope.medianValue = data[middle].toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $scope.nearMedian = label[middle];
        } else {
            medianValue = (data[middle - 1] + data[middle]) / 2.0;
            $scope.medianValue = medianValue.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $scope.nearMedian = label[middle - 1] + ' and \n ' + label[middle];
        }
        //Range
        $scope.range = data[data.length - 1].toFixed($scope.tofix) + '-' + data[0].toFixed($scope.tofix);
        // Variance
        //var total = 0;
        //for (i = 0; i < data.length; i++) {
        //total = total + Math.pow((data[i] - distMean), 2);
        //}
        //var variance = total / data.length;
        //$scope.variance = variance.toFixed(2);
        // Standard Deviation
        //$scope.standardDeviation = Math.sqrt(variance).toFixed(2);
    }
    $scope.getClosest = function (number, array) {
        var current = 0;
        var difference = Math.abs(number - current);
        var index = array.length;
        while (index--) {
            var newDifference = Math.abs(number - array[index]);
            if (newDifference < difference) {
                difference = newDifference;
                current = index;
            }
        }
        return current;
    };
    $scope.setLegend = function () {
        var firstMid = 0, secondMid = 0, dataLength = 0;
        $.each($scope.ds, function (i, value) {
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
        if ($scope.natureId == 2) // sort for negative indicator
        { $scope.ds.sort(function (a, b) { return b - a }); }
        $('#txthigh2').val(($scope.ds[firstMid] + $scope.mins).toFixed($scope.tofix)); $('#txthigh1').val($scope.ds[0].toFixed($scope.tofix));
        $('#txtmid2').val(($scope.ds[secondMid] + $scope.mins).toFixed($scope.tofix)); $('#txtmid1').val($scope.ds[firstMid].toFixed($scope.tofix));
        $('#txtlow2').val($scope.ds[dataLength - 1].toFixed($scope.tofix)); $('#txtlow1').val($scope.ds[secondMid].toFixed($scope.tofix));
        if ($scope.natureId == 2) // reverse for negative indicator
        { $scope.ds.sort(function (a, b) { return a - b }); }
        $scope.setCustomLegend();

    }
    $scope.setCustomLegend = function () {
        var highDistrict = '', midDistrict = '', lowDistrict = '';
        var txtmid1 = parseFloat($('#txtmid1').val());
        var txtmid2 = parseFloat($('#txtmid2').val());
        var txtlow1 = parseFloat($('#txtlow1').val());
        var txtlow2 = parseFloat($('#txtlow2').val());
        var txthigh1 = parseFloat($('#txthigh1').val());
        var txthigh2 = parseFloat($('#txthigh2').val());
        var tmpVal;
        var highTotal = 0, midTotal = 0, lowTotal = 0;
        if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {

            $scope.aData.sort($scope.SortByRank);
            if ($scope.natureId == 2) {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if (tmpVal >= txtlow2 && tmpVal <= txtlow1) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                        highDistrict = highDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        highTotal = highTotal + 1;
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                        midDistrict = midDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        midTotal = midTotal + 1;
                    }
                    if (tmpVal >= txthigh2 && tmpVal <= txthigh1) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                        lowDistrict = lowDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        lowTotal = lowTotal + 1;
                    }
                }
            }
            else {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if (tmpVal >= txtlow2 && tmpVal <= txtlow1) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                        lowDistrict = lowDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        lowTotal = lowTotal + 1;
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                        midDistrict = midDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        midTotal = midTotal + 1;
                    }
                    if (tmpVal >= txthigh2 && tmpVal <= txthigh1) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                        highDistrict = highDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        highTotal = highTotal + 1;
                    }
                }
            }

            //--- set indicator lable
            $('.high2').text($('#txthigh2').val()); $('.high1').text($('#txthigh1').val());
            $('.mid2').text($('#txtmid2').val()); $('.mid1').text($('#txtmid1').val());
            $('.low2').text($('#txtlow2').val()); $('.low1').text($('#txtlow1').val());

            $('#highDist').text(highDistrict);
            $('#midDist').text(midDistrict);
            $('#lowDist').text(lowDistrict);

            $('#highTotal').text(highTotal);
            $('#midTotal').text(midTotal);
            $('#lowTotal').text(lowTotal);
            $scope.aData.sort($scope.SortByName);
            $scope.setMap();

        }
        else {
            alert('invalid value');
        }
    }
    // set unit count
    $scope.getCount = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/GetCount'
        }).then(function mySucces(response) {
            $scope.unitCount = response.data;
        }, function myError(response) {
            alert("Error count");
        });
    }
    $scope.getCount();
    $scope.pdfDownload = function () {
        $scope.pdfLoader = 'fa-spinner fa-spin';
        var element = $("#map"); // global variablebarChart
        var element2 = $("#chartSection"); // global variablebarChart
        var getCanvas; // global variable

        $("#map").css("color", "rgba(0,0,250,0)");
        $("#map").css('background-color', 'white');
        $("#barChart").css('background-color', 'rgb(255,255,255)');

        //$(".hidepane").hide();
        var doc = new jsPDF('landscape');
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        html2canvas(element, {
            onrendered: function (canvas) {
                getCanvas = canvas;

                var imgData = getCanvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 10, 50, width - 200, height - 86);//295, 200 
                $("#map").removeAttr("style");

                // Draw Legends Square
                doc.setDrawColor(0);
                doc.setFillColor(0, 102, 0);
                doc.rect(60, 140, 5, 5, 'FD'); // filled green square                     
                doc.setFillColor(255, 204, 0);
                doc.rect(60, 148, 5, 5, 'FD'); // filled yellow square                   
                doc.setFillColor(255, 0, 0);
                doc.rect(60, 156, 5, 5, 'FD'); // filled red square 
                doc.setFillColor(152, 159, 165);
                doc.rect(60, 164, 5, 5, 'FD'); // filled grey square 
                //Legends Value(Range)
                doc.text(70, 145, document.getElementById('high2').innerText + ' - ' + document.getElementById('high1').innerText);
                doc.text(70, 153, document.getElementById('mid2').innerText + ' - ' + document.getElementById('mid1').innerText);
                doc.text(70, 161, document.getElementById('low2').innerText + ' - ' + document.getElementById('low1').innerText);
                doc.text(70, 169, 'Not Available');
            }
        });
        html2canvas(element2, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgDataChart = getCanvas.toDataURL("image/jpeg", 1.0);
                doc.addImage(imgDataChart, 'JPEG', 90, 45, 200, 90);
                //$("#barChart").removeAttr("style");
                //chartAnimation = 1000;
                //chartFontColor = '#fff';
                //chartColor = '#fff';
                //loadChart(n,ds)
                doc.addPage();
                var columns = ["Sno", "District", $("#ddlIndicator option:selected").text() + ' [' + $("#ddlYear option:selected").text() + ']'];
                var tempRow = [];
                for (var i = 0; i < $scope.label.length; i++) {
                    tempRow[i] = [i + 1, $scope.label[i], $scope.ds[i]]
                }
                doc.autoTable(columns, tempRow);

                doc.save("CG Dasboard.pdf");
                //$("#wait").css("display", "none");
                //$("#map").removeAttr("style");
                $scope.pdfLoader = 'fa-file-pdf-o';
                $scope.$apply();
            }
        });
        //Chart
        doc.setFontSize(15);

        //SectorIndicator
        doc.text(100, 40, document.getElementById('txtCG').innerText + ' (' + document.getElementById('txtUnit').innerText + ')');
        //doc.text(100, 40, $("#ddlSector option:selected").text() + ' : ');
        //doc.text(130, 40, $("#ddlIndicator option:selected").text() + ' ( ' + $("#ddlYear option:selected").text() + ' ) ');


        //Upper Block Values
        doc.text(15, 30, document.getElementById('DivisionValue').innerText);
        doc.text(55, 30, document.getElementById('DisValue').innerText);
        doc.text(95, 30, document.getElementById('TehValue').innerText);
        doc.text(145, 30, document.getElementById('BlkValue').innerText);
        doc.text(190, 30, document.getElementById('GpValue').innerText);
        doc.text(width - 45, 30, document.getElementById('VilValue').innerText);

        // Mean Median Values
        doc.text(110, 160, document.getElementById('cgData').innerText); // cG data
        doc.text(161, 160, document.getElementById('nearMean').innerText); // mean data
        doc.text(211, 160, document.getElementById('nearMedian').innerText);

        $("#population").removeClass('popCounter');
        doc.text(10, 192, document.getElementById('population').innerText);  //population clock
        $("#population").addClass('popCounter');

        // Font Size Small, Colour Black
        doc.setFontSize(10);

        //Rank Dist
        var splitTitle = doc.splitTextToSize(document.getElementById('highDist').innerText, 75);
        var splitTitle1 = doc.splitTextToSize(document.getElementById('midDist').innerText, 75);
        var splitTitle2 = doc.splitTextToSize(document.getElementById('lowDist').innerText, 75);
        doc.text(55, 187, splitTitle);
        doc.text(135, 187, splitTitle1);
        doc.text(215, 187, splitTitle2);

        // Mean Median Values
        doc.text(250, 155, document.getElementById('meanLower').innerText);
        doc.text(250, 163, document.getElementById('medianLower').innerText);
        doc.text(250, 170, document.getElementById('rangeText').innerText);
        //doc.text(251, 170, document.getElementById('range').innerText);//document.getElementById('').innerText + ' : ' +
        doc.text(10, 10, document.getElementById('txtHeading').innerText);

        //DateTime Display
        var newDate = new Date();
        $("#chartText").html(newDate);
        doc.text(190, 10, document.getElementById('chartText').innerText);
        $("#chartText").text('  ');

        // Font Size Small, Colour Red
        doc.setTextColor(0, 0, 165);

        // Horizontal line 
        doc.setLineWidth(0.2);
        doc.line(10, 12, width - 10, 12); //Top horizontal line  
        doc.line(10, 32, width - 10, 32); // Mid horizontal line  
        doc.line(10, 140, width - 10, 140); // legends start line
        doc.line(10, 175, width - 10, 175);  // bottom line

        //Upper Block Text
        doc.setTextColor(0, 0, 165);
        doc.text(10, 20, document.getElementById('DivisionText').innerText + ":");
        doc.text(50, 20, document.getElementById('DisText').innerText + ":");
        doc.text(90, 20, document.getElementById('TehText').innerText + ":");
        doc.text(140, 20, document.getElementById('BlkText').innerText + ":");
        doc.text(185, 20, document.getElementById('GpText').innerText + ":");
        doc.text(width - 50, 20, document.getElementById('VilText').innerText + ":");

        //Source Above Map
        doc.text(10, 47, document.getElementById('txtSource').innerText);




        // Chhattisgarh data
        doc.text(110, 147, document.getElementById('distName').innerText);
        doc.text(110, 170, document.getElementById('txtCG').innerText + ' (' + document.getElementById('txtUnit').innerText + ')');

        //Nearest Mean
        doc.text(160, 147, document.getElementById('nearMeanTxt').innerText);
        doc.text(160, 170, document.getElementById('meanLower').innerText);

        //Nearest Median    
        doc.text(210, 147, document.getElementById('nearMedianTxt').innerText);
        doc.text(210, 170, document.getElementById('medianLower').innerText);
        //Nearest Median    
        doc.text(250, 147, document.getElementById('ctText').innerText);

        //Population Clock
        doc.text(10, 181, document.getElementById('PopClock').innerText);
        doc.text(10, 202, document.getElementById('PopState').innerText);

        //Rank
        doc.text(55, 181, document.getElementById('highText').innerText);
        doc.text(135, 181, document.getElementById('midText').innerText);
        doc.text(215, 181, document.getElementById('lowText').innerText);
        doc.text(55, 202, 'Total : ' + document.getElementById('highTotal').innerText);
        doc.text(135, 202, 'Total : ' + document.getElementById('midTotal').innerText);
        doc.text(215, 202, 'Total : ' + document.getElementById('lowTotal').innerText);

        // Font Size Small, Colour Red
        doc.setTextColor(0, 0, 0);

        doc.text(25, 47, document.getElementById('src').innerText);

        var download = document.getElementById('download');
        //doc.save("DesCgDasboard.pdf");

        //$(".hidepane").show();
    }
    // pdf for publication
    $scope.pdf = function () {
        $scope.pdfBook = 'fa-spinner fa-spin';
        var element = $("#map"); // global variablebarChart
        var element2 = $("#chartSection"); // global variablebarChart
        var getCanvas; // global variable

        $("#map").css("color", "rgba(0,0,250,0)");
        $("#map").css('background-color', 'white');
        $("#barChart").css('background-color', 'rgb(255,255,255)');

        //$(".hidepane").hide();
        var doc = new jsPDF('landscape');
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        html2canvas(element, {
            onrendered: function (canvas) {
                getCanvas = canvas;

                var imgData = getCanvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 8, 33, width - 200, height - 70);//295, 200 
                $("#map").removeAttr("style");

                // Draw Legends Square
                doc.setDrawColor(0);
                doc.setFillColor(0, 102, 0);
                doc.rect(60, 158, 5, 5, 'FD'); // filled green square                     
                doc.setFillColor(255, 204, 0);
                doc.rect(60, 166, 5, 5, 'FD'); // filled yellow square                   
                doc.setFillColor(255, 0, 0);
                doc.rect(60, 174, 5, 5, 'FD'); // filled red square 
                
                //Legends Value(Range)
                doc.text(70, 162, document.getElementById('high2').innerText + ' - ' + document.getElementById('high1').innerText);
                doc.text(70, 170, document.getElementById('mid2').innerText + ' - ' + document.getElementById('mid1').innerText);
                doc.text(70, 178, document.getElementById('low2').innerText + ' - ' + document.getElementById('low1').innerText);
                
            }
        });
        html2canvas(element2, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgDataChart = getCanvas.toDataURL("image/jpeg", 1.0);
                doc.addImage(imgDataChart, 'JPEG', 90, 35, 200, 120);
                //$("#barChart").removeAttr("style");
                //chartAnimation = 1000;
                //chartFontColor = '#fff';
                //chartColor = '#fff';
                //loadChart(n,ds)
                

                doc.save("CG Dasboard.pdf");
                //$("#wait").css("display", "none");
                //$("#map").removeAttr("style");
                $scope.pdfBook = 'fa-book';
                $scope.$apply();
            }
        });
        //Chart
        doc.setFontSize(12);

        //SectorIndicator
        doc.text(100, 30, document.getElementById('txtCG').innerText + ' (' + document.getElementById('txtUnit').innerText + ')');
        //doc.text(100, 40, $("#ddlSector option:selected").text() + ' : ');
        //doc.text(130, 40, $("#ddlIndicator option:selected").text() + ' ( ' + $("#ddlYear option:selected").text() + ' ) ');


       

       

        // Font Size Small, Colour Black
        doc.setFontSize(15);



       
        doc.text(80, 15, document.getElementById('txtHeading').innerText);

        // Font Size Small, Colour Red
        doc.setTextColor(0, 0, 165);

        // Horizontal line 
        doc.setLineWidth(0.2);
        doc.line(10, 22, width - 10, 22); // Mid horizontal line  
        

      

        //Source Above Map
        doc.setFontSize(10);
        doc.text(10, 30, document.getElementById('txtSource').innerText);
       
        doc.text(60, 30, "Year:");


      

        // Font Size Small, Colour black
        doc.setTextColor(0, 0, 0);

        doc.text(25, 30, document.getElementById('src').innerText);

        // year above map
        doc.text(70, 30, $("#ddlYear option:selected").text());

        var download = document.getElementById('download');
        //doc.save("DesCgDasboard.pdf");

        //$(".hidepane").show();
    }
    $scope.csvDownload = function () {
        var CSV = '';
        //Set Report title in first row or line
        CSV += 'Sector,' + $("#ddlSector option:selected").text() +',' + 'Indicator,' + $("#ddlIndicator option:selected").text();
        CSV += '\r\n';
        CSV += 'Year,' + $("#ddlYear option:selected").text() +',' + 'Source,' + $("#ddlSource option:selected").text();
        CSV += '\r\n\n';
        var ShowLabel = true;
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            //for (var index in $scope.aData[0]) {

            //    //Now convert each value to string and comma-seprated
            //    row += index + ',';
            //}

            //row = row.slice(0, -1);
            row += 'District,' + $("#ddlIndicator option:selected").text() + ',Rank';
            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < $scope.aData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            //for (var index in $scope.aData[i]) {
            row += '"' + $scope.aData[i].name + '",';
            row += '"' + $scope.aData[i].values + '",';
            row += '"' + $scope.aData[i].rank+ '"';
            //}

            //row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }
        // Add chhattisgarh data
        var row = "";
        row += '"' + $scope.cgData.name + '",';
        row += '"' + $scope.cgData.values + '",';
        row += '" "';

        //add a line break after each row
        CSV += row + '\r\n';

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "DES";
        //this will remove the blank-spaces from the title and replace it with an underscore
        //fileName += ReportTitle.replace(/ /g, "_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // uplaod data start
    var X = XLSX;
    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }
    function to_json(workbook) {
        var result = {};
        var s = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
            s = Object.keys(workbook.Sheets);
        });
        $("#ddlIndicatorExcel").empty();
        $("#ddlYearExcel").empty();
        $("#ddlIndicator").hide();
        $("#ddlYear").hide();
        //$("#ddlSector").hide();
        $("#ddlIndicatorExcel").show();
        $("#ddlYearExcel").show();
        //$scope.showIndicatorDdl = false;
        //$scope.showXlsIndicatorDdl = true;
        //$scope.showYearDdl = false;
        //$scope.showXlsYearDdl = true;
        var k = Object.keys(result[s[0]][0]);
       

        $.each(k, function (key, value) {
            if (key > 1)
                $("#ddlIndicatorExcel").append($("<option></option>").val(value).html(value));
        });
        $.each(s, function (key, value) {
            $("#ddlYearExcel").append($("<option></option>").val(value).html(value));
        });
        return result;
    }
    function process_wb(wb) {
        var output = JSON.stringify(to_json(wb), 2, 2);
        excelOutput = output;
        output = $.parseJSON(output);
        excelOutput = $.parseJSON(excelOutput);
        yearName = $("#ddlYearExcel").val();
        columnName = $("#ddlIndicatorExcel").val();
        IndicatorName = $('#ddlIndicatorExcel option:selected').text();

        var ad = [];
        //var ad = Object.keys(output).map(function (e) { return output[e][columnName]; });
        var noOfDist = output[yearName].length-5;
        var sector = output[yearName][noOfDist + 1]['Name'];
        var source = output[yearName][noOfDist + 2]['Name'];
        var unit = output[yearName][noOfDist + 3];
        var nature = output[yearName][noOfDist + 4];
        $("#ddlSector").empty();
        $("#ddlSector").append($("<option></option>").val(sector).html(sector));
        $("#ddlSource").empty();
        $("#ddlSource").append($("<option></option>").val(source).html(source));
        $("#src").text(source);
        // set -1 in place of null
        for (var k = 0; k < noOfDist; k++) {
            if (output[yearName][k][columnName] == null)
                output[yearName][k][columnName] = -1;
        }
        // set data for 27 district
        for (var k = 0; k < noOfDist; k++) {
            ad.push({
                id: output[yearName][k]['Id'],
                rank: 0,
                name: output[yearName][k]['Name'],
                values: parseFloat(output[yearName][k][columnName]),
                color: 'silver',
                unit: unit[columnName]
            });
        }
        var tempData = JSON.parse(JSON.stringify(ad));
        var sortData = tempData.sort($scope.SortByVal);
        for (var rank = 0; rank < noOfDist; rank++) {
            sortData[rank].rank = noOfDist - rank;
        }
        var nd = tempData.sort($scope.SortByName);
        //set nature start
        var natureId = 1; // for positive indicator
        if (nature[columnName] == 'Negative' || nature[columnName] == 'negative' || nature[columnName] == 'NEGATIVE')
            natureId = 2;
        // set nature end
        //set map
        $scope.mapName = 'cg' + nd.length + '.json';
        // set data for chhattisgarh
        var cd = {
            id: output[yearName][noOfDist]['Id'],
            rank: 28,
            name: output[yearName][noOfDist]['Name'],
            values: parseFloat(output[yearName][noOfDist][columnName]),
            color: '#000',
            mapUrl: $scope.mapName,
            unit: unit[columnName],
            natureId: natureId
        };
        //var unit = output[yearName][30];
        var ac = [cd, nd];
        //uploadData.push(sector);
        //uploadData.push(source);
        //uploadData.push(unit);
        //uploadData.push(cd);
        //uploadData.push(nd);
        // set map URL
        //if ($scope.ds.length==)
        //$scope.cgData.mapUrl = 'cg27.json';
        $scope.setDashboard(ac);
        $scope.setChartLimit();
        //if (out.innerText === undefined) out.textContent = output;
        //else out.innerText = output;
        //if (typeof console !== 'undefined') console.log("output", new Date());
    }
    var drop = document.getElementById('drop');
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var f = files[0];
        {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var wb;
                var arr = fixdata(data);
                wb = X.read(btoa(arr), { type: 'base64' });
                process_wb(wb);
            };
            reader.readAsArrayBuffer(f);
        }
    }
    function handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    if (drop.addEventListener) {
        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
    }
    var xlf = document.getElementById('xlf');
    //var xlf = $('#xlf');
    function handleFile(e) {
        var files = e.target.files;
        var f = files[0];
        {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var wb;
                var arr = fixdata(data);
                wb = X.read(btoa(arr), { type: 'base64' });
                process_wb(wb);
            };
            reader.readAsArrayBuffer(f);
        }
    }
     $scope.getAllDataExcel = function () {
        yearName = $("#ddlYearExcel").val();
        columnName = $("#ddlIndicatorExcel").val();
        IndicatorName = $('#ddlIndicatorExcel option:selected').text();
        var ad = [];
        var noOfDist = excelOutput[yearName].length - 5;
        var sector = excelOutput[yearName][noOfDist + 1]['Name'];
        var source = excelOutput[yearName][noOfDist + 2]['Name'];
        var unit = excelOutput[yearName][noOfDist + 3];
        var nature = excelOutput[yearName][noOfDist + 4];
        $("#ddlSector").empty();
        $("#ddlSector").append($("<option></option>").val(sector).html(sector));
        $("#src").text(source);
         // set -1 in place of null
        for (var k = 0; k < noOfDist; k++) {
            if (excelOutput[yearName][k][columnName] == null)
                excelOutput[yearName][k][columnName] = -1;
        }
        for (var k = 0; k < noOfDist; k++) {
            ad.push({
                id: excelOutput[yearName][k]['Id'],
                rank: 0,
                name: excelOutput[yearName][k]['Name'],
                values: parseFloat(excelOutput[yearName][k][columnName]),
                color: 'silver',
                unit: unit[columnName]
            });
        }
        var tempData = JSON.parse(JSON.stringify(ad));
        var sortData = tempData.sort($scope.SortByVal);
        for (var rank = 0; rank < noOfDist; rank++) {
            sortData[rank].rank = noOfDist - rank;
        }
        var nd = tempData.sort($scope.SortByName);
         //set nature start
        var natureId = 1; // for positive indicator
        if (nature[columnName] == 'Negative' || nature[columnName] == 'negative' || nature[columnName] == 'NEGATIVE')
            natureId = 2;
         // set nature end
        var cd = {
            id: excelOutput[yearName][noOfDist]['Id'],
            rank: 28,
            name: excelOutput[yearName][noOfDist]['Name'],
            values: parseFloat(excelOutput[yearName][noOfDist][columnName]),
            color: '#000',
            mapUrl: $scope.mapName,
            unit: unit[columnName],
            natureId: natureId
        };
        var ac = [cd, nd];
        $scope.setDashboard(ac);
        $scope.setChartLimit();
    }
    if (xlf) xlf.addEventListener('change', handleFile, false);
    // upload data end
}]);
app.controller('custumIndicatorCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.setSectorNum = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSector'
        }).then(function mySucces(response) {
            $scope.sectorsNum = response.data;

            $scope.ddlSectorNum = $scope.sectorsNum[0];
            //$scope.setIndicatorsNum();
        }, function myError(response) {
            alert("Error indicator num");
        });
    }
    $scope.setIndicatorsNum = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getIndicator',
            params: { sectorId: $scope.ddlSectorNum }
        }).then(function mySucces(response) {
            $scope.indicatorsNum = response.data;

            $scope.ddlIndicatorNum = $scope.indicatorsNum[0];
            $scope.setYearDdlNum();
        }, function myError(response) {
            alert("Error indicator num");
        });
    }
    $scope.setYearDdlNum = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getYear',
            params: { sectorId: $scope.ddlSectorNum, indicatorId: $scope.ddlIndicatorNum.id }
        }).then(function mySucces(response) {
            $scope.yearsNum = response.data;
            $scope.ddlYearNum = $scope.yearsNum[0];
            $scope.setSourceDdlNum();
        }, function myError(response) {
            alert("Error year");
        });
    }
    $scope.setSourceDdlNum = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSources',
            params: { sectorId: $scope.ddlSectorNum, indicatorId: $scope.ddlIndicatorNum.id, yearId: $scope.ddlYearNum.year }
        }).then(function mySucces(response) {
            $scope.sourcesNum = response.data;
            $scope.ddlSourceNum = $scope.sourcesNum[0];
            $scope.setMapDdlNum();
        }, function myError(response) {
            alert("Error source");
        });
    }
    $scope.setMapDdlNum = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getMapName',
            params: { sectorId: $scope.ddlSectorNum, indicatorId: $scope.ddlIndicatorNum.id, yearId: $scope.ddlYearNum.year, sourceId: $scope.ddlSourceNum.id }
        }).then(function mySucces(response) {
            $scope.mapsNum = response.data;
            $scope.ddlMapNum = $scope.mapsNum[0];
            //$scope.getAllDataNum();
        }, function myError(response) {
            alert("Error map");
        });
    }
    //denominator
    $scope.setIndicatorsDen = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getIndicator',
            params: { sectorId: $scope.ddlSectorDen }
        }).then(function mySucces(response) {
            $scope.indicatorsDen = response.data;

            $scope.ddlIndicatorDen = $scope.indicatorsDen[0];
            $scope.setYearDdlDen();
        }, function myError(response) {
            alert("Error indicator num");
        });
    }
    $scope.setYearDdlDen = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getYear',
            params: { sectorId: $scope.ddlSectorDen, indicatorId: $scope.ddlIndicatorDen.id }
        }).then(function mySucces(response) {
            $scope.yearsDen = response.data;
            $scope.ddlYearDen = $scope.yearsDen[0];
            $scope.setSourceDdlDen();
        }, function myError(response) {
            alert("Error year");
        });
    }
    $scope.setSourceDdlDen = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSources',
            params: { sectorId: $scope.ddlSectorDen, indicatorId: $scope.ddlIndicatorDen.id, yearId: $scope.ddlYearDen.year }
        }).then(function mySucces(response) {
            $scope.sourcesDen = response.data;
            $scope.ddlSourceDen = $scope.sourcesDen[0];
            $scope.setMapDdlDen();
        }, function myError(response) {
            alert("Error source");
        });
    }
    $scope.setMapDdlDen = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getMapName',
            params: { sectorId: $scope.ddlSectorDen, indicatorId: $scope.ddlIndicatorDen.id, yearId: $scope.ddlYearDen.year, sourceId: $scope.ddlSourceDen.id }
        }).then(function mySucces(response) {
            $scope.mapsDen = response.data;
            $scope.ddlMapDen = $scope.mapsDen[0];
            //$scope.getAllDataNum();
        }, function myError(response) {
            alert("Error map");
        });
    }
    // click
    $scope.getCustomData = function () {
        $scope.customData = {
            sectorIdNum: $scope.ddlSectorNum,
            sectorIdDen: $scope.ddlSectorDen,
            indicatorIdNum: $scope.ddlIndicatorNum.id,
            indicatorIdDen: $scope.ddlIndicatorDen.id,
            yearIdNum: $scope.ddlYearNum.year,
            yearIdDen: $scope.ddlYearDen.year,
            sourceIdNum: $scope.ddlSourceNum.id,
            sourceIdDen: $scope.ddlSourceDen.id,
            mapIdNum: $scope.ddlMapNum.id,
            mapIdDen: $scope.ddlMapDen.id,
            multiplier: $scope.multiplier,
            operat: $scope.operator
        }
        $http({
            method: "POST",
            url: baseUrl + "api/dashboard/getCustomIndicator",
            data: $scope.customData,
        }).then(function mySucces(response) {
            IndicatorName = $scope.indicatorName;
            $scope.setDashboard(response.data);
        }, function myError(response) {
            alert("Error dashboard");
        });
    }
}]);
app.controller('comparisonCtrl', ['$scope', '$http', function ($scope, $http) {
    //$scope.ddlSector = 1;
    $scope.stp = 1;
    $scope.pdfLoader = 'fa-file-pdf-o';
    $scope.areaLevel = 2; // for chhattisgarh
    $scope.setSectors = function () {
        NProgress.start();
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSector'
        }).then(function mySucces(response) {
            $scope.sectors = response.data;
            $scope.ddlSector = $scope.sectors[0];
            $scope.setIndicators();
        }, function myError(response) {
            alert("Error indicator");
        });
    }
    $scope.setIndicators = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getIndicator',
            params: { sectorId: $scope.ddlSector.id }
        }).then(function mySucces(response) {
            $scope.indicators = response.data;
            $scope.ddlIndicator = $scope.indicators[0];
            
            $scope.setYearDdl();
        }, function myError(response) {
            alert("Error indicator");
        });
    }
    $scope.setYearDdl = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getYear',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id }
        }).then(function mySucces(response) {
            $scope.years = response.data;
            $scope.ddlYear = $scope.years[0];
            $scope.setSourceDdl();
        }, function myError(response) {
            alert("Error year");
        });
    }
    $scope.setSourceDdl = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getSources',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year }
        }).then(function mySucces(response) {
            $scope.sources = response.data;
            $scope.ddlSource = $scope.sources[0];
            $scope.setMapDdl();
        }, function myError(response) {
            alert("Error source");
        });
    }
    $scope.setMapDdl = function () {
        $http({
            method: "GET",
            url: baseUrl + 'api/dashboard/getMapName',
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year, sourceId: $scope.ddlSource.id }
        }).then(function mySucces(response) {
            $scope.maps = response.data;
            $scope.ddlMap = $scope.maps[0];
            $scope.getAllData();
        }, function myError(response) {
            alert("Error map");
        });
    }
    $scope.getAllData = function () {
        lowerLimit = parseInt($('#lowerLimit').val());
        var col = $('#ddlIndicator').val();
        IndicatorName = $('#ddlIndicator option:selected').text();
        $http({
            method: "GET",
            url: baseUrl + "api/dashboard/getAllData",
            params: { sectorId: $scope.ddlSector.id, indicatorId: $scope.ddlIndicator.id, yearId: $scope.ddlYear.year, sourceId: $scope.ddlSource.id, mapId: $scope.ddlMap.id, areaLevel: $scope.areaLevel },
        }).then(function mySucces(response) {
            $scope.setDashboard2(response.data);

        }, function myError(response) {
            alert("Error dashboard");
        });
    }
    $scope.setSectors();
    $scope.SortByRank = function (a, b) {
        var aName = parseInt(a.rank);
        var bName = parseInt(b.rank);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByName = function (a, b) {
        var aName = a.name;
        var bName = b.name;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.setDashboard = function (allData) {
        $scope.cgData = allData[0];
        $scope.aData = allData[1];
        // for chart only
        $scope.barData = Object.keys($scope.aData).map(function (e) { return $scope.aData[e].values; });
        $scope.barLable = Object.keys($scope.aData).map(function (e) { return $scope.aData[e].name; });
        //hide tooltip every filter
        $('.tooltip').hide();
        //set all variables
        $scope.mapUrl = 'map/' + $scope.cgData.mapUrl;
        $scope.noOfDist = $scope.aData.length;
        $scope.natureId = $scope.cgData.natureId;
        $scope.firstDataIndi = $('#ddlIndicator option:selected').text();
        //$scope.sourcesName = $scope.aData.sourceName;
        var tempData = JSON.parse(JSON.stringify($scope.aData));
        var sortData = tempData.sort($scope.SortByRank);
        $scope.n = Object.keys(sortData).map(function (e) { return sortData[e].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); });
        $scope.ds = Object.keys(sortData).map(function (e) { return sortData[e].values; });
        $scope.higherLimit = $scope.ds[0];
        // set step for legend
        if ($scope.cgData.unit == 'Percent' || $scope.cgData.unit == 'Ratio' || $scope.cgData.unit == 'Rate') {
            $scope.mins = 0.01;
            $scope.tofix = 2;
            $scope.stp = 0.01;
        }
        else {
            $scope.mins = 1;
            $scope.tofix = 0;
            $scope.stp = 1;
        }
        if ($scope.aData.length != 0) {
            $('#map').text('');
            $scope.setLegend();
            $scope.setMap();
            $scope.loadHbarChart();
            $scope.loadChart2();
            //$scope.loadDoughnut();
            if ($scope.cgData.values == 'NA')
                $('#legendsection').hide();
            else
                $('#legendsection').show();
        }
        else {
            $('#map').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
            $('#chartSection').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");
        }
    }
    $scope.setDashboard2 = function (allData) {
        $scope.cgData2 = allData[0];
        $scope.aData2 = allData[1];
        // for chart only
        $scope.barData2 = Object.keys($scope.aData2).map(function (e) { return $scope.aData2[e].values; });
        //hide tooltip every filter
        $('.tooltip').hide();
        //set all variables
        $scope.mapUrl2 = 'map/' + $scope.cgData2.mapUrl;
        $scope.noOfDist = $scope.aData2.length;
        $scope.natureId2 = $scope.cgData2.natureId;
        //$scope.sourcesName = $scope.aData.sourceName;
        var tempData = JSON.parse(JSON.stringify($scope.aData2));
        var sortData = tempData.sort($scope.SortByRank);
        $scope.n = Object.keys(sortData).map(function (e) { return sortData[e].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); });
        $scope.ds = Object.keys(sortData).map(function (e) { return sortData[e].values; });
        $scope.higherLimit = $scope.ds[0];
        // set step for legend
        if ($scope.cgData2.unit == 'Percent' || $scope.cgData2.unit == 'Ratio') {
            $scope.mins = 0.01;
            $scope.tofix = 2;
            $scope.stp = 0.01;
        }
        else {
            $scope.mins = 1;
            $scope.tofix = 0;
            $scope.stp = 1;
        }
        if ($scope.aData2.length != 0) {
            $('#map2').text('');
            $scope.setLegend2();
            $scope.setMap2();

            if ($scope.cgData2.values == 'NA')
                $('#legendsection').hide();
            else
                $('#legendsection').show();
        }
        else {
            $('#map').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
            $('#chartSection').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");
        }

    }
    $scope.setMap = function () {
        $scope.aData.sort($scope.SortByName);
        var width = 358,
    height = 580,
    centered;
        d3.select("#mapsvg").remove();
        var feature = "";
        var projection = d3.geo.mercator().scale(4780)
             .center([82.3224595, 20.97702712140104])
            .translate([width / 2, height / 2]);
        var path = d3.geo.path().projection(projection);
        var canvas = d3.select("body").select("#map").append("svg").attr("id", "mapsvg")

    .attr("width", 350).attr("height", 570);
        d3.json($scope.mapUrl, function (data) {
            var group = canvas.selectAll("g")
            .data(data.features)
            .enter()
            .append("g")
        .on("click", clicked);
            //var projection = d3.geo.mercator().scale(4550).translate([-6370, 1980]);
            //var projection = d3.geo.mercator();
            //var path = d3.geo.path().projection(projection);
            var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
            var area = group.append("path")
            .attr("d", path)
           .style("fill", function (d, i) { return $scope.aData[i].color; })
            .style("stroke", "white")
               // .style("stroke:hover", "black")

    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout).style("stroke-width", 1);
            group.append("text").attr("class", "maptxt")
                 //.attr("fill", function (d, i) { return aData[i].color; })
            .attr("x", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[0]) / 1.1; }
                else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
                else if ($scope.aData[i].name.toUpperCase() == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.08; }
                else if ($scope.aData[i].name.toUpperCase() == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && $scope.mapUrl == 'map/cg18.json') { return (path.centroid(d)[0]) / 1; }
                else {
                    return path.centroid(d)[0];
                }

            })
            .attr("y", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[1]) / 1.2; }
                else {
                    return path.centroid(d)[1];
                }
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) { return $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
              .attr("font-size", 11.5)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            group.append("text").attr("class", "mapvals")
                //.attr("fill", function (d, i) { return aData[i].color; })
           .attr("x", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR')
               { return (path.centroid(d)[0]) / 1.07; }
               else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
               else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[0]) / 1; }
               else {
                   return path.centroid(d)[0];
               }
           })
           .attr("y", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')
                   ) { return (path.centroid(d)[1]) / 1.2; }
               else {
                   return path.centroid(d)[1];
               }
           })
           .attr("text-anchor", "middle")
                 .html(function (d, i) { return $scope.aData[i].values.toFixed($scope.tofix); })
                .attr("transform", "translate(0,10)")
            .attr("font-size", 10)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            function mouseover(d, i) {
                //d3.select("body").style("stroke-width", '4px')
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .8);

            }
            function mousemove(d, i) {
                tooltip.html("District: " + $scope.aData[i].name + "<br/> Rank: " + $scope.aData[i].rank + "<br/>" + $scope.aData[i].values.toFixed($scope.tofix))
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
    $scope.setLegend = function () {
        var firstMid = 0, secondMid = 0, dataLength = 0;
        $.each($scope.ds, function (i, value) {
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
        if ($scope.natureId == 2) // sort for negative indicator
        { $scope.ds.sort(function (a, b) { return b - a }); }
        $scope.low = parseFloat($scope.ds[dataLength - 1].toFixed($scope.tofix)); $scope.low2 = parseFloat($scope.ds[secondMid].toFixed($scope.tofix));
        $scope.mid = parseFloat($scope.ds[firstMid].toFixed($scope.tofix));
        $scope.high = parseFloat($scope.ds[0].toFixed($scope.tofix));
        if ($scope.natureId == 2) // reverse for negative indicator
        { $scope.ds.sort(function (a, b) { return a - b }); }
        $scope.setCustomLegend();
    }
    $scope.setLegend2 = function () {
        var firstMid = 0, secondMid = 0, dataLength = 0;
        $.each($scope.ds, function (i, value) {
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
        if ($scope.natureId2 == 2) // sort for negative indicator
        { $scope.ds.sort(function (a, b) { return b - a }); }
        $scope.low = parseFloat($scope.ds[dataLength - 1].toFixed($scope.tofix)); $scope.low2 = parseFloat($scope.ds[secondMid].toFixed($scope.tofix));
        $scope.mid = parseFloat($scope.ds[firstMid].toFixed($scope.tofix));
        $scope.high = parseFloat($scope.ds[0].toFixed($scope.tofix));
        if ($scope.natureId2 == 2) // reverse for negative indicator
        { $scope.ds.sort(function (a, b) { return a - b }); }
        $scope.setCustomLegend2();
    }
    $scope.setCustomLegend = function () {
        var highDistrict = '', midDistrict = '', lowDistrict = '';
        var txtmid1 = parseFloat($scope.mid);
        var txtmid2 = parseFloat($scope.low2+$scope.stp);
        var txtlow1 = parseFloat($scope.low2);
        var txtlow2 = parseFloat($scope.low);
        var txthigh1 = parseFloat($scope.high);
        var txthigh2 = parseFloat($scope.mid + $scope.stp);
        var tmpVal;
        //var highTotal = 0, midTotal = 0, lowTotal = 0;
        if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {
            $scope.aData.sort($scope.SortByRank);
            if ($scope.natureId == 2) {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if ((tmpVal >= txtlow2 && tmpVal <= txtlow1) || (tmpVal < txtlow2)) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                    }
                    if ((tmpVal >= txthigh2 && tmpVal <= txthigh1) || (tmpVal > txthigh1)) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                    }
                }
            }
            else {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if ((tmpVal >= txtlow2 && tmpVal <= txtlow1) || (tmpVal < txtlow2)) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                    }
                    if ((tmpVal >= txthigh2 && tmpVal <= txthigh1) || (tmpVal > txthigh1)) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                    }
                }
            }
            $scope.aData.sort($scope.SortByName);
        }
        else {
            alert('invalid value');
        }
    }
    $scope.setCustomLegend2 = function () {
        var highDistrict = '', midDistrict = '', lowDistrict = '';
        var txtmid1 = parseFloat($scope.mid);
        var txtmid2 = parseFloat($scope.low2 + $scope.stp);
        var txtlow1 = parseFloat($scope.low2);
        var txtlow2 = parseFloat($scope.low);
        var txthigh1 = parseFloat($scope.high);
        var txthigh2 = parseFloat($scope.mid + $scope.stp);
        var tmpVal;
        //var highTotal = 0, midTotal = 0, lowTotal = 0;
        if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {
            $scope.aData2.sort($scope.SortByRank);
            if ($scope.natureId2 == 2) {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData2[i].values).toFixed($scope.tofix));
                    if ((tmpVal >= txtlow2 && tmpVal <= txtlow1) || (tmpVal < txtlow2)) {
                        $scope.aData2[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData2[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                    }
                    if ((tmpVal >= txthigh2 && tmpVal <= txthigh1) || (tmpVal > txthigh1)) {
                        $scope.aData2[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                    }
                }
            }
            else {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData2[i].values).toFixed($scope.tofix));
                    if ((tmpVal >= txtlow2 && tmpVal <= txtlow1) || (tmpVal < txtlow2)) {
                        $scope.aData2[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData2[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                    }
                    if ((tmpVal >= txthigh2 && tmpVal <= txthigh1) || (tmpVal > txthigh1)) {
                        $scope.aData2[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                    }
                }
            }
            $scope.aData2.sort($scope.SortByName);
        }
        else {
            alert('invalid value');
        }
    }
    $scope.setMap2 = function () {
        $scope.aData2.sort($scope.SortByName);
        var width = 358,
    height = 580,
    centered;
        d3.select("#mapsvg2").remove();
        var feature = "";
        var projection = d3.geo.mercator().scale(4780)
             .center([82.3224595, 20.97702712140104])
            .translate([width / 2, height / 2]);
        var path = d3.geo.path().projection(projection);
        var canvas = d3.select("body").select("#map2").append("svg").attr("id", "mapsvg2")

    .attr("width", 350).attr("height", 570);
        d3.json($scope.mapUrl2, function (data) {
            var group = canvas.selectAll("g")
            .data(data.features)
            .enter()
            .append("g")
        .on("click", clicked);
            //var projection = d3.geo.mercator().scale(4550).translate([-6370, 1980]);
            //var projection = d3.geo.mercator();
            //var path = d3.geo.path().projection(projection);
            var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
            var area = group.append("path")
            .attr("d", path)
           .style("fill", function (d, i) { return $scope.aData2[i].color; })
            .style("stroke", "white")
               // .style("stroke:hover", "black")

    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout).style("stroke-width", 1);
            group.append("text").attr("class", "maptxt")
                 //.attr("fill", function (d, i) { return aData[i].color; })
            .attr("x", function (d, i) {
                if ($scope.aData2[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[0]) / 1.1; }
                else if ($scope.aData2[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData2[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
                else if ($scope.aData2[i].name.toUpperCase() == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.08; }
                else if ($scope.aData2[i].name.toUpperCase() == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData2[i].name.toUpperCase() == 'RAIPUR' && $scope.mapUrl == 'map/cg18.json') { return (path.centroid(d)[0]) / 1; }
                else {
                    return path.centroid(d)[0];
                }

            })
            .attr("y", function (d, i) {
                if ($scope.aData2[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
                else if ($scope.aData2[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[1]) / 1.2; }
                else {
                    return path.centroid(d)[1];
                }
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) { return $scope.aData2[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
              .attr("font-size", 11.5)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            group.append("text").attr("class", "mapvals")
                //.attr("fill", function (d, i) { return aData[i].color; })
           .attr("x", function (d, i) {
               if ($scope.aData2[i].name.toUpperCase() == 'BILASPUR')
               { return (path.centroid(d)[0]) / 1.07; }
               else if ($scope.aData2[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
               else if ($scope.aData2[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
               else if ($scope.aData2[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[0]) / 1; }
               else {
                   return path.centroid(d)[0];
               }
           })
           .attr("y", function (d, i) {
               if ($scope.aData2[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
               else if ($scope.aData2[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')
                   ) { return (path.centroid(d)[1]) / 1.2; }
               else {
                   return path.centroid(d)[1];
               }
           })
           .attr("text-anchor", "middle")
                 .html(function (d, i) { return $scope.aData2[i].values.toFixed($scope.tofix); })
                .attr("transform", "translate(0,10)")
            .attr("font-size", 10)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            function mouseover(d, i) {
                //d3.select("body").style("stroke-width", '4px')
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .8);

            }
            function mousemove(d, i) {
                tooltip.html("District: " + $scope.aData2[i].name + "<br/> Rank: " + $scope.aData2[i].rank + "<br/>" + $scope.aData2[i].values.toFixed($scope.tofix))
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
    $scope.compare = function () {
        if ($scope.mapUrl == $scope.mapUrl2) {
            $scope.setCustomLegend();
            $scope.setMap();
            $scope.setCustomLegend2();
            $scope.setMap2();
            $scope.loadHbarChart();
            $scope.loadChart2();
            //$scope.loadDoughnut();
        }
        else {
            alert('Map not comparable');
        }
    }
    $scope.loadHbarChart = function () {
        //get difference data
        $scope.differenceData = [];
        //check for oparetor
        if ($scope.operator == '-') {
            for (var i = 0; i < $scope.barData.length; i++) {
                $scope.differenceData.push(($scope.barData[i].toFixed(2) - $scope.barData2[i].toFixed(2)).toFixed($scope.tofix));
            }
            $scope.hBarLable = 'Difference: ' + parseFloat($scope.cgData.values - $scope.cgData2.values);
        }
        else if ($scope.operator == '+') {
            for (var i = 0; i < $scope.barData.length; i++) {
                $scope.differenceData.push(($scope.barData[i] + $scope.barData2[i]).toFixed($scope.tofix));
            }
            $scope.hBarLable = 'Addition: ' + parseFloat($scope.cgData.values + $scope.cgData2.values);
        }
        else if ($scope.operator == '/') {
            for (var i = 0; i < $scope.barData.length; i++) {
                $scope.differenceData.push(($scope.barData[i].toFixed(2) / $scope.barData2[i].toFixed(2)).toFixed(2));
            }
            $scope.hBarLable = 'Division: ' + parseFloat($scope.cgData.values / $scope.cgData2.values);
        }
        else if ($scope.operator == 'x') {
            for (var i = 0; i < $scope.barData.length; i++) {
                $scope.differenceData.push(($scope.barData[i].toFixed(2) * $scope.barData2[i].toFixed(2)).toFixed($scope.tofix));
            }
            $scope.hBarLable = 'Multiplication: ' + parseFloat($scope.cgData.values * $scope.cgData2.values);
        }
        document.getElementById('hBarSection').innerHTML = ' <canvas id="hBar" height="400%"> </canvas>';
        var ctxHbar = document.getElementById("hBar");
        var myHChart = new Chart(ctxHbar, {
            type: 'horizontalBar',
            data: {
                labels: $scope.barLable,
                datasets: [
                    {
                        //label: 'Difference (' + IndicatorName + ' ' + year1 + ' - ' + IndicatorName2 + ' ' + year2 + ') ',
                        label: $scope.hBarLable,
                        data: $scope.differenceData,
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
                            ctx.fillStyle = "#000";
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
                },
            legend:{display: true,labels:{fontSize:18}}
            }
        });
    }
    $scope.loadChart2 = function () {
        Chart.defaults.global.defaultFontColor = '#666';

        document.getElementById('chartSection2').innerHTML = ' <canvas id="barChart2" height="90%"> </canvas>';

        var ctx2 = document.getElementById("barChart2");

        var myChart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: $scope.barLable,
                datasets: [
                    {
                        label: 'First dataset ',
                        data: $scope.barData,
                        scaleFontColor: "#fff",
                        backgroundColor: "#0AB0B4"
                    },
                {
                    label: 'Second dataset',
                    data: $scope.barData2,
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
    $scope.pdfDownload = function () {
        $scope.pdfLoader = 'fa-spinner fa-spin';
        var element = $("#map"); // global variablebarChart
        var element3 = $("#map2"); // global variablebarChart
        var element2 = $("#barChart2"); // global variablebarChart
        var element4 = $("#hBarSection"); // global variablebarChart
        var getCanvas, getCanvas1, getCanvas2, getCanvas3; // global variable
        $("#map").css("color", "rgba(255,0,0,0)");
        $("#map").css('background-color', 'white');
        $("#map2").css("color", "rgba(255,0,0,0)");
        $("#map2").css('background-color', 'white');
        $("#hBarSection").css('background-color', 'rgb(255,255,255)');
        $("#barChart2").css('background-color', 'rgb(255,255,255)');

        var doc = new jsPDF('landscape', 'pt');
        //var doc = new jsPDF('p', 'pt');
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        var centerAlign = (width / 2) - (doc.getStringUnitWidth($scope.pageHeading) * 13 / 2);
        

        html2canvas(element3, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgData = getCanvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 10, 80, 310, height - 130);//295, 200 
                $("#map2").removeAttr("style");
                // Draw Legends Square
                doc.setDrawColor(0);
                doc.setFontSize(10);
                doc.setFillColor(112, 219, 112);
                doc.rect(160, 450, 10, 10, 'FD'); // filled green square                     
                doc.setFillColor(255, 184, 77);
                doc.rect(160, 465, 10, 10, 'FD'); // filled yellow square                   
                doc.setFillColor(255, 121, 77);
                doc.rect(160, 480, 10, 10, 'FD'); // filled red square 
                //doc.setFillColor(152, 159, 165);
                //doc.rect(160, 495, 10, 10, 'FD'); // filled grey square 

                //Legends Value(Range)
                //doc.setTextColor(0, 0, 0);
                //doc.text(450, 460, ($scope.mid + $scope.stp) + ' - ' + $scope.high);
                //doc.text(450, 475, ($scope.low2 + $scope.stp) + ' - ' + $scope.mid);
                //doc.text(450, 490, $scope.low + ' - ' + $scope.low2);
                //doc.text(180, 505, 'Not Available');
               
            }
        });
        html2canvas(element, {
            onrendered: function (canvas) {

                getCanvas = canvas;
                var imgData1 = getCanvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData1, 'JPEG', 290, 80, 310, height - 130);//295, 200 
                $("#map").removeAttr("style");
                // Draw Legends Square
                doc.setDrawColor(0);
                doc.setFontSize(10);
                doc.setFillColor(112, 219, 112);
                doc.rect(430, 450, 10, 10, 'FD'); // filled green square                     
                doc.setFillColor(255, 184, 77);
                doc.rect(430, 465, 10, 10, 'FD'); // filled yellow square                   
                doc.setFillColor(255, 121, 77);
                doc.rect(430, 480, 10, 10, 'FD'); // filled red square 
                //doc.setFillColor(152, 159, 165);
                //doc.rect(430, 495, 10, 10, 'FD'); // fil

                //for map 2
                //doc.setTextColor(0, 0, 0);
                doc.text(180, 460, ($scope.mid + $scope.stp) + ' - ' + $scope.high);
                doc.text(180, 475, ($scope.low2 + $scope.stp) + ' - ' + $scope.mid);
                doc.text(180, 490, $scope.low + ' - ' + $scope.low2);
                //doc.text(450, 505, 'Not Available');

                doc.text(450, 460, ($scope.mid + $scope.stp) + ' - ' + $scope.high);
                doc.text(450, 475, ($scope.low2 + $scope.stp) + ' - ' + $scope.mid);
                doc.text(450, 490, $scope.low + ' - ' + $scope.low2);

               
            }
        });
       
        html2canvas(element4, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgDataChart = getCanvas.toDataURL("image/jpeg", 1.0);
                doc.addImage(imgDataChart, 'JPEG', 560, 80, 280, height - 110);

                html2canvas(element2, {
                    onrendered: function (canvas) {
                        if ($scope.printChart)
                        {
                            getCanvas3 = canvas;
                            var imgDataChart = getCanvas3.toDataURL("image/jpeg", 1.0);
                            doc.addPage();
                            //heading
                            doc.setFontSize(13);
                            doc.text(centerAlign, 25, $scope.pageHeading);
                            doc.setLineWidth(0.2);
                            doc.line(20, 32, width - 10, 32);

                            doc.setFontSize(11);
                            doc.text(20, 50, 'First Dataset: ' + $("#ddlSector option:selected").text() + ', ' + $("#ddlIndicator option:selected").text() + ', ' + $("#ddlYear option:selected").text() + ', ' + $("#ddlSource option:selected").text());
                            doc.text(20, 70, 'Second Dataset: ' + $scope.ddlSector.sectorName + ', ' + $scope.ddlIndicator.indicatorName + ', ' + $scope.ddlYear.year + ', ' + $scope.ddlSource.sourceName);
                            doc.addImage(imgDataChart, 'JPEG', 20, 100, width - 50, height - 250);
                            // footer
                            doc.line(0, height - 20, width, height - 20);
                            doc.setFontSize(10);
                            doc.text(width - 300, height - 10, 'Directorate of Economics and Statistics, Chhattisgarh');
                        }
                        if ($scope.printTable)
                        {
                            doc.addPage();
                            //heading
                            doc.setFontSize(13);
                            doc.text(centerAlign, 25, $scope.pageHeading);
                            doc.setLineWidth(0.2);
                            doc.line(20, 32, width - 10, 32);

                            var columns = ["Sno", "District", $("#ddlIndicator option:selected").text() + ' [' + $("#ddlYear option:selected").text() + ']', $scope.ddlIndicator.indicatorName + ' [' + $scope.ddlYear.year + ']', $scope.hBarLable];
                            var tempRow = [];
                            for (var i = 0; i < $scope.barLable.length; i++) {
                                tempRow[i] = [i + 1, $scope.barLable[i], $scope.barData[i], $scope.barData2[i], $scope.differenceData[i]]
                            }
                            doc.autoTable(columns, tempRow, {
                                startY: 40,
                                styles: {
                                    overflow: 'linebreak',
                                    fontSize: 10.5,
                                    cellPadding: 3
                                }
                            });
                            // footer
                            doc.line(0, height - 20, width, height - 20);
                            doc.setFontSize(10);
                            doc.text(width - 270, height - 10, 'Directorate of Economics and Statistics, Chhattisgarh');
                        }
                        
                        doc.save("CG Dashboard.pdf");
                        $scope.pdfLoader = 'fa-file-pdf-o';
                        $scope.$apply();
                    }
                });
            }
        });
        //heading
        doc.setFontSize(13);
        doc.text(centerAlign, 25, $scope.pageHeading);
        doc.setLineWidth(0.2);
        doc.line(20, 32, width - 10, 32);
        doc.setFontSize(11);
        //Data Display
        doc.text(300, 50, $("#ddlSector option:selected").text() + ', ' + $("#ddlIndicator option:selected").text() + ', ' + $("#ddlYear option:selected").text() + ', ' + $("#ddlSource option:selected").text());
        doc.text(20, 50, $scope.ddlSector.sectorName + ', ' + $scope.ddlIndicator.indicatorName + ', ' + $scope.ddlYear.year + ', ' + $scope.ddlSource.sourceName);
        doc.text(340, 73, 'Chhattisgarh: ' + $scope.cgData.values);
        doc.text(30, 73, 'Chhattisgarh: ' + $scope.cgData2.values);

        
        
        //var newDate = new Date();
        //doc.text(700, 25, newDate.toDateString());
       // footer();
            doc.line(0, height - 20, width, height - 20);
            doc.setFontSize(10);
            doc.text(width - 300, height - 10, 'Directorate of Economics and Statistics, Chhattisgarh');
      
        
            
        
    }
    $scope.advancePdf = function () {
        $scope.pdfLoader = 'fa-spinner fa-spin';
        var element = $("#map"); // global variablebarChart
        var element3 = $("#map2"); // global variablebarChart
        var element2 = $("#barChart2"); // global variablebarChart
        var element4 = $("#hBarSection"); // global variablebarChart
        var getCanvas, getCanvas1, getCanvas2, getCanvas3; // global variable
        $("#map").css("color", "rgba(255,0,0,0)");
        $("#map").css('background-color', 'white');
        $("#map2").css("color", "rgba(255,0,0,0)");
        $("#map2").css('background-color', 'white');
        $("#hBarSection").css('background-color', 'rgb(255,255,255)');
        $("#barChart2").css('background-color', 'rgb(255,255,255)');

        var doc = new jsPDF('landscape', 'pt');
        //var doc = new jsPDF('p', 'pt');
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;

        html2canvas(element, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgData = getCanvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 10, 80, 310, height - 110);//295, 200 
                $("#map").removeAttr("style");
                // Draw Legends Square
                doc.setDrawColor(0);
                doc.setFontSize(10);
                doc.setFillColor(112, 219, 112);
                doc.rect(160, 450, 10, 10, 'FD'); // filled green square                     
                doc.setFillColor(255, 184, 77);
                doc.rect(160, 465, 10, 10, 'FD'); // filled yellow square                   
                doc.setFillColor(255, 121, 77);
                doc.rect(160, 480, 10, 10, 'FD'); // filled red square 
                //doc.setFillColor(152, 159, 165);
                //doc.rect(160, 495, 10, 10, 'FD'); // filled grey square 

                //Legends Value(Range)
                doc.text(180, 460, ($scope.mid + $scope.stp) + ' - ' + $scope.high);
                doc.text(180, 475, ($scope.low2 + $scope.stp) + ' - ' + $scope.mid);
                doc.text(180, 490, $scope.low + ' - ' + $scope.low2);
                //doc.text(180, 505, 'Not Available');

                html2canvas(element3, {
                    onrendered: function (canvas) {
                        getCanvas = canvas;
                        var imgData1 = getCanvas.toDataURL('image/jpeg', 1.0);
                        doc.addImage(imgData1, 'JPEG', 290, 80, 310, height - 110);//295, 200 
                        $("#map2").removeAttr("style");
                        // Draw Legends Square
                        doc.setDrawColor(0);
                        doc.setFontSize(10);
                        doc.setFillColor(112, 219, 112);
                        doc.rect(430, 450, 10, 10, 'FD'); // filled green square                     
                        doc.setFillColor(255, 184, 77);
                        doc.rect(430, 465, 10, 10, 'FD'); // filled yellow square                   
                        doc.setFillColor(255, 121, 77);
                        doc.rect(430, 480, 10, 10, 'FD'); // filled red square 
                        //doc.setFillColor(152, 159, 165);
                        //doc.rect(430, 495, 10, 10, 'FD'); // fil
                        doc.text(450, 460, ($scope.mid + $scope.stp) + ' - ' + $scope.high);
                        doc.text(450, 475, ($scope.low2 + $scope.stp) + ' - ' + $scope.mid);
                        doc.text(450, 490, $scope.low + ' - ' + $scope.low2);
                        //doc.text(450, 505, 'Not Available');
                    }
                });
            }
        });

        html2canvas(element4, {
            onrendered: function (canvas) {
                getCanvas = canvas;
                var imgDataChart = getCanvas.toDataURL("image/jpeg", 1.0);
                doc.addImage(imgDataChart, 'JPEG', 560, 80, 280, height - 110);

                html2canvas(element2, {
                    onrendered: function (canvas) {
                        getCanvas3 = canvas;
                        var imgDataChart = getCanvas3.toDataURL("image/jpeg", 1.0);
                        doc.addPage();

                        doc.text(20, 20, 'First Dataset: ' + $("#ddlSector option:selected").text() + ', ' + $("#ddlIndicator option:selected").text() + ', ' + $("#ddlYear option:selected").text() + ', ' + $("#ddlSource option:selected").text());
                        doc.text(20, 40, 'Second Dataset: ' + $scope.ddlSector.sectorName + ', ' + $scope.ddlIndicator.indicatorName + ', ' + $scope.ddlYear.year + ', ' + $scope.ddlSource.sourceName);
                        doc.addImage(imgDataChart, 'JPEG', 20, 70, width - 50, height - 250);
                        doc.addPage();
                        var columns = ["Sno", "District", $("#ddlIndicator option:selected").text() + ' [' + $("#ddlYear option:selected").text() + ']', $scope.ddlIndicator.indicatorName + ' [' + $scope.ddlYear.year + ']', $scope.hBarLable];
                        var tempRow = [];
                        for (var i = 0; i < $scope.barLable.length; i++) {
                            tempRow[i] = [i + 1, $scope.barLable[i], $scope.barData[i], $scope.barData2[i], $scope.differenceData[i]]
                        }
                        doc.autoTable(columns, tempRow, {
                            startY: 40,
                            styles: {
                                overflow: 'linebreak',
                                fontSize: 10.5,
                                cellPadding: 3
                            }
                        });
                        doc.save("CG Dashboard.pdf");
                        $scope.pdfLoader = 'fa-file-pdf-o';
                        $scope.$apply();
                    }
                });
            }
        });
        doc.setFontSize(13);
        doc.text(260, 25, document.getElementById('txtHeading').innerText);
        doc.setFontSize(11);
        //Data Display
        doc.text(20, 50, $("#ddlSector option:selected").text() + ' [' + $("#ddlIndicator option:selected").text() + '], ' + $("#ddlYear option:selected").text() + ', ' + $("#ddlSource option:selected").text());
        doc.text(300, 50, $scope.ddlSector.sectorName + ', ' + $scope.ddlIndicator.indicatorName + ', ' + $scope.ddlYear.year + ', ' + $scope.ddlSource.sourceName);
        doc.text(30, 73, 'Chhattisgarh: ' + $scope.cgData.values);
        doc.text(340, 73, 'Chhattisgarh: ' + $scope.cgData2.values);

        doc.setLineWidth(0.2);
        doc.line(10, 32, width - 10, 32);
        //var newDate = new Date();
        //doc.text(700, 25, newDate.toDateString());
    }
    //$scope.loadDoughnut = function () {
    //    document.getElementById('donutChartSection').innerHTML = ' <canvas id="donutChart" height="150px"> </canvas>';
    //    var ctx = document.getElementById("donutChart");
    //    var data = {
    //        labels: ["Chhattisgarh"],
    //        datasets: [
    //            {
    //                label: "First dataset",
    //                backgroundColor: [
    //                    'rgba(255, 99, 132, 0.2)'
    //                ],
    //                borderColor: [
    //                    'rgba(255,99,132,1)'
    //                ],
    //                borderWidth: 1,
    //                data: [$scope.cgData.values],
    //            }
    //        ,

    //           {
    //               label: "Second dataset",
    //               backgroundColor: [

    //                   'rgba(54, 162, 235, 0.2)'
    //               ],
    //               borderColor: [

    //                   'rgba(54, 162, 235, 1)'
    //               ],
    //               borderWidth: 1,
    //               data: [$scope.cgData2.values],
    //           }
    //        ]
    //    };
    //    var myBarChart = new Chart(ctx, {
    //        type: 'bar',
    //        data: data
    //    });
    //}
}]);
app.controller('indiaCtrl',['$scope', function ($scope) {
    $scope.areaLevel = 1; // for india
    $scope.stp = 1;
    $scope.setDashboard = function (allData) {
        $scope.cgData = allData[0];
        $scope.aData = allData[1];
        //hide tooltip every filter
        $('.tooltip').hide();
        //set all variables
        $scope.mapUrl = 'map/' + $scope.cgData.mapUrl;
        $scope.natureId = $scope.cgData.natureId;
        $scope.noOfDist = $scope.aData.length;
        //$scope.sourcesName = $scope.aData.sourceName;
        var tempData = JSON.parse(JSON.stringify($scope.aData));
        var sortData = tempData.sort($scope.SortByRank);
        $scope.n = Object.keys(sortData).map(function (e) { if (sortData[e].values != -1) { return sortData[e].name + '(' + sortData[e].rank + ')'; } });
        $scope.label = Object.keys(sortData).map(function (e) { if (sortData[e].values != -1) { return sortData[e].name; } });
        $scope.ds = Object.keys(sortData).map(function (e) { if (sortData[e].values != -1) { return sortData[e].values; } });
        // remove undefine
        var tempn = $scope.n;
        var templabel = $scope.label;
        var tempds = $scope.ds;
        $scope.n = [];
        $scope.label = [];
        $scope.ds = [];
        for (var i = 0; i < tempn.length; i++)
        {
            if (tempn[i] != null) { $scope.n.push(tempn[i]); }
            if (templabel[i] != null) { $scope.label.push(templabel[i]); }
            if (tempds[i] != null) { $scope.ds.push(tempds[i]); }
        }

        $scope.higherLimit = $scope.ds[0];
        // set step for legend
        if ($scope.cgData.unit == 'Percent' || $scope.cgData.unit == 'Ratio' || $scope.cgData.unit == 'Rate') {
            $scope.mins = 0.01;
            $scope.tofix = 2;
            $scope.stp = 0.01;
        }
        else {
            $scope.mins = 1;
            $scope.tofix = 0;
            $scope.stp = 1;
        }
        if ($scope.aData.length != 0) {
            $('#map').text('');
            $scope.setLegend();
            if ($scope.cgData.values == 'NA')
                $('#legendsection').hide();
            else
                $('#legendsection').show();

            // cg population
            $('#distName').text($scope.cgData.name);
            $('#cgData').text($scope.cgData.values.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            $('#txtUnit').text($scope.cgData.unit);
            // IUS
            //below code temporary
            $('#txtCG').text(IndicatorName);

            $scope.setCentralTendancy($scope.label, $scope.ds);
            $scope.loadChart($scope.n, $scope.ds);
        }
        else {
            $('#map').html("<b style='font-size:36px;  margin-left:150px'>No Data</b>");
            $('#chartSection').html("<b style='font-size:36px;  margin-left:250px'>No Data</b>");
        }
    }
    $scope.setChartLimit = function () {
        var barCount = 0;
        var tempds = JSON.parse(JSON.stringify($scope.ds));
        //var tempds = $scope.ds;
        for (var i = 0; i < $scope.ds.length; i++) {
            if ($scope.ds[i] > $scope.lowerLimit) {
                barCount = barCount + 1;
            }
            else {
                tempds[i] = $scope.lowerLimit;
            }
        }
        $scope.noOfDist = barCount;
        $scope.loadChart($scope.n, tempds);
    }
    $scope.SortByRank = function (a, b) {
        var aName = parseInt(a.rank);
        var bName = parseInt(b.rank);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByRankDesc = function (a, b) {
        var aName = parseInt(b.rank);
        var bName = parseInt(a.rank);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.SortByName = function (a, b) {
        var aName = a.name;
        var bName = b.name;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    $scope.setMap = function () {
        $scope.aData.sort($scope.SortByName);
        var width = 530,
    height = 580,
    centered;
        d3.select("#mapsvg").remove();
        var feature = "";
        var projection = d3.geo.mercator().scale(981.410056709862)
    .center([82.7676795,22.783265396645834]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view
        var path = d3.geo.path().projection(projection);

        d3.json("map/INDIA35.json", function (data) {
            // ==============for automatic scale start==============
            //var center = d3.geo.centroid(data)
            //var scale = 4280;
            //      var bounds = path.bounds(data);
            //      var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
            //      var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
            //      var scale = (hscale < vscale) ? hscale : vscale;
            //      var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
            //                        height - (bounds[0][1] + bounds[1][1]) / 2];

            //      projection = d3.geo.mercator().center(center)
            //.scale(scale).translate(offset);
            //      path = path.projection(projection);

            //================ for automatic scale end===================
            var canvas = d3.select("body").select("#map").append("svg").attr("id", "mapsvg")

    .attr("width", 550).attr("height", 570);
            var group = canvas.selectAll("g")
            .data(data.features)
            .enter()
            .append("g")
        .on("click", clicked);
            //var projection = d3.geo.mercator().scale(4550).translate([-6370, 1980]);
            //var projection = d3.geo.mercator();
            //var path = d3.geo.path().projection(projection);
            var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
            var area = group.append("path")
            .attr("d", path)
           .style("fill", function (d, i) { return $scope.aData[i].color; })
            .style("stroke", "white")
               // .style("stroke:hover", "black")

    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout).style("stroke-width", 1);
            group.append("text").attr("class", "maptxt")
                 //.attr("fill", function (d, i) { return aData[i].color; })
            .attr("x", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[0]) / 1.1; }
                else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
                else if ($scope.aData[i].name.toUpperCase() == 'JANJGIR-CHAMPA') { return (path.centroid(d)[0]) / 1.07; }
                else if ($scope.aData[i].name.toUpperCase() == 'BEMETARA') { return (path.centroid(d)[0]) / 0.9; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && $scope.mapUrl == 'map/cg18.json') { return (path.centroid(d)[0]) / 1; }
                else {
                    return path.centroid(d)[0];
                }

            })
            .attr("y", function (d, i) {
                if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
                else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[1]) / 1.2; }
                else {
                    return path.centroid(d)[1];
                }
            })
            .attr("text-anchor", "middle")
            .text(function (d, i) { return $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); })
              .attr("font-size", 11.5)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            group.append("text").attr("class", "mapvals")
                //.attr("fill", function (d, i) { return aData[i].color; })
           .attr("x", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR')
               { return (path.centroid(d)[0]) / 1.07; }
               else if ($scope.aData[i].name.toUpperCase() == 'GARIYABAND') { return (path.centroid(d)[0]) / 0.9; }
               else if ($scope.aData[i].name.toUpperCase() == 'BALRAMPUR') { return (path.centroid(d)[0]) / 0.94; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')) { return (path.centroid(d)[0]) / 1; }
               else {
                   return path.centroid(d)[0];
               }
           })
           .attr("y", function (d, i) {
               if ($scope.aData[i].name.toUpperCase() == 'BILASPUR') { return (path.centroid(d)[1]) / 1.2; }
               else if ($scope.aData[i].name.toUpperCase() == 'RAIPUR' && ($scope.mapUrl == 'map/cg18.json' || $scope.mapUrl == 'map/cg16.json')
                   ) { return (path.centroid(d)[1]) / 1.2; }
               else {
                   return path.centroid(d)[1];
               }
           })
           .attr("text-anchor", "middle")
                 .html(function (d, i) { return $scope.aData[i].values.toFixed($scope.tofix); })
                .attr("transform", "translate(0,10)")
            .attr("font-size", 10)
                .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
            function mouseover(d, i) {
                //d3.select("body").style("stroke-width", '4px')
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .8);
                $('#cgData').html($scope.aData[i].values.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#distName').text($scope.aData[i].name);
            }
            function mousemove(d, i) {
                tooltip.html("District: " + $scope.aData[i].name + "<br/> Rank: " + $scope.aData[i].rank + "<br/>" + $scope.aData[i].values.toFixed($scope.tofix))
                  .style("left", (d3.event.pageX - 35) + "px")
                  .style("top", (d3.event.pageY - 110) + "px");
            }
            function mouseout() {
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);

                $('#cgData').html($scope.cgData.values.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#distName').text($scope.cgData.name);
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
    $scope.loadChart = function (n, ds) {
        //document.getElementById('chartSection').innerHTML = ' <canvas id="barChart" height="135px"> </canvas>';
        $('#chartSection').html(' <canvas id="barChart" style="width:100%;"> </canvas>');
        //Chart.defaults.global.animation.duration = chartAnimation;
        //Chart.defaults.global.defaultFontColor = chartFontColor;
        var ctx = document.getElementById("barChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: n,
                datasets: [{
                    label: IndicatorName,
                    data: ds,
                    scaleFontColor: "#ff0000",
                    backgroundColor: '#26B99A'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            min: $scope.lowerLimit,

                            //backgroundColor: 'rgba(255,255,255,.2)',
                            fontColor: '#000'
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: '10',
                            categorySpacing: '20',
                            fontColor: '#000'

                        },
                        barPercentage: 0.3,
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
    };
    $scope.setCentralTendancy = function (label, data) {
        //mean
        var distMean = 0;
        for (i = 0; i < data.length; i++) {
            distMean = distMean + data[i];
        }
        distMean = distMean / data.length;
        $scope.meanValue = distMean.toFixed($scope.tofix);
        $scope.nearMean = label[$scope.getClosest(distMean, data)];
        // median
        var medianValue = 0;
        var middle = Math.floor(data.length / 2);
        if (data.length % 2 == 1) {
            $scope.medianValue = data[middle].toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $scope.nearMedian = label[middle];
        } else {
            medianValue = (data[middle - 1] + data[middle]) / 2.0;
            $scope.medianValue = medianValue.toFixed($scope.tofix).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            $scope.nearMedian = label[middle - 1] + ' and \n ' + label[middle];
        }
        //Range
        $scope.range = data[data.length - 1].toFixed($scope.tofix) + '-' + data[0].toFixed($scope.tofix);
        // Variance
        //var total = 0;
        //for (i = 0; i < data.length; i++) {
        //total = total + Math.pow((data[i] - distMean), 2);
        //}
        //var variance = total / data.length;
        //$scope.variance = variance.toFixed(2);
        // Standard Deviation
        //$scope.standardDeviation = Math.sqrt(variance).toFixed(2);
    }
    $scope.getClosest = function (number, array) {
        var current = 0;
        var difference = Math.abs(number - current);
        var index = array.length;
        while (index--) {
            var newDifference = Math.abs(number - array[index]);
            if (newDifference < difference) {
                difference = newDifference;
                current = index;
            }
        }
        return current;
    };
    $scope.setLegend = function () {
        var firstMid = 0, secondMid = 0, dataLength = 0;
        $.each($scope.ds, function (i, value) {
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
        if ($scope.natureId == 2) // sort for negative indicator
        { $scope.ds.sort(function (a, b) { return b - a }); }
        $('#txthigh2').val(($scope.ds[firstMid] + $scope.mins).toFixed($scope.tofix)); $('#txthigh1').val($scope.ds[0].toFixed($scope.tofix));
        $('#txtmid2').val(($scope.ds[secondMid] + $scope.mins).toFixed($scope.tofix)); $('#txtmid1').val($scope.ds[firstMid].toFixed($scope.tofix));
        $('#txtlow2').val($scope.ds[dataLength - 1].toFixed($scope.tofix)); $('#txtlow1').val($scope.ds[secondMid].toFixed($scope.tofix));
        if ($scope.natureId == 2) // reverse for negative indicator
        { $scope.ds.sort(function (a, b) { return a - b }); }
        $scope.setCustomLegend();

    }
    $scope.setCustomLegend = function () {
        var highDistrict = '', midDistrict = '', lowDistrict = '';
        var txtmid1 = parseFloat($('#txtmid1').val());
        var txtmid2 = parseFloat($('#txtmid2').val());
        var txtlow1 = parseFloat($('#txtlow1').val());
        var txtlow2 = parseFloat($('#txtlow2').val());
        var txthigh1 = parseFloat($('#txthigh1').val());
        var txthigh2 = parseFloat($('#txthigh2').val());
        var tmpVal;
        var highTotal = 0, midTotal = 0, lowTotal = 0;
        if (txthigh2 < txthigh1 && txtmid2 < txtmid1 && txtlow2 < txtlow1) {

            $scope.aData.sort($scope.SortByRank);
            if ($scope.natureId == 2) {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if (tmpVal >= txtlow2 && tmpVal <= txtlow1) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                        highDistrict = highDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        highTotal = highTotal + 1;
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                        midDistrict = midDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        midTotal = midTotal + 1;
                    }
                    if (tmpVal >= txthigh2 && tmpVal <= txthigh1) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                        lowDistrict = lowDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        lowTotal = lowTotal + 1;
                    }
                }
            }
            else {
                for (i = 0; i < $scope.ds.length; i++) {
                    tmpVal = parseFloat(($scope.aData[i].values).toFixed($scope.tofix));
                    if (tmpVal >= txtlow2 && tmpVal <= txtlow1) {
                        $scope.aData[i].color = 'rgb(255, 121, 77)'; //'#db564b';   // red
                        lowDistrict = lowDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        lowTotal = lowTotal + 1;
                    }
                    if (tmpVal >= txtmid2 && tmpVal <= txtmid1) {
                        $scope.aData[i].color = 'rgb(255, 184, 77)'; //'#ddb63e';   // yellow
                        midDistrict = midDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        midTotal = midTotal + 1;
                    }
                    if (tmpVal >= txthigh2 && tmpVal <= txthigh1) {
                        $scope.aData[i].color = 'rgb(112, 219, 112)'; //'#78AB46';   // green
                        highDistrict = highDistrict + ' ' + $scope.aData[i].name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) + ',';
                        highTotal = highTotal + 1;
                    }
                }
            }

            //--- set indicator lable
            $('.high2').text($('#txthigh2').val()); $('.high1').text($('#txthigh1').val());
            $('.mid2').text($('#txtmid2').val()); $('.mid1').text($('#txtmid1').val());
            $('.low2').text($('#txtlow2').val()); $('.low1').text($('#txtlow1').val());

            $('#highDist').text(highDistrict);
            $('#midDist').text(midDistrict);
            $('#lowDist').text(lowDistrict);

            $('#highTotal').text(highTotal);
            $('#midTotal').text(midTotal);
            $('#lowTotal').text(lowTotal);
            $scope.aData.sort($scope.SortByName);
            $scope.setMap();

        }
        else {
            alert('invalid value');
        }
    }
}]);
app.controller('loginController',['$scope', 'LoginService', function ($scope, LoginService) {
    if (sessionStorage.IsLogedIn) {
        $scope.Message = sessionStorage.Message;
        $('#logout').show();
        $('#login').hide();
    }
    else {
        $scope.Message = '';
        $('#logout').hide();
        $('#login').show();
    }
    $scope.Submitted = false;
    $scope.IsFormValid = false;

    $scope.LoginData = {
        Username: '',
        Password: ''
    };

    //Check is Form Valid or Not // Here f1 is our form Name
    $scope.$watch('f1.$valid', function (newVal) {
        $scope.IsFormValid = newVal;
    });

    $scope.Login = function () {
        $scope.Submitted = true;
        if ($scope.IsFormValid) {
            LoginService.GetUser($scope.LoginData).then(function (d) {
                if (d.data.username != null) {
                    sessionStorage.IsLogedIn = true;
                    sessionStorage.Message = d.data.fullName;
                    //$scope.LoginData.fullName = d.data.fullName;
                    window.location.href = 'dashboard.html';

                }
                else {
                    alert('Invalid Credential!');
                }
            });
        }
    };
    $scope.logout = function () {
        delete sessionStorage.Message;
        delete sessionStorage.IsLogedIn;
        $('#logout').hide();
        $('#login').show();
        $scope.Message = '';
    };
}])
 .factory('LoginService', ['$http',   function ($http) {
                var fac = {};
                fac.GetUser = function (d) {
                    return $http({
                        url: baseUrl + 'api/user/GetUser',
                        method: 'POST',
                        data: JSON.stringify(d),
                        headers: { 'content-type': 'application/json' }
                    });
                };
                return fac;
            }]);
app.controller('uploadController', ['$scope', '$http', function ($scope, $http) {

    $scope.insertData = function () {
        $scope.excelData = excelOutput;
        $http({
            url: baseUrl + 'api/user/PostExcelData',
            method: 'POST',
            data: JSON.stringify($scope.excelData),
            headers: { 'content-type': 'application/json' }
        });
    }


}]);
app.controller('globleCtrl',['$scope',  function ($scope) {
    /* -------------------- Check Browser --------------------- */
    function browser() {
        var isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
        var isFirefox = testCSS('MozBoxSizing');                 // FF 0.8+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = !isSafari && testCSS('WebkitTransform');  // Chrome 1+
        //var isIE = /*@cc_on!@*/false || testCSS('msTransform');  // At least IE6
        function testCSS(prop) {
            return prop in document.documentElement.style;
        }
        if (isOpera) {
            return false;

        } else if (isSafari || isChrome) {

            return true;

        } else {

            return false;

        }
    }
    /* ---------- IE8 list style hack (:nth-child(odd)) ---------- */

    jQuery(document).ready(function ($) {

        if ($('.messagesList').width()) {

            if (jQuery.browser.version.substring(0, 2) == "8.") {

                $('ul.messagesList li:nth-child(2n+1)').addClass('odd');

            }

        }

    });

    $(document).ready(function () {
        // start counter
        $('.popCounter').counterUp({
            delay: 10,
            time: 1500
        });
        // end counter
        /* ---------- Acivate Functions ---------- */
        widthFunctions();
    });
    /* ---------- Numbers Sepparator ---------- */
    function numberWithCommas(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1.$2");
        return x;
    }
    /* ---------- Page width functions ---------- */

    $(window).bind("resize", widthFunctions);

    function widthFunctions(e) {

        var winHeight = $(window).height();
        var winWidth = $(window).width();

        var contentHeight = $("#content").height();

        if (winHeight) {

            $("#content").css("min-height", winHeight);

        }

        if (contentHeight) {

            $("#sidebar-left2").css("height", contentHeight);

        }

        if (winWidth < 980 && winWidth > 767) {

            if ($("#sidebar-left").hasClass("span2")) {

                $("#sidebar-left").removeClass("span2");
                $("#sidebar-left").addClass("span1");

            }

            if ($("#content").hasClass("span10")) {

                $("#content").removeClass("span10");
                $("#content").addClass("span11");

            }


            $("a").each(function () {

                if ($(this).hasClass("quick-button-small span1")) {

                    $(this).removeClass("quick-button-small span1");
                    $(this).addClass("quick-button span2 changed");

                }

            });

            $(".circleStatsItem, .circleStatsItemBox").each(function () {

                var getOnTablet = $(this).parent().attr('onTablet');
                var getOnDesktop = $(this).parent().attr('onDesktop');

                if (getOnTablet) {

                    $(this).parent().removeClass(getOnDesktop);
                    $(this).parent().addClass(getOnTablet);

                }

            });

            $(".box").each(function () {

                var getOnTablet = $(this).attr('onTablet');
                var getOnDesktop = $(this).attr('onDesktop');

                if (getOnTablet) {

                    $(this).removeClass(getOnDesktop);
                    $(this).addClass(getOnTablet);

                }

            });

            $(".widget").each(function () {

                var getOnTablet = $(this).attr('onTablet');
                var getOnDesktop = $(this).attr('onDesktop');

                if (getOnTablet) {

                    $(this).removeClass(getOnDesktop);
                    $(this).addClass(getOnTablet);

                }

            });

            $(".statbox").each(function () {

                var getOnTablet = $(this).attr('onTablet');
                var getOnDesktop = $(this).attr('onDesktop');

                if (getOnTablet) {

                    $(this).removeClass(getOnDesktop);
                    $(this).addClass(getOnTablet);

                }

            });

        } else {

            if ($("#sidebar-left").hasClass("span1")) {

                $("#sidebar-left").removeClass("span1");
                $("#sidebar-left").addClass("span2");

            }

            if ($("#content").hasClass("span11")) {

                $("#content").removeClass("span11");
                $("#content").addClass("span11");

            }

            $("a").each(function () {

                if ($(this).hasClass("quick-button span2 changed")) {

                    $(this).removeClass("quick-button span2 changed");
                    $(this).addClass("quick-button-small span1");
                }
            });
            $(".circleStatsItem, .circleStatsItemBox").each(function () {
                var getOnTablet = $(this).parent().attr('onTablet');
                var getOnDesktop = $(this).parent().attr('onDesktop');

                if (getOnTablet) {

                    $(this).parent().removeClass(getOnTablet);
                    $(this).parent().addClass(getOnDesktop);
                }
            });
            $(".box").each(function () {

                var getOnTablet = $(this).attr('onTablet');
                var getOnDesktop = $(this).attr('onDesktop');

                if (getOnTablet) {

                    $(this).removeClass(getOnTablet);
                    $(this).addClass(getOnDesktop);
                }
            });
            $(".widget").each(function () {

                var getOnTablet = $(this).attr('onTablet');
                var getOnDesktop = $(this).attr('onDesktop');

                if (getOnTablet) {

                    $(this).removeClass(getOnTablet);
                    $(this).addClass(getOnDesktop);

                }
            });
        }
    }
    // custom code end
    // descg code start
    $(function () {
        "use strict";
        //Make the dashboard widgets sortable Using jquery UI
        $(".connectedSortable").sortable({ dropOnEmpty: true });
        $(".rowSortable").sortable({ dropOnEmpty: true });
        //$(".row-fluid").css("cursor", "move");
    });
    //optional label
    $("#cbDistName").change(function () {
        if (this.checked) {
            $('.maptxt').show();
        }
        else {
            $('.maptxt').hide();
        }
    });
    $("#cbDistValue").change(function () {
        if (this.checked) {
            $('.mapvals').show();
        }
        else {
            $('.mapvals').hide();
        }
    });
    // population clock
    function currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    function birth() {
        var birthPerSec = 0.018308203;
        today = new Date();
        statsdate = new Date("March 1, 2011");
        var population = 25545198;
        var timeDiff = Math.abs((today - statsdate) / 1000);
        var current_population = parseInt(population) + parseFloat(timeDiff * birthPerSec);
        $('#population').html(currencyFormat(current_population));
    }
    setInterval(birth, 1000);
    // flip legend
    $('.flip').click(function () {
        $(this).find('.card').addClass('flipped').dblclick(function () {
            $(this).removeClass('flipped');
        });
        return false;
    });
}]);
// sortable end