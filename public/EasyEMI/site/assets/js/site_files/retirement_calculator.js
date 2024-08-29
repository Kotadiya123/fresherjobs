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
futurecalculatorApp.controller('futurecalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	$scope.investment=35000;
    $scope.investment_num = 35000;
	$scope.anualRate=8;
	$scope.inflationRate = 6;
	$scope.anualRate_slide=8;
	$scope.inflationRate_slide = 6;
	$scope.retiredYear = 60;
	$scope.percetage_total = 10;
	$scope.lifeExpectancy = 85
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	$scope.showError = false;
	$scope.showErrorYear = false;
	$scope.showErrorRetire = false;
	$scope.showErrorRate = false;
	//$scope.totalYear=$scope.rYrs-$scope.cYrs;
	$scope.totalYear=25;
	if($scope.totalYear==0){
		$scope.totalYear=1;
	}
	
	$scope.calculateRetirementValue=function(){
		var presentValue = $scope.investment;
		var working_period = ($scope.retiredYear < 45 ? 45 : $scope.retiredYear) - ($scope.totalYear < 18 ? 18 : $scope.totalYear);
		var future_value_monthly = (presentValue*Math.pow((1+(($scope.inflationRate < 1 ? 0 : $scope.inflationRate)/100)), working_period)).toFixed(2);
		var future_value_yearly = future_value_monthly * 12;
		var annual_rate_fixed = 8;
		var inflation_adjust_rate = ((1+(annual_rate_fixed/100))/(1+(($scope.inflationRate < 1 ? 0 : $scope.inflationRate)/100)))-1;
		var inflation_adjust_rate_monthly = inflation_adjust_rate/12;
		var retired_period = $scope.lifeExpectancy - ($scope.retiredYear < 45 ? 45 : $scope.retiredYear);
		$scope.futureValueMonthly  = parseFloat(future_value_monthly);
		future_value_monthly = -future_value_monthly
		var presentValue = calculatePV(inflation_adjust_rate_monthly, retired_period*12, future_value_monthly, 0, 1);
		$scope.presentValue = parseFloat((presentValue).toFixed(2));	
		var working_period_month = working_period * 12;
		var annualRate = ($scope.anualRate < 1 ? 0 : $scope.anualRate)/100;
		var annualRateMonthly = annualRate/12;
		presentValue = -presentValue;
		var monthlySavings = calculatePMT(annualRateMonthly, working_period_month, presentValue);
		$scope.monthlySavings = parseFloat((monthlySavings).toFixed(2))

	};	

	function calculatePV(rate, nper, pmt, fv = 0, type = 0) {
		 // Convert the rate to decimal and ensure it's not zero
		 //rate = rate / 100;
		//  if (rate === 0) {
		//   throw new Error('Interest rate cannot be zero.');
		//  }
		 const discountFactor = 1 / (1 + rate);
		 let presentValue = (pmt * (1 - Math.pow(1 + rate, -nper))) / rate;
		
		
		 if (type === 1) {
		  presentValue *= (1 + rate);
		 }
		 if (fv !== 0) {
		  presentValue += fv * Math.pow(1 + rate, -nper);
		 }
		
		 return -presentValue;
		};

		function calculatePMT(rate, nper, pv, fv = 0, type = 1) {
			 if (rate === 0) {
		         return -(pv + fv) / nper;
		         }
			 const denominator = Math.pow(1 + rate, nper) - 1;
			 const numerator = rate * (pv + fv * Math.pow(1 + rate, nper));
			 let result = -(numerator / denominator) / (1 + rate); 
			 return result
			}

	///pie chart setting
	$scope.priceSlider = {
        value: 1,
		options_yrs: {
            floor: 18,
            ceil: 60,
            showSelectionBar: true,
			onChange: function() {
				$scope.manageYear();
		   }
        },
		options_percnt: {
            floor: 1,
            ceil: 25,
            showSelectionBar: true,
			step: 0.01,
            precision: 2,
			onChange: function() {
			   $scope.manageAnualSlide();
			}
        },
		options_inflationRate:{
			floor: 1,
			ceil: 15,
			showSelectionBar: true,
			step: 0.01,
            precision: 2,
			onChange: function(){
				$scope.managePercentageSlide();
			}
		},
		options_retiredYear:{
			floor: 45,
			ceil: 65,
			showSelectionBar: true,
			onChange: function() {
				$scope.manageRetiredAge();
		   }
		}
		
	};
	//bar char setting
	
	/***********End Retirement Calculator************/
	$scope.manageAgeSlider = function(){
		if($scope.totalYear > $scope.retiredYear || $scope.totalYear === $scope.retiredYear){
			$scope.totalYear = parseInt($scope.retiredYear) - 15;
			if($scope.totalYear  < 0) {
				$scope.totalYear = 0;
				$scope.showErrorYear = true;
			}
		}
	};
	/*$scope.manageRateSlider = function(){
		if($scope.anualRate < $scope.inflationRate || $scope.anualRate === $scope.inflationRate || $scope.anualRate === ''){
			$scope.showErrorPercentage = true;
			$scope.showErrorRate = true;
		} else {
			$scope.showErrorPercentage = false;
			$scope.showErrorRate = false;
		}
	};*/
	$scope.manageRateSlider = function(){
		if($scope.anualRate < $scope.inflationRate || $scope.anualRate === $scope.inflationRate){
			$scope.inflationRate = $scope.anualRate - 1;
			if($scope.inflationRate < 0){
				$scope.inflationRate = 0;
				$scope.showErrorPercentage = true;
				$scope.showErrorRate = true;
			}
			$scope.inflationRate_slide = $scope.inflationRate;
		} 
	};
	
	$scope.showErrorPercentage = false;
    $scope.changeValueForRange = function(){
        if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 10000){
            $scope.investment = parseInt($scope.investment_num);
			$scope.showError = false;
        } else if(isNaN($scope.investment_num) === true){
			$scope.showError = false;
			$scope.investment_num = $scope.investment;
		}
		else{
			$scope.showError = true;
			$scope.investment = 10000;
		}
		
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.removeAttr('step');
        invest_element.removeAttr('min');
        var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.investment>= 10000){
        slider_bar[0].style.width = ($scope.investment - 10000) * 100 / (10000000 - 10000) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
	    
    };
    $scope.changeSlider = function(){
		$scope.showError = false;
        $scope.investment_num = $scope.investment;
		if($scope.investment_num < 10000|| $scope.investment < 10000){
			$scope.investment_num = 10000;
			$scope.investment = 10000;
		}
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.attr('step',5000);
        invest_element.attr('min',10000);
    };

	$scope.manageYear = function(){
		$scope.showErrorYear = false;
		if($scope.totalYear > 60){
			$scope.totalYear = 60; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || $scope.totalYear < 18){
			$scope.showErrorYear = true;
		}
		$scope.manageAgeSlider();
		};
		$scope.manageRetiredAge = function(){
			$scope.showErrorRetire = false;
			if($scope.retiredYear > 65){
				$scope.retiredYear = 65; 
			} else if($scope.retiredYear === '' || $scope.retiredYear == 0 || isNaN($scope.retiredYear) == true || $scope.retiredYear < 45){
				$scope.showErrorRetire = true;
			}
			$scope.manageAgeSlider();
			};
		
		$scope.manageRate = function(){
			$scope.showErrorRate = false;
		if($scope.anualRate > 25) {
			$scope.anualRate = 25
		} else if($scope.anualRate === '' || $scope.anualRate == 0 || isNaN($scope.anualRate) == true || $scope.anualRate === null || $scope.anualRate < 1){
			$scope.showErrorRate = true;
		}
		else if(typeof $scope.anualRate == 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4 && parseInt($scope.anualRate) > 0){
			$scope.anualRate = $scope.anualRate.slice(0, $scope.anualRate.indexOf(".")+3);
			$scope.showErrorRate = false;
		}
		$scope.anualRate_slide = $scope.anualRate;
		if($scope.showErrorRate == false){
			$scope.manageRateSlider();
		}
		
		};

		$scope.managePercentage = function(){
			$scope.showErrorPercentage = false;
			if($scope.inflationRate > 15) {
				$scope.inflationRate = 15
			} else if($scope.inflationRate === '' || $scope.inflationRate == 0 || isNaN($scope.inflationRate) == true || $scope.inflationRate === null || $scope.inflationRate < 1){
			  $scope.showErrorPercentage = true;
			}
			else if(typeof $scope.inflationRate == 'string' && $scope.inflationRate.indexOf(".") !== -1 && $scope.inflationRate.length > 4 && parseInt($scope.inflationRate) > 0){
				$scope.inflationRate = $scope.inflationRate.slice(0, $scope.inflationRate.indexOf(".")+3);
				$scope.showErrorPercentage = false;
			}
			$scope.inflationRate_slide = $scope.inflationRate;
			if($scope.showErrorPercentage == false){
				$scope.manageRateSlider();
			}
			
		};

		$scope.manageAnualSlide = function(){
			 $scope.anualRate = $scope.anualRate_slide;
			 $scope.manageRate();
		};

		$scope.managePercentageSlide = function(){
			$scope.inflationRate = $scope.inflationRate_slide;
			$scope.managePercentage();
		};
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

