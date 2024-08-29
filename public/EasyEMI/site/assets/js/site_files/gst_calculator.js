/**
 * wordgame Controller
 */

var calculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
calculatorApp.filter('customcurrency', function() {
	return function(value) {	
	return value.toLocaleString('en-IN');
	}
});
calculatorApp.filter('newcustomcurrency', function() {
	return function(value) {
	return value.toLocaleString('en-IN');
	}
});
calculatorApp.controller('gstCalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	/*****SIP Calculator*/
	$scope.investment=5000;
	$scope.investment_num = 5000
	$scope.showInvestment =  true;
	$scope.anualRate=12;
	$scope.anualRate_slide=12;
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	$scope.sipStep=1;
	$scope.showErrorRate = false;
	$scope.calculateGST=function(){
		$scope.arrayRate = $scope.anualRate;
		 //$scope.labelbars= $scope.ratebars;
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate < 1 ? 0 : Number($scope.anualRate); 
		//var monthlyRate = annualRate;  //Rate of interest
        $scope.totalGst = ($scope.investment*(annualRate/100)).toFixed(2);
        $scope.postGST = parseInt($scope.investment) + parseInt($scope.totalGst);
        $scope.totalGSTPre =($scope.investment - ($scope.investment *(100/(100 + annualRate)))).toFixed(2);
        $scope.preGST = $scope.investment - $scope.totalGSTPre;
	};	

	$scope.priceSlider = {
        value: 1,
		options_percnt: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
            step: 0.01,
            precision: 2,
			onChange: function(){
				$scope.manageRateSlider();
			}
        }
		
	};
	
	$scope.showError = false;
$scope.changeValueForRange = function(){
	if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 5000){
		$scope.investment = parseInt($scope.investment_num);
		$scope.showError = false;
	} else if(isNaN($scope.investment_num) === true){
		$scope.showError = false;
		$scope.investment_num = $scope.investment;
	}else{
		$scope.showError = true;
		$scope.investment = 5000;
	}
	var invest_element = angular.element( document.querySelector('#invest_range') );
	invest_element.removeAttr('step');
	invest_element.removeAttr('min');
	var slider_bar = angular.element( document.querySelector('.slider_bg')); 
	if($scope.investment >= 5000){
		slider_bar[0].style.width = ($scope.investment - 5000) * 100 / (500000 - 5000) + '%';
	} 
    else{
		slider_bar[0].style.width = 0;
	}
	
};
$scope.changeSlider = function(){
	$scope.showError = false;
	$scope.investment_num = $scope.investment;
	if($scope.investment_num < 5000 || $scope.investment < 5000){
		$scope.investment_num = 5000;
		$scope.investment = 5000;
	}
	var invest_element = angular.element( document.querySelector('#invest_range') );
	invest_element.attr('step',3000);
	invest_element.attr('min',5000);
};	

$scope.manageRate = function(){
	$scope.showErrorRate = false;
if($scope.anualRate > 30) {
	$scope.anualRate = 30
} else if($scope.anualRate === '' || $scope.anualRate == 0 || isNaN($scope.anualRate) == true || $scope.anualRate === null || $scope.anualRate < 1){
	$scope.showErrorRate = true;
}
else if(typeof $scope.anualRate == 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4  && parseInt($scope.anualRate)> 0){
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

