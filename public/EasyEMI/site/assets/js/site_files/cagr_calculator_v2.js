
var cagrcalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);


cagrcalculatorApp.filter('customcurrency', function() {
  return function(value) {
  var val = Math.abs(value);
  if (val >= 10000000) {
  val = (val / 10000000).toFixed(2) + ' Cr';
  } else if (val >= 100000) {
  val = (val / 100000).toFixed(2) + ' Lac';
  } else if (val >= 1000) {
  val = (val / 1000).toFixed(2) + ' K';
  }
  /*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
  return val;
  }
});
cagrcalculatorApp.filter('newcustomcurrency', function() {
  return function(value) {
  var val = Math.abs(value);
  if (val >= 10000000) {
  val = (val / 10000000) + ' Cr';
  } else if (val >= 100000) {
  val = (val / 100000) + ' L';
  } else if (val >= 1000) {
  val = (val / 1000) + ' K';
  }
  /*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
  return val;
  }
});
cagrcalculatorApp.controller('cagrcalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){

  $scope.initialAmount=5000;
  $scope.initialAmount_num = 5000;
  $scope.presentValueAmount = 25000;
  $scope.presentValueAmount_num = 25000;
  $scope.CalculatorName="CAGR Calculator";
  $scope.totalYear=8;
  
 $scope.chartData = new Array()
  ///pie chart setting
  $scope.priceSlider = {
        value: 1,
    options_yrs: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
            onChange: function() {
              $scope.manageYear();
            }
        },
    
    
  };
  /***pie Chart**********/
 
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Future Value','Initial Investment'],
        datasets: [{
            data: $scope.chartData,
            backgroundColor: [
                '#004aad','#EE9949'
            ],
            borderColor: [
                '#004aad','#EE9949'
            ],
            borderWidth: 1,
            hoverOffset: 4
        }]
    },
    options: {
       responsive: false,
       maintainAspectRatio: false,
       cutoutPercentage: 80
    }
});
 /********/
///Money Format////
       
        $scope.ConverttotalYear = function(){
            if($scope.totalYear === 0){
                $scope.totalYear = 1;
            }
        }
        /*****************************////

   /****CALCULATE CAGR**///
   $scope.calculateCagr = function(){
     let a =   ($scope.presentValueAmount/$scope.initialAmount);
     let b = (1/($scope.totalYear < 1 ? 0: $scope.totalYear))
     let c = Math.pow(a, b)
     let cagr_percentage = ((c-1)*100).toFixed(2);
     if(isNaN(cagr_percentage)=== true){
        cagr_percentage = 0; 
     }
     $scope.chartData[0] = $scope.presentValueAmount;
     $scope.chartData[1] = $scope.initialAmount;
     myChart.update(); 
     return cagr_percentage;
   };
   $scope.showErrorInitial = false;

   $scope.changeValueForRangeInitial = function(){
    if($scope.initialAmount_num !== '' && parseInt($scope.initialAmount_num) >= 500){
      $scope.initialAmount = parseInt($scope.initialAmount_num);
      $scope.showErrorInitial = false;
    } else if(isNaN($scope.initialAmount_num) === true){
			$scope.showErrorInitial = false;
			$scope.initialAmount_num = $scope.initialAmount;
    }
		else {
      $scope.showErrorInitial = true;
      $scope.initialAmount = 500;
    }
   
    var invest_element = angular.element( document.querySelector('#initial_value_range') );
    invest_element.removeAttr('step');
    invest_element.removeAttr('min');
     var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.initialAmount>= 500){
        slider_bar[0].style.width = ($scope.initialAmount - 500) * 100 / (10000000 - 500) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
  };
  $scope.changeSliderInitial = function(){
    $scope.showErrorInitial = false;
    $scope.initialAmount_num = $scope.initialAmount;
    if($scope.initialAmount_num < 500 || $scope.initialAmount< 500){
      $scope.initialAmount_num = 500; 
      $scope.initialAmount = 500;
    }
    var invest_element = angular.element( document.querySelector('#initial_value_range') );
    invest_element.attr('step',500);
    invest_element.attr('min',500);
  };	
   $scope.showErrorPresent = false;
  $scope.changeValueForRangePresent = function(){
    if($scope.presentValueAmount_num !== '' && parseInt($scope.presentValueAmount_num) >= 500){
      $scope.showErrorPresent = false;
      $scope.presentValueAmount = parseInt($scope.presentValueAmount_num);
    }  else if(isNaN($scope.presentValueAmount_num) === true){
			$scope.showErrorPresent = false;
			$scope.presentValueAmount_num = $scope.presentValueAmount;
    }else {
      $scope.showErrorPresent = true;
      $scope.presentValueAmount = 500;
    }
   
    var invest_element = angular.element( document.querySelector('#present_value_range') );
    invest_element.removeAttr('step');
    invest_element.removeAttr('min');
     var slider_bar = angular.element( document.querySelectorAll('.slider_bg')); 
       if($scope.presentValueAmount>= 500){
        slider_bar[1].style.width = ($scope.presentValueAmount - 500) * 100 / (10000000 - 500) + '%';
       } else {
        slider_bar[1].style.width = 0;
       }
  };
  $scope.changeSliderPresent = function(){
    $scope.showErrorPresent = false;
    $scope.presentValueAmount_num = $scope.presentValueAmount;
    if($scope.presentValueAmount < 500 ||  $scope.presentValueAmount_num < 500){
      $scope.presentValueAmount_num = 500; 
      $scope.presentValueAmount = 500;
    }
    var invest_element = angular.element( document.querySelector('#present_value_range') );
    invest_element.attr('step',500);
    invest_element.attr('min',500);
  };	
$scope.showErrorYear = false;
  $scope.manageYear = function(){
    $scope.showErrorYear = false;
		if($scope.totalYear > 30 ){
			$scope.totalYear = 30; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || parseInt($scope.totalYear) < 1){
      $scope.showErrorYear = true;
    }
		};
 
}]);


var elmSite = angular.module('elmSite', ['calculatorApp']);

