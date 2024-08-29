/**
 * wordgame Controller
 */

var futurecalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
futurecalculatorApp.filter('customcurrency', function() {
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
futurecalculatorApp.filter('newcustomcurrency', function() {
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
futurecalculatorApp.controller('sukanyacalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	/*****NPS Calculator*/
	$scope.investment=10000;
	$scope.investment_num = 10000;
	$scope.anualRate=8;
	
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	$scope.loadingStatus = false;
	//$scope.totalYear=$scope.rYrs-$scope.cYrs;
	$scope.totalYear=5;
	$scope.currentCalculatorId=1;
	$scope.sipStep=1;
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert=false;
	$scope.showErrorYear=false;

	///pie chart setting
    const d = new Date();
    $scope.year = d.getFullYear();
	$scope.priceSlider = {
        value: 1,
      
		options_yrs: {
            floor: 1,
            ceil: 10,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageYear();
			}
        },
        options_start_period: {
            floor: $scope.year-3,
            ceil: $scope.year+9,
            showSelectionBar: true
        }
		
	};
	//bar char setting

	/***********End Sip Calculator************/
	/************Goal SIP Calculator***********/		
		
		
	$scope.goalcalculateSukanya=function(){
		$scope.finalAmount = 0; //principal amount
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate;
		var years = 21; 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		$scope.years = years;
			var totalfifteen = 0;
			var lastf =[];
		for(var i=1;i<=15;i++){
			totalfifteen =(totalfifteen+investment)*(1+(annualRate/100));
			lastf.push(totalfifteen);
		}
		futureValue =Math.round(totalfifteen*Math.pow((1+(annualRate/100)),6));
		$scope.finalAmount = futureValue;
		$scope.maturityYear = $scope.year + 21;
		$scope.interest_get = $scope.finalAmount - ($scope.investment * 15)

	};

	$scope.showError = false;
    $scope.changeValueForRange = function(){
        if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 250){
            $scope.investment = parseInt($scope.investment_num);
			$scope.showError = false;
        } else if(isNaN($scope.investment_num) === true){
			$scope.showError = false;
			$scope.investment_num = $scope.investment;
		}else{
			$scope.showError = true;
			$scope.investment = 250;
		}
		
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.removeAttr('step');
        invest_element.removeAttr('min');
        var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.investment>= 250){
        slider_bar[0].style.width = ($scope.investment - 250) * 100 / (150000 - 250) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
	    
    };
    $scope.changeSlider = function(){
		$scope.showError = false;
        $scope.investment_num = $scope.investment;
		if($scope.investment_num < 250|| $scope.investment < 250){
			$scope.investment_num = 250;
			$scope.investment = 250;
		}
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.attr('step',250);
        invest_element.attr('min',250);
    };

	$scope.manageYear = function(){
		$scope.showErrorYear=false;
		if($scope.totalYear > 10 ){
			$scope.totalYear = 10; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || parseInt($scope.totalYear) < 1){
			$scope.showErrorYear=true;
		}
		};
		
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

