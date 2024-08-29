/**
 * wordgame Controller
 */

var npscalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
npscalculatorApp.filter('customcurrency', function() {
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
npscalculatorApp.filter('newcustomcurrency', function() {
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
npscalculatorApp.controller('npscalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	/*****NPS Calculator*/
	$scope.investment=10000;
	$scope.investment_num = 10000;
	$scope.anualRate=10;
	$scope.anualRate_slide=10;
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	$scope.loadingStatus = false;
	//$scope.totalYear=$scope.rYrs-$scope.cYrs;
	$scope.totalYear=20;
	$scope.currentCalculatorId=1;
	$scope.sipStep=1;
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert==false;

	///pie chart setting
	$scope.priceSlider = {
        value: 1,
      
		options_yrs: {
            floor: 18,
            ceil: 60,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageYear()
			}
        },
		options_percnt: {
            floor: 8,
            ceil: 15,
            showSelectionBar: true,
			step: 0.01,
            precision: 2,
			onChange: function(){
				$scope.manageRateSlider();
			}
        }
		
	};
	//bar char setting

	/***********End Sip Calculator************/
	/************Goal SIP Calculator***********/		
		
		
	$scope.goalcalculateNPS=function(){
		
		$scope.finalAmount = 0; //principal amount
		var rest_year = 60-$scope.totalYear;
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate < 8 ? 8 : $scope.anualRate; 
		var monthlyRate = annualRate / 12 / 100;  //Rate of interest
		var years = rest_year; 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		$scope.years = years;
		$scope.finalAmount = Math.round(investment * (Math.pow(1 + monthlyRate, months) - 1)*(1+monthlyRate) / monthlyRate);
		$scope.finalAmount = isNaN($scope.finalAmount) === true ? 0 : $scope.finalAmount
		$scope.total_investment = $scope.investment * months;
		$scope.interest_earned = $scope.finalAmount - ($scope.investment * months);

	};

	$scope.showError = false;
	$scope.showErrorRate = false;
	$scope.showErrorYear = false;
    $scope.changeValueForRange = function(){
        if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 500){
            $scope.investment = parseInt($scope.investment_num);
			$scope.showError = false;
        } else if(isNaN($scope.investment_num) === true){
			$scope.showError = false;
			$scope.investment_num = $scope.investment;
		} else{
			$scope.showError = true;
			$scope.investment = 500;
		}
		
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.removeAttr('step');
        invest_element.removeAttr('min');
        var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.investment>= 500){
        slider_bar[0].style.width = ($scope.investment - 500) * 100 / (150000 - 500) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
	    
    };
    $scope.changeSlider = function(){
		$scope.showError = false;
        $scope.investment_num = $scope.investment;
		if($scope.investment_num < 500|| $scope.investment < 500){
			$scope.investment_num = 500;
			$scope.investment = 500;
		}
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.attr('step',500);
        invest_element.attr('min',500);
    };

	$scope.manageYear = function(){
		$scope.showErrorYear = false;
		if($scope.totalYear > 60 ){
			$scope.totalYear = 60; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || $scope.totalYear < 18){
			//$scope.totalYear = 18;
			$scope.showErrorYear = true;
		}
		};
		
		$scope.manageRate = function(){
			$scope.showErrorRate = false;
		if($scope.anualRate > 15) {
			$scope.anualRate = 15
		} else if($scope.anualRate === '' || $scope.anualRate == 0 || isNaN($scope.anualRate) == true || $scope.anualRate < 8 ){
			//$scope.anualRate = 8;
			$scope.showErrorRate = true;
		}
		if(typeof $scope.anualRate == 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4 && parseInt($scope.anualRate) >= 8){
			$scope.anualRate = $scope.anualRate.slice(0, $scope.anualRate.indexOf(".")+3);
			$scope.showErrorRate = false;
		}
		$scope.anualRate_slide = $scope.anualRate;
		};

		$scope.manageRateSlider  = function(){
			$scope.anualRate = $scope.anualRate_slide;
			$scope.manageRate();
		};
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

