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
	
	 $scope.labelbars = ['8%', '10%', '12%', '15%', '18%', '20%'];
    $scope.type = 'StackedBar';
    $scope.seriebar= ['5 Yrs', '10 Yrs','15 Yrs','20 Yrs','25 Yrs','30 Yrs'];
    $scope.optionbars = {
	
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
		  display: false,
          stacked: true,
		  ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
						
                        return 'Rs' + Math.round(value/100000).toFixed(2).replace('.',',')+' Lac';
                    }
                }
        }]
      }
    };

   $scope.databar = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
			];
			$scope.databartable = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
			];
		
  $scope.chartcolors= ['#803690', '#00ADF9', '#F4511E', '#46BFBD', '#FDB45C', '#2E7D32'];

	
	/*****SIP Calculator*/
	$scope.investment=500000;
    $scope.investment_num = 500000;
	$scope.anualRate=10;
	$scope.anualRate_slider=10;
	
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	//$scope.totalYear=$scope.rYrs-$scope.cYrs;
	$scope.totalYear=15;
	if($scope.totalYear==0){
		$scope.totalYear=1;
	}
	
	$scope.year = [5,10,15,20,25,30];
	$scope.rate = [5,8,10,12,15,20,25];
	$scope.labels = ["Amount Invested","Capital Appreciation","Wealth Created"];
	$scope.data = [0, 0, 0];
	$scope.hchartcolors= ['rgba(151,187,205,1)', 'rgba(70,191,189,1)', 'rgba(253,180,92,1)'];
	
	$scope.calculator=[{'id':1,'title':'Future Value Calculator - Calculate returns for  investment'},
						{'id':2,'title':'Goal Returns calculator'},
						{'id':3,'title':'Inflation Calculator'}];
	$scope.currentCalculatorId=1;
	$scope.CalculatorName="Future Value Calculator";
	$scope.sipStep=1;
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert==false;
	
	$scope.calculateSip=function(){
		var yeararrs=[5,10,15,20,25,30];
		var interestrate=[8,10,12,15,18,20];
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate < 1? 0 : $scope.anualRate; 
		var monthlyRate = annualRate / 12 / 100;  //Rate of interest
		var years = $scope.totalYear < 1 ? 0 : $scope.totalYear; 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		
            futureValue = investment * (Math.pow(1+ (annualRate/100),years ))
            if(annualRate==0){
			futureValue =investment*months;
			
		}
		$scope.futureValue=Math.round(futureValue);		
		$scope.futureValue= isNaN($scope.futureValue) === true ? 0 : $scope.futureValue;		
		return $scope.futureValue;
		
	};	
	
	$scope.investTotal=function(){
		
		return $scope.investment;
	};
	
	$scope.wealthGain=function(){
		
		var gain=$scope.calculateSip()-$scope.investTotal();
		return gain;
	};
	///pie chart setting
	$scope.priceSlider = {
        value: 1,
        options_invt: {
            floor: 0,
            ceil: 50000000,
			showSelectionBar: true,
			minLimit: 500000,
       		maxLimit: 50000000,
            //step: 500000
        },
		options_yrs: {
            floor: 1,
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
			step: 0.1,
            precision: 1,
			onChange: function() {
				$scope.manageRateSlider();
		  }
        }
		
	};
	//bar char setting
	
	/***********End Sip Calculator************/
	$scope.showError = false;
	$scope.showErrorYear = false;
	$scope.showErrorRate = false;
    $scope.changeValueForRange = function(){
        if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 50000){
            $scope.investment = parseInt($scope.investment_num);
			$scope.showError = false;
        } else if(isNaN($scope.investment_num) === true){
			$scope.showError = false;
			$scope.investment_num = $scope.investment;
		}else{
			$scope.showError = true;
			$scope.investment = 50000;
		}
		
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.removeAttr('step');
        invest_element.removeAttr('min');
        var slider_bar = angular.element( document.querySelector('.slider_bg')); 
       if($scope.investment>= 50000){
        slider_bar[0].style.width = ($scope.investment - 50000) * 100 / (50000000 - 50000) + '%';
       } else {
        slider_bar[0].style.width = 0;
       }
	    
    };
    $scope.changeSlider = function(){
		$scope.showError = false;
        $scope.investment_num = $scope.investment;
		if($scope.investment_num < 50000|| $scope.investment < 50000){
			$scope.investment_num = 50000;
			$scope.investment = 50000;
		}
        var invest_element = angular.element( document.querySelector('#invest_range') );
        invest_element.attr('step',50000);
        invest_element.attr('min',50000);
    };

	$scope.manageYear = function(){
		$scope.showErrorYear = false;
		if($scope.totalYear > 60 ){
			$scope.totalYear = 60; 
		} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || parseInt($scope.totalYear) < 1){
			$scope.showErrorYear = true;
		}
		};
		
		$scope.manageRate = function(){
			$scope.showErrorRate = false;
		if($scope.anualRate > 25) {
			$scope.anualRate = 25
		} else if( $scope.anualRate === '' || parseInt($scope.anualRate) === 0 || isNaN($scope.anualRate) === true || $scope.anualRate < 1){
			$scope.showErrorRate = true;
		}
		else if(typeof $scope.anualRate == 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4 && parseInt($scope.anualRate)> 0){
			$scope.anualRate = $scope.anualRate.slice(0, $scope.anualRate.indexOf(".")+3);
		}
		$scope.anualRate_slider = $scope.anualRate;
		
		};

		$scope.manageRateSlider = function(){
			$scope.anualRate = $scope.anualRate_slider;
			$scope.manageRate();
		}
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

