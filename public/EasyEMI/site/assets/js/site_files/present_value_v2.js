/**
 * wordgame Controller
 */

var presentvalueApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
presentvalueApp.filter('customcurrency', function() {
	return function(value) {
	var val = Math.abs(value);
	if (val >= 10000000) {
	val = (val / 10000000).toFixed(2) + ' Cr';
	} else if (val >= 100000) {
	val = (val / 100000).toFixed(2) + ' Lac';
	} else if (val >= 1000) {
	val = (val / 1000).toFixed(2) + ' K';
	}
	else if(val < 1000) 
	{
		val = val.toFixed(2)
	}
return val;
	}
});
presentvalueApp.filter('newcustomcurrency', function() {
	return function(value) {
	var val = Math.abs(value);
	if (val >= 10000000) {
	val = (val / 10000000) + ' Cr';
	} else if (val >= 100000) {
	val = (val / 100000) + ' L';
	} else if (val >= 1000) {
	val = (val / 1000) + ' K';
	}
	else if(val < 1000) 
	{
		val = val.toFixed(2)
	}
	return val;
	}
});
presentvalueApp.controller('presentvalueController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	
	

		
 
	
	$scope.goalfutureValue=500000;
	$scope.goalfutureValue_num=500000;
	$scope.currentCalculatorId=1;
	$scope.CalculatorName="Present Value Calculator";
	$scope.sipStep=1;
		$scope.loadingStatus =true;
		$timeout(function () {
		$scope.loadingStatus = false;
		}, 500);

		$scope.stepChange=function(cp){
		if(cp==2 && $scope.goalfutureValue==0){
			$scope.investmentAlert=true;
			$timeout(function () {
			
			$scope.investmentAlert = false;
		}, 1000);
		return true;
		}
		$scope.sipStep=cp;
		$scope.loadingStatus =true;
		$timeout(function () {
			
		$scope.loadingStatus = false;
		}, 500);
	}

	$scope.priceSlider = {
        value: 1,
        options_invt: {
            floor: 0,
            ceil: 1000000,
			showSelectionBar: true,
			minLimit: 5000,
       		maxLimit: 1000000
	  },
		options_yrs: {
            floor: 1,
            ceil: 60,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageYear()
			}
        },
		options_percnt: {
            floor:1,
            ceil: 25,
            showSelectionBar: true,
			step: 0.01,
            precision: 2,
			onChange: function(){
				$scope.manageRateSlider();
			}
        }
		
	};

	/************Present Value Calculator***********/
		$scope.totalYearGoal=15;
		$scope.anualRateGoal=12;
		$scope.anualRateGoal_slide=12;	
	$scope.presentvalueCalculate=function(){
		var monthlyinvestmentgoal = 0; //principal amount
		var onetimeinvestmentgoal = 0;
		var anualRateGoal = $scope.anualRateGoal < 1 ? 0 : $scope.anualRateGoal; 
		var yeargoals = $scope.totalYearGoal < 1 ? 0 : $scope.totalYearGoal; 
		var goalfutureValue = $scope.goalfutureValue; //Final Value
		onetimeinvestmentgoal = goalfutureValue/(Math.pow(1 + (anualRateGoal/100), yeargoals));
		$scope.oneinvestment =  onetimeinvestmentgoal;
	};
	/***********End Goal SIP Calculator************/
	$scope.showError = false;
	$scope.changeValueForRange = function(){
		if($scope.goalfutureValue_num !== '' && parseInt($scope.goalfutureValue_num) >= 50000){
			$scope.goalfutureValue = parseInt($scope.goalfutureValue_num);
			$scope.showError = false;
		} else if(isNaN($scope.goalfutureValue_num) === true){
			$scope.showError = false;
			$scope.goalfutureValue_num = $scope.goalfutureValue;
    	}else {
			$scope.goalfutureValue = 50000;
			$scope.showError = true;
		}
		
		var invest_element = angular.element( document.querySelector('#invest_range') );
		invest_element.removeAttr('step');
		invest_element.removeAttr('min');
		var slider_bar = angular.element( document.querySelector('.slider_bg')); 
		if($scope.goalfutureValue>=50000){
		slider_bar[0].style.width = ($scope.goalfutureValue - 50000) * 100 / (5000000 - 50000) + '%';
		}
		else{
			slider_bar[0].style.width = 0;
		}
};
	$scope.changeSlider = function(){
		$scope.showError = false;
		$scope.goalfutureValue_num = $scope.goalfutureValue;
		if($scope.goalfutureValue_num < 50000|| $scope.goalfutureValue < 50000){
			$scope.goalfutureValue_num = 50000;
			$scope.goalfutureValue = 50000;
		}
		var invest_element = angular.element( document.querySelector('#invest_range') );
		invest_element.attr('step',10000);
		invest_element.attr('min',50000);
	};	
	$scope.showYearError = false;

	$scope.manageYear = function(){
		$scope.showYearError = false;
		if($scope.totalYearGoal > 60 ){
			$scope.totalYearGoal = 60; 
		}
		else if($scope.totalYearGoal === '' || $scope.totalYearGoal == 0 || isNaN($scope.totalYearGoal) == true || parseInt($scope.totalYearGoal) < 1){
			$scope.showYearError = true;
		}
		};
	$scope.showRateError = false;	
		$scope.manageRate = function(){
		$scope.showRateError = false;
		if($scope.anualRateGoal > 25) {
			$scope.anualRateGoal = 25
		} else if($scope.anualRateGoal === '' || $scope.anualRateGoal == 0 || isNaN($scope.anualRateGoal) == true ||  $scope.anualRateGoal < 1){
			$scope.showRateError = true;
		}
		else if(typeof $scope.anualRateGoal == 'string' && $scope.anualRateGoal.indexOf(".") !== -1 && $scope.anualRateGoal.length > 4 || parseInt($scope.anualRateGoal)> 0){
			$scope.anualRateGoal = $scope.anualRateGoal.slice(0, $scope.anualRateGoal.indexOf(".")+3);
			$scope.showRateError = false;
		}
		$scope.anualRateGoal_slide = $scope.anualRateGoal;
		};

		$scope.manageRateSlider = function(){
			$scope.anualRateGoal = $scope.anualRateGoal_slide;
			$scope.manageRate();
		};
	
}]);

var elmSite = angular.module('elmSite', ['calculatorApp']);

