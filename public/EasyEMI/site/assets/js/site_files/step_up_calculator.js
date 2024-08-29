/**
 * wordgame Controller
 */

var stepUpApp = angular.module("stepUpApp", [
    "ngAnimate",
    "ngSanitize",
    "rzModule",
    "chart.js",
    "zingchart-angularjs",
]);
stepUpApp.filter("customcurrency", function () {
    return function (value) {
        return value.toLocaleString("en-IN");
    };
});
stepUpApp.filter('newcustomcurrency', function() {
   return function(value) {
   var val = Math.abs(value);
   if (val >= 10000000) {
   val = (val / 10000000).toFixed(2) + ' Cr';
   } else if (val >= 100000) {
   val = (val / 100000).toFixed(2) + ' L';
   } else if (val >= 1000) {
   val = (val / 1000).toFixed(2) + ' K';
   }
   /*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
   return val;
   }
});
stepUpApp.controller("stepUpController", [
    "$scope",
    "$http",
    "$log",
    "$sce",
    "$window",
    "$timeout",
    function ($scope, $http, $log, $sce, $window, $timeout) {
        $scope.labelbars = [];
        $scope.type = "StackedBar";
        $scope.chartData = new Array();
        //$scope.seriebar= ['10 Yrs','20 Yrs','30 Yrs'];
        $scope.optionbars = {};

        $scope.databar = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        $scope.databartable = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        /*****SIP Calculator*/
        $scope.investment = 25000;
        $scope.investment_num = 25000;
        $scope.showInvestment = true;
        $scope.currencyGoalValue = "25,000";
        $scope.anualRate = 12;
        $scope.anualRate_slider = 12;
        $scope.stepUpRate = 10;
        $scope.stepUpRate_slider = 10;
        $scope.futureValue = 0;
        $scope.cYrs = 0;
        $scope.rYrs = 0;

        //$scope.totalYear=$scope.rYrs-$scope.cYrs;
        $scope.totalYear = 10;
        if ($scope.totalYear == 0) {
            $scope.totalYear = 1;
        }
        $scope.year = [5, 10, 15, 20, 25, 30];
        $scope.rate = [5, 8, 10, 12, 15, 20, 25];
        $scope.labels = [
            "Amount Invested",
            "Capital Appreciation",
            "Wealth Created",
        ];
        $scope.data = [0, 0, 0];
        $scope.hchartcolors = ["#0CC490", "#005AC6", "#FC890D"];
        $scope.currentCalculatorId = 1;
        $scope.CalculatorName = "Step Up SIP Calculator";
        $scope.sipStep = 1;

        /**Blanck alert*****/
        $scope.investmentAlert = false;
        $scope.totalYearAlert = false;
        $scope.anualRateAlert == false;
        $scope.futureValueYear = [0, 0, 0, 0, 0, 0];

        /***pie Chart**********/

        const ctx = document.getElementById("myChart").getContext("2d");
        ctx.canvas.width = 270;
        ctx.canvas.height = 270;
        const myChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Invested Amount", "Expected Return"],
                datasets: [
                    {
                        data: $scope.chartData,
                        backgroundColor: ["#EE9949", "#004aad"],
                        borderColor: ["#EE9949", "#004aad"],
                        borderWidth: 1,
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                cutoutPercentage: 80,
                rotation: -Math.PI / 2,
                maintainAspectRatio: false,
                 tooltips: {
                    yAlign: 'bottom'
                },
            },
        });
        /********/
        $scope.investedAmount;
        $scope.calculateSip = function () {
            var yeararrs = [5, 10, 15, 20, 30];
            /*var interestrate=[8,10,12,15,18,20];*/
            var interestrate = [
                $scope.anualRate - 2,
                $scope.anualRate,
                parseInt($scope.anualRate) + 2,
            ];
            $scope.ratebars = [
                $scope.anualRate - 2,
                $scope.anualRate,
                parseInt($scope.anualRate) + 2,
            ];
            $scope.seriebar = [5, 10, 15, 20, 30];
            $scope.arrayRate = $scope.anualRate < 1 ? 0 : $scope.anualRate;
            //$scope.labelbars= $scope.ratebars;
            var investment = $scope.investment; //principal amount
            var annualRate = $scope.anualRate < 1 ? 0 : $scope.anualRate;

            var stepUpRate =
                parseInt($scope.stepUpRate) < 1 ? 0 : $scope.stepUpRate;
            annualRate = annualRate / 100; //Rate of interest
            var monthlyRate = annualRate / 12;
            var years = $scope.totalYear < 1 ? 0 : $scope.totalYear;
            var months = years * 12; //Time period
            var futureValue = 0; //Final Value
            //    Future Value (FV) = P * [ 1 + (r/100) ]^n + P(step-up%) * [ 1 + (r/100) ]^(n-1) + ... + P(step-up%)^(n-m) * [ 1 + (r/100) ]^m

            futureValue = calculateStepUpSIP(
                investment,
                annualRate,
                months,
                stepUpRate
            );

            console.log("futureValue", futureValue);
            if (annualRate === 0) {
                futureValue = investment * months;
            }
            $scope.futureValue = Math.round(futureValue);

            $scope.futureValue =
                isNaN($scope.futureValue) === true ? 0 : $scope.futureValue;

            // $scope.data[0] = calculateTotalInvestment(
            //     investment,
            //     stepUpRate,
            //     months
            // );
            // $scope.data[1] = $scope.futureValue - $scope.data[0];
            // $scope.data[2] = $scope.futureValue;
            $scope.chartData[0] = calculateTotalInvestment(
                investment,
                stepUpRate,
                months
            );
            $scope.investedAmount = $scope.chartData[0];
            $scope.chartData[1] = $scope.futureValue - $scope.investedAmount;
            myChart.update();

            for (var i = 0; i < yeararrs.length; i++) {
                futureYearValue = 0;
                futureYearValue = calculateStepUpSIP(
                    investment,
                    annualRate,
                    yeararrs[i] * 12,
                    stepUpRate
                );

                // investment * (Math.pow(1 + monthlyRate, yeararrs[i] * 12) - 1) * (1 + monthlyRate) / monthlyRate;
                if (annualRate == 0) {
                    futureYearValue = calculateTotalInvestment(
                        investment,
                        stepUpRate,
                        months
                    );
                }
                $scope.futureValueYear[i] = Math.round(futureYearValue);
                if (i == 0) {
                    $scope.myJson["series"][0].values[i] =
                        $scope.futureValueYear[i];
                } else {
                    $scope.myJson["series"][0].values[i] =
                        $scope.futureValueYear[i] -
                        $scope.futureValueYear[i - 1];
                }
            }

            for (var i = 0; i < interestrate.length; i++) {
                for (var j = 0; j < yeararrs.length; j++) {
                    totalSipCalcution(
                        i,
                        j,
                        investment,
                        interestrate[i] / 100,
                        yeararrs[j] * 12,
                        stepUpRate
                    );
                }
            }

            return $scope.futureValue;
        };

        function calculateStepUpSIP(P, annualRate, n, s) {
            const r = annualRate / 12; // Monthly rate of return
            let maturityAmount = 0;

            for (let i = 0; i < n; i++) {
                let currentInvestment =
                    P * Math.pow(1 + s / 100, Math.floor(i / 12)); // Increment every 12 months
                maturityAmount += currentInvestment * Math.pow(1 + r, n - i);
            }

            return Math.round(maturityAmount);
        }
        function calculateTotalInvestment(P, s, n) {
            let totalInvestment = 0;

            for (let i = 0; i < n; i++) {
                let currentInvestment =
                    P * Math.pow(1 + s / 100, Math.floor(i / 12)); // Increment every 12 months
                totalInvestment += currentInvestment;
            }

            return Math.round(totalInvestment);
        }

        $scope.investTotal = function () {
            return (
                $scope.investment *
                ($scope.totalYear < 1 ? 0 : $scope.totalYear) *
                12
            );
        };

        $scope.wealthGain = function () {
            var gain = $scope.calculateSip() - $scope.investTotal();
            return gain;
        };
        ///pie chart setting
        $scope.priceSlider = {
            value: 1,
            options_yrs: {
                floor: 1,
                ceil: 60,
                showSelectionBar: true,
                onChange: function () {
                    $scope.manageYear();
                },
            },
            options_percnt: {
                floor: 1,
                ceil: 25,
                showSelectionBar: true,
                step: 0.01,
                precision: 2,
                onChange: function () {
                    $scope.manageRateSlider();
                },
            },
            options_stepup: {
                floor: 1,
                ceil: 50,
                showSelectionBar: true,
                onChange: function () {
                    $scope.manageStepupSlider();
                },
            },
        };

        $scope.minRangeSlider = {
            minValue: 10,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
            },
        };

        //bar char setting
        function totalSipCalcution(i, j, inv, rate, months, stepUpRate) {
            $scope.databartable[i][j] = calculateStepUpSIP(
                inv,
                rate,
                months,
                stepUpRate
            );
            $scope.databar[j][i] = calculateStepUpSIP(
                inv,
                rate,
                months,
                stepUpRate
            );
        }
        /***********End Sip Calculator************/
        /************Goal SIP Calculator***********/

        /************Inflation Calculator Calculator***********/
        $scope.timePeriod = 1;
        $scope.currentExpenses = 0;
        $scope.anualInflationRate = 0;
        $scope.inflation = 0;

        /************End Inflation Calculator Calculator***********/
        /************End Inflation Calculator Calculator***********/
        zingchart.MODULESDIR = "/site/modules/";

        $scope.myJson = {
            series: [
                {
                    values: [
                        0,

                        0, 0,

                        0, 0, 0,
                    ],
                },
            ],
        };

        $scope.showError = false;
        $scope.showErrorYear = false;
        $scope.showErrorRate = false;
        $scope.showErrorStepUp = false;
        $scope.changeValueForRange = function () {
            if (
                $scope.investment_num !== "" &&
                parseInt($scope.investment_num) >= 500
            ) {
                $scope.investment = parseInt($scope.investment_num);
                $scope.showError = false;
            } else if (isNaN($scope.investment_num) === true) {
                $scope.showError = false;
                $scope.investment_num = $scope.investment;
            } else {
                $scope.showError = true;
                $scope.investment = 500;
            }
            var invest_element = angular.element(
                document.querySelector("#invest_range")
            );
            invest_element.removeAttr("step");
            invest_element.removeAttr("min");
            var slider_bar = angular.element(
                document.querySelector(".slider_bg")
            );
            if ($scope.investment >= 500) {
                slider_bar[0].style.width =
                    (($scope.investment - 500) * 100) / (100000 - 500) + "%";
            } else {
                slider_bar[0].style.width = 0;
            }
        };
        $scope.changeSlider = function () {
            $scope.showError = false;
            $scope.investment_num = $scope.investment;
            if ($scope.investment_num < 500 || $scope.investment < 500) {
                $scope.investment_num = 500;
                $scope.investment = 500;
            }
            var invest_element = angular.element(
                document.querySelector("#invest_range")
            );
            invest_element.attr("step", 500);
            invest_element.attr("min", 500);
        };

        $scope.manageYear = function () {
            $scope.showErrorYear = false;
            if ($scope.totalYear > 60) {
                $scope.totalYear = 60;
            } else if (
                $scope.totalYear === "" ||
                $scope.totalYear == 0 ||
                isNaN($scope.totalYear) == true ||
                parseInt($scope.totalYear) < 1
            ) {
                $scope.showErrorYear = true;
            }
        };

        $scope.manageRate = function () {
            $scope.showErrorRate = false;
            if ($scope.anualRate > 25) {
                $scope.anualRate = 25;
            } else if (
                $scope.anualRate === "" ||
                $scope.anualRate == 0 ||
                isNaN($scope.anualRate) === true ||
                $scope.anualRate < 1
            ) {
                $scope.showErrorRate = true;
            } else if (
                typeof $scope.anualRate == "string" &&
                $scope.anualRate.indexOf(".") !== -1 &&
                $scope.anualRate.length > 4 &&
                parseInt($scope.anualRate) > 0
            ) {
                $scope.anualRate = $scope.anualRate.slice(
                    0,
                    $scope.anualRate.indexOf(".") + 3
                );
                $scope.showErrorRate = false;
            }
            $scope.anualRate_slider = $scope.anualRate;
        };

        $scope.manageStepup = function () {
            $scope.showErrorStepUp = false;
            if ($scope.stepUpRate > 50) {
                $scope.stepUpRate = 50;
            } else if (
                $scope.stepUpRate === "" ||
                $scope.stepUpRate == 0 ||
                isNaN($scope.stepUpRate) === true ||
                $scope.stepUpRate < 1
            ) {
                $scope.showErrorStepUp = true;
            }
            $scope.stepUpRate_slider = $scope.stepUpRate;
        };

        $scope.manageStepupSlider = function () {
            $scope.stepUpRate = $scope.stepUpRate_slider;
            $scope.manageStepup();
        };

        $scope.manageRateSlider = function () {
            $scope.anualRate = $scope.anualRate_slider;
            $scope.manageRate();
        };
    },
]);
var elmSite = angular.module("elmSite", ["stepUpApp"]);
