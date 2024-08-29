/**
 * wordgame Controller
 */

var inflationcalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
inflationcalculatorApp.filter('customcurrency', function() {
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
inflationcalculatorApp.filter('newcustomcurrency', function() {
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
inflationcalculatorApp.controller('inflationcalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	/*****NPS Calculator*/
	$scope.investment=100000;
	$scope.investment_num = 100000;
	$scope.anualRate=6;
	$scope.anualRate_slide=6;
	
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
	$scope.anualRateAlert==false;
	$scope.showErrorYear = false;
	$scope.showErrorRate = false;

	///pie chart setting
	$scope.priceSlider = {
        value: 1,
      
		options_yrs: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
			onChange : function(){
				$scope.manageYearSlider();
			}
        },
		options_percnt: {
            floor: 1,
            ceil: 50,
			step: 0.01,
            precision: 2,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageRateSlider();
			}
        }
		
	};
	//bar char setting

	/***********End Sip Calculator************/
	/************Goal SIP Calculator***********/		
		
		
	$scope.calculateInflation=function(){
		$scope.finalAmount = 0; //principal amount
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate < 1 ? 0 : $scope.anualRate; 
		var monthlyRate = annualRate/ 100;  //Rate of interest
		$scope.finalAmount = Math.round(investment * (Math.pow(1 + monthlyRate, ($scope.totalYear < 1 ? 0 : $scope.totalYear ))));
	};

	$scope.showError = false;
    $scope.changeValueForRange = function(){
        if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 1000){
            $scope.investment = parseInt($scope.investment_num);
			$scope.showError = false;
        } else if(isNaN($scope.investment_num) === true){
			$scope.showError = false;
			$scope.investment_num = $scope.investment;
		}else{
			$scope.showError = true;
			$scope.investment = 1000;
		}
		
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.removeAttr('step');
        invest_element.removeAttr('min');
        var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.investment>= 500){
        slider_bar[0].style.width = ($scope.investment - 1000) * 100 / (10000000 - 1000) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
	    
    };
    $scope.changeSlider = function(){
		$scope.showError = false;
        $scope.investment_num = $scope.investment;
		if($scope.investment_num < 1000|| $scope.investment < 1000){
			$scope.investment_num = 1000;
			$scope.investment = 1000;
		}
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.attr('step',1000);
        invest_element.attr('min',1000);
    };

	$scope.manageYear = function(){
		$scope.showErrorYear = false;
		if($scope.totalYear > 30 ){
			$scope.totalYear = 30; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || parseInt($scope.totalYear) < 1){
			$scope.showErrorYear = true;
		}
		};
		
		$scope.manageRate = function(){
		$scope.showErrorRate = false;
		if($scope.anualRate > 50) {
			$scope.anualRate = 50
		} else if($scope.anualRate === '' || $scope.anualRate == 0 || isNaN($scope.anualRate) == true || $scope.anualRate< 1){
		 $scope.showErrorRate = true;
		}
		else if(typeof $scope.anualRate === 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4 && parseInt($scope.anualRate)> 0){
			$scope.anualRate = $scope.anualRate.slice(0, $scope.anualRate.indexOf(".")+3);
			$scope.showErrorRate = false;
		}
		 $scope.anualRate_slide = $scope.anualRate;
		};

		$scope.manageRateSlider = function(){
			$scope.anualRate = $scope.anualRate_slide;
			$scope.manageRate();
		};

		$scope.manageYearSlider = function(){
			$scope.showErrorYear = false;
		};
		
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

