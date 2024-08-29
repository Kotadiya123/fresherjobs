/**
 * wordgame Controller
 */

var becomeApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
becomeApp.filter('customcurrency', function() {
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
becomeApp.filter('newcustomcurrency', function() {
	return function(value) {
	var val = Math.abs(value);
	if (val >= 10000000) {
	val = (val / 10000000) + ' Cr';
	} else if (val >= 100000) {
	val = (val / 100000) + ' L';
	} else if (val >= 1000) {
	val = (val / 1000) + 'K';
	}
	/*else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';*/
	return val;
	}
});

becomeApp.controller('becomeController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	
  $scope.chartcolors= ['#803690', '#00ADF9', '#F4511E', '#46BFBD', '#FDB45C', '#2E7D32'];
	/*****SIP Calculator*/
	$scope.goalfutureValue=10000000;
	$scope.currentCalculatorId=1;
	$scope.CalculatorName="Become a Crorepati";
	$scope.sipStep=1;
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert==false;
///pie chart setting
	$scope.priceSlider = {
        value: 1,

         options_current_age: {
            floor: 1,
            ceil: 60,
            showSelectionBar: true,
			onChange: function() {
				$scope.manageCurrentAge(); 
		  },
		  onEnd : function(){
			$scope.manageSliderGoal();
		}
    	},

    	 options_goal_age: {
            floor: 1,
            ceil: 60,
			minLimit: $scope.current_age,
			maxLimit: 60,
            showSelectionBar: true,
			onChange: function() {
				$scope.manageGoalAge();
		  },
		   onEnd : function(){
               $scope.manageSliderGoal();
		   }
    	},
    	
		options_percnt: {
            floor: 1,
            ceil: 25,
            showSelectionBar: true,
			step: 0.01,
            precision: 2,
			onChange: function(){
			 $scope.manageRateSlider();	
			}
        }
		
	};
	//bar char setting
        
        ///Money Format////
      
        /*****************************////
	
  
		
		$scope.current_age = 25;
		$scope.goal_age = 50
		
		$scope.anualRateGoal=15;	
		$scope.anualRateGoal_slide=15;				
	$scope.showError= true;	
	$scope.goalcalculateSip=function(){
		$scope.totalYearGoal=($scope.goal_age < 1 ? 0 : $scope.goal_age) - ($scope.current_age < 1 ? 0:$scope.current_age);
		var monthlyinvestmentgoal = 0; //principal amount
		var onetimeinvestmentgoal = 0;
		var current_age = $scope.current_age < 1 ? 0:$scope.current_age;
		var goal_age = $scope.goal_age < 1 ? 0 : $scope.goal_age;
		var anualRateGoal = $scope.anualRateGoal <1? 0 : $scope.anualRateGoal; 
		var monthlyRateGoal = anualRateGoal / 12 / 100;  //Rate of interest
		/*var yeargoals = $scope.totalYearGoal; */
		var yeargoals = goal_age - current_age;
		var monthgoals = yeargoals * 12;  //Time period 
		var goalfutureValue = $scope.goalfutureValue; //Final Value
		
		monthlyinvestmentgoal=Math.round((goalfutureValue*monthlyRateGoal)/((Math.pow(1 + monthlyRateGoal, monthgoals) - 1)*(1+monthlyRateGoal)));
		// monthlyinvestmentgoal = parseInt(((($scope.goalfutureValue * (anualRateGoal / 100)) / (Math.pow(1 + (anualRateGoal  / 100), yeargoals) - 1)) / 12).toFixed(2));
		if(isNaN(monthlyinvestmentgoal) == true || monthlyinvestmentgoal === Infinity || Math.sign(monthlyinvestmentgoal) == -1)
		{
			monthlyinvestmentgoal = 0;
		}
		if(Math.sign($scope.totalYearGoal) == -1 ){
			$scope.totalYearGoal = 0;
		}
		onetimeinvestmentgoal = goalfutureValue/(Math.pow(1 + (anualRateGoal/100), yeargoals));
		$scope.monthlyinvestment=monthlyinvestmentgoal;
		$scope.amount_invest = $scope.monthlyinvestment * monthgoals;
		$scope.amount_profit = goalfutureValue - $scope.amount_invest;
		$scope.oneinvestment =  onetimeinvestmentgoal;
		
	};

	$scope.manageSliderGoal = function(){
		
		if($scope.goal_age <= $scope.current_age && $scope.current_age !== 60){
			$scope.showError = false;
			$scope.showErrorCurrrentAge = false;
			$scope.showErrorGoalAge = false;
			$scope.goal_age = parseInt($scope.current_age) + 1;
		} else if( parseInt($scope.current_age) === 60){
			$scope.showError = false;
			$scope.showErrorCurrrentAge = false;
			$scope.showErrorGoalAge = false;
			$scope.current_age = parseInt($scope.goal_age) - 1;
		} else if(parseInt($scope.current_age) === 0 ){
			$scope.showErrorCurrrentAge = true;
			$scope.showErrorGoalAge = true;
		}
	}

	$scope.showError = false;
	$scope.showErrorCurrrentAge = false;
	$scope.showErrorGoalAge = false;
	$scope.showRateError = false;
	$scope.manageRate = function(){
		$scope.showRateError = false;
		if($scope.anualRateGoal > 25) {
			$scope.anualRateGoal = 25
		} else if($scope.anualRateGoal === '' || $scope.anualRateGoal == 0 || isNaN($scope.anualRateGoal) === true  || $scope.anualRateGoal < 1){
			$scope.showRateError = true;
		}
		else if(typeof $scope.anualRateGoal == 'string' && $scope.anualRateGoal.indexOf(".") !== -1 && $scope.anualRateGoal.length > 4 && parseInt($scope.anualRateGoal)> 0){
			$scope.anualRateGoal = $scope.anualRateGoal.slice(0, $scope.anualRateGoal.indexOf(".")+3);
			$scope.showRateError = false;
		}
		$scope.anualRateGoal_slide = $scope.anualRateGoal;
		};
     $scope.manageGoalAge = function(){
		//$scope.showError = false;
		$scope.showErrorGoalAge = false;
		if($scope.goal_age > 60){
			$scope.goal_age = 60; 
		} else if($scope.goal_age === '' || $scope.goal_age == 0 || isNaN($scope.goal_age) == true || typeof parseInt($scope.goal_age) !== 'number' || parseInt($scope.goal_age) < 1){
			$scope.showErrorGoalAge = true;
		}
	
		$scope.compareAge();
		//$scope.manageSliderGoal();
	 };	
	 $scope.manageCurrentAge = function(){
		//$scope.showError = false;
		$scope.showErrorCurrrentAge = false;
		if($scope.current_age > 60){
			$scope.current_age = 60; 
		} else if($scope.current_age === '' || $scope.current_age == 0 || isNaN($scope.current_age) == true || parseInt($scope.current_age) < 1){
			$scope.showErrorCurrrentAge = true;
		}
		$scope.compareAge();
		//$scope.manageSliderGoal();
	 };
	 $scope.compareAge = function(){
		if($scope.goal_age < $scope.current_age || $scope.goal_age == $scope.current_age){
			$scope.showError = true;
			$scope.showErrorGoalAge = true;
		}else{
			$scope.showErrorGoalAge = false;
			$scope.showError = false;
		}
	 }
	 $scope.numberWithCommas = function(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	};	
	$scope.manageRateSlider = function(){
		$scope.anualRateGoal = $scope.anualRateGoal_slide;
		$scope.manageRate();
	};
}]);

var elmSite = angular.module('elmSite', ['calculatorApp']);

