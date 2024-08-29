/**
 * wordgame Controller
 */

var costdelayApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
costdelayApp.filter('customcurrency', function() {
	return function(value) {
	var val = Math.abs(value);
	if (val >= 10000000) {
	val = (val / 10000000).toFixed(2) + ' Cr';
	} else if (val >= 100000) {
	val = (val / 100000).toFixed(2) + ' Lac';
	} else if (val >= 1000) {
	val = (val / 1000).toFixed(2) + 'K';
	}
	/*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
	return val;
	}
});
costdelayApp.filter('newcustomcurrency', function() {
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
costdelayApp.controller('costdelayController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	$scope.goalfutureValue=50000;
	$scope.goalfutureValue_num = 50000;
	$scope.CalculatorName="Cost of Delay";
	$scope.sipStep=1;
	/**Blanck alert*****/
	
	///pie chart setting
	$scope.priceSlider = {
        value: 1,

    	 options_delayYrs: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageDelayYear()
			},
			onEnd : function(){
				$scope.manageSliderYear();
			}
    	},
    
    	options_costDelay: {
    		floor: 1,
    		ceil: 14
    	},

		options_invt: {
            floor: 0,
            ceil: 50000000,
			showSelectionBar: true,
			minLimit: 50000,
       		maxLimit: 50000000
	  },
		options_yrs: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
			onChange: function(){
				$scope.manageCurrentYear()
			},
			onEnd : function(){
				$scope.manageSliderYear();
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
		$scope.totalYearGoal=15
		$scope.anualRateGoal=12;
		$scope.anualRateGoal_slide=12;			
		$scope.costDelayYears = 2;
		$scope.anualRateGoalString = $scope.anualRateGoal + '%';
		
		$scope.costDelayYearsString = $scope.costDelayYears + 'years';

	    $scope.showError = false;
	$scope.goalcalculateSip=function(){
		$scope.showError = false;
		var monthlyinvestmentgoal = 0; //principal amount
		var onetimeinvestmentgoal = 0;
		var anualRateGoal = $scope.anualRateGoal < 1? 0 : $scope.anualRateGoal; 
		var monthlyRateGoal = anualRateGoal / 12 / 100;  //Rate of interest
		/*var yeargoals = $scope.totalYearGoal; */
                if( parseInt($scope.costDelayYears) >= parseInt($scope.totalYearGoal)){
                   $scope.showError = true;
                }
                else{
                $scope.showError = false;
                var yeargoals = $scope.totalYearGoal < 1 ? 0: $scope.totalYearGoal;
		var costdelayyr = yeargoals - ($scope.costDelayYears < 1 ? 0 : $scope.costDelayYears);
                }
                var monthgoals = yeargoals * 12;  //Time period 
		var goalfutureValue = $scope.goalfutureValue;  
		 //Final Value
		
		/*monthlyinvestmentgoal=(goalfutureValue*monthlyRateGoal)/((Math.pow(1 + monthlyRateGoal, monthgoals) - 1)*(1+monthlyRateGoal));
		*/
		monthlyinvestmentgoal = parseInt((((goalfutureValue * (anualRateGoal / 100)) / (Math.pow(1 + (anualRateGoal  / 100), yeargoals) - 1)) / 12).toFixed(2));
		if(isNaN(monthlyinvestmentgoal) == true)
		{
			monthlyinvestmentgoal = 0;
		}
		onetimeinvestmentgoal = goalfutureValue/(Math.pow(1 + (anualRateGoal/100), yeargoals));
		
		if(anualRateGoal==0){
			
			monthlyinvestmentgoal =goalfutureValue/monthgoals;
		}
		$scope.monthlyinvestment=monthlyinvestmentgoal;
		$scope.amount_invest = $scope.monthlyinvestment * monthgoals;
		$scope.amount_profit = goalfutureValue - $scope.amount_invest;
		$scope.oneinvestment =  onetimeinvestmentgoal;
		/*$scope.costmonthlyinvestment = (goalfutureValue*monthlyRateGoal)/((Math.pow(1 + monthlyRateGoal, (costdelayyr*12)) - 1)*(1+monthlyRateGoal));*/
		$scope.costmonthlyinvestment = parseInt((((goalfutureValue * (anualRateGoal / 100)) / (Math.pow(1 + (anualRateGoal  / 100), costdelayyr) - 1)) / 12).toFixed(2));
		if(isNaN($scope.costmonthlyinvestment) == true)
		{
			$scope.costmonthlyinvestment = 0;
		}
		$scope.costoneinvestment = goalfutureValue/(Math.pow(1 + (anualRateGoal/100), costdelayyr));
		$scope.cost_amount_invest = $scope.costmonthlyinvestment *(costdelayyr*12);
		if(isNaN($scope.cost_amount_invest) == true)
		{
			$scope.cost_amount_invest = 0;
		}
		$scope.cost_amount_profit = goalfutureValue - $scope.cost_amount_invest;
		if(isNaN($scope.cost_amount_profit) == true)
		{
			$scope.cost_amount_profit = 0;
		}
                $scope.extra_monthly_amount = $scope.costmonthlyinvestment - $scope.monthlyinvestment;
                $scope.extra_onetime_amount = $scope.costoneinvestment - $scope.oneinvestment;
				if(isNaN($scope.extra_monthly_amount) === true){
                    $scope.extra_monthly_amount = 0;
                }
                if(isNaN($scope.extra_onetime_amount) === true){
                    $scope.extra_onetime_amount = 0;
                }
		
	};
	/***********End Goal SIP Calculator************/
	$scope.showErrorCD = false;
	$scope.changeValueForRange = function(){
		if($scope.goalfutureValue_num !== '' && parseInt($scope.goalfutureValue_num) >= 500000){
			$scope.goalfutureValue = parseInt($scope.goalfutureValue_num);
			$scope.showErrorCD = false;
		} else if(isNaN($scope.goalfutureValue_num) === true){
			$scope.showErrorCD = false;
			$scope.goalfutureValue_num = $scope.goalfutureValue;
    	}else {
			$scope.showErrorCD = true;
			$scope.goalfutureValue = 500000;
		}
		
		var invest_element = angular.element( document.querySelector('#invest_range') );
		invest_element.removeAttr('step');
		invest_element.removeAttr('min');
		var slider_bar = angular.element( document.querySelector('.slider_bg')); 
		if($scope.goalfutureValue >= 500000){
			slider_bar[0].style.width = ($scope.goalfutureValue - 500000) * 100 / (50000000 - 500000) + '%';
		} else{
			slider_bar[0].style.width = 0;
		}
		
	};
	$scope.changeSlider = function(){
		$scope.showErrorCD = false;
		$scope.goalfutureValue_num = $scope.goalfutureValue;
		if($scope.goalfutureValue_num < 500000|| $scope.goalfutureValue < 500000){
			$scope.goalfutureValue_num = 500000; 
			$scope.goalfutureValue = 500000;
		}
		var invest_element = angular.element( document.querySelector('#invest_range') );
		invest_element.attr('step',50000);
		invest_element.attr('min',500000);
	};	
	$scope.showCurrentYearError = false;
	$scope.showYearError = false;
	$scope.showRateError = false;

	$scope.manageCurrentYear= function(){
		$scope.showCurrentYearError = false;
		if($scope.totalYearGoal > 30) {
			$scope.totalYearGoal = 30
		} else if($scope.totalYearGoal === '' || $scope.totalYearGoal== 0 || isNaN($scope.totalYearGoal) == true || parseInt($scope.totalYearGoal) < 1){
			$scope.showCurrentYearError = true;
		}
		$scope.manageSliderYear();
	};
	$scope.manageRate = function(){
		$scope.showRateError = false;
		if($scope.anualRateGoal > 25) {
			$scope.anualRateGoal = 25
		} else if($scope.anualRateGoal === '' || $scope.anualRateGoal == 0 || isNaN($scope.anualRateGoal) == true || $scope.anualRateGoal < 1){
			$scope.showRateError = true;
		}
		else if(typeof $scope.anualRateGoal == 'string' && $scope.anualRateGoal.indexOf(".") !== -1 && $scope.anualRateGoal.length > 4 && parseInt($scope.anualRateGoal)> 0){
			$scope.anualRateGoal = $scope.anualRateGoal.slice(0, $scope.anualRateGoal.indexOf(".")+3);
			$scope.showRateError = false;
		}
		$scope.anualRateGoal_slide = $scope.anualRateGoal;
	};

	$scope.manageDelayYear = function(){
		$scope.showYearError = false;
		if($scope.costDelayYears > 30) {
			$scope.costDelayYears = 30
		} else if($scope.costDelayYears === '' || $scope.costDelayYears == 0 || isNaN($scope.costDelayYears) == true || parseInt($scope.costDelayYears) < 1 ){
			$scope.showYearError = true;
		}
		$scope.manageSliderYear()
	};
	$scope.manageSliderYear = function(){
		if(parseInt($scope.totalYearGoal < 1 ? 0 : $scope.totalYearGoal) <= parseInt($scope.costDelayYears < 1 ? 0 : $scope.costDelayYears)){
			$scope.costDelayYears = parseInt($scope.totalYearGoal <1 ? 1: $scope.totalYearGoal) -1;
		}
	};

	$scope.manageRateSlider = function(){
		$scope.anualRateGoal = $scope.anualRateGoal_slide;
		$scope.manageRate();
	};
	
}]);

var elmSite = angular.module('elmSite', ['calculatorApp']);

