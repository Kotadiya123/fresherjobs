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
calculatorApp.controller('calculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	$scope.labelbars = []
    $scope.type = 'StackedBar';
    //$scope.seriebar= ['10 Yrs','20 Yrs','30 Yrs'];
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
	$scope.investment=25000;
	$scope.investment_num = 25000
	$scope.showInvestment =  true;
	$scope.currencyGoalValue= '25,000';
	$scope.anualRate=12;
	$scope.anualRate_slider=12;
	$scope.futureValue=0;
	$scope.cYrs=0;
	$scope.rYrs=0;
	
	//$scope.totalYear=$scope.rYrs-$scope.cYrs;
	$scope.totalYear=10;
	if($scope.totalYear==0){
		$scope.totalYear=1;
	}
	$scope.year = [5,10,15,20,25,30];
	$scope.rate = [5,8,10,12,15,20,25];
	$scope.labels = ["Amount Invested","Capital Appreciation","Wealth Created"];
	$scope.data = [0, 0, 0];
	$scope.hchartcolors= ['#0CC490', '#005AC6', '#FC890D'];
	$scope.currentCalculatorId=1;
	$scope.CalculatorName="SIP Calculator";
	$scope.sipStep=1;
	
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert==false;
	$scope.futureValueYear=[0,0,0,0,0,0];

	$scope.calculateSip=function(){
		var yeararrs=[5,10,15,20,30];
		/*var interestrate=[8,10,12,15,18,20];*/
		var interestrate=[$scope.anualRate-2,$scope.anualRate,parseInt($scope.anualRate)+2];
		$scope.ratebars = [$scope.anualRate-2,$scope.anualRate,parseInt($scope.anualRate)+2];
		$scope.seriebar= [5,10,15,20,30];
		$scope.arrayRate = $scope.anualRate < 1 ? 0 : $scope.anualRate ;
		 //$scope.labelbars= $scope.ratebars;
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate < 1 ? 0 : $scope.anualRate ;
		var monthlyRate = annualRate / 12 / 100;  //Rate of interest
		var years = ($scope.totalYear < 1 ? 0 : $scope.totalYear); 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		
		futureValue = investment * (Math.pow(1 + monthlyRate, months) - 1)*(1+monthlyRate) / monthlyRate;
		if(annualRate==0){
			futureValue =investment*months;
			
		}
		$scope.futureValue=Math.round(futureValue);

		$scope.futureValue = isNaN($scope.futureValue) === true ? 0 : $scope.futureValue
	
		$scope.data[0] = (investment*months);
		$scope.data[1] =($scope.futureValue-(investment*months));
		$scope.data[2]=$scope.futureValue;
		
				for(var i=0;i<yeararrs.length;i++){
					futureYearValue=0;
					futureYearValue = investment * (Math.pow(1 + monthlyRate, yeararrs[i]*12) - 1)*(1+monthlyRate) / monthlyRate;
						if(annualRate==0){
							futureYearValue =investment*yeararrs[i]*12;
							
						}
						$scope.futureValueYear[i]=Math.round(futureYearValue);
					if(i==0){
						$scope.myJson['series'][0].values[i]=$scope.futureValueYear[i];
					}else{
						$scope.myJson['series'][0].values[i]=$scope.futureValueYear[i]-$scope.futureValueYear[i-1];
					}
					
				}
				
				$scope.myJson['title']['text']="Start early and be consistent with your SIPs. <br/>Longer the time, higher the value you add to your wealth.<br/> The chart below depicts addition of wealth in each extra 5 year block, if you stay invested for 30 years at your chosen CAGR of "+$scope.anualRate+"%";
				for(var i=0;i<interestrate.length;i++){
					
						for(var j=0;j<yeararrs.length;j++){
							totalSipCalcution(i,j,investment,interestrate[i],yeararrs[j]);
						}
				}
				
				
		return $scope.futureValue;
		
		
	};	


	
	$scope.investTotal=function(){
		
		return $scope.investment*($scope.totalYear < 1 ? 0: $scope.totalYear )*12;
	};
	
	$scope.wealthGain=function(){
		
		var gain=$scope.calculateSip()-$scope.investTotal();
		return gain;
	};
	///pie chart setting
	$scope.priceSlider = {
        value: 1,
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
			step: 0.01,
            precision: 2,
			onChange: function() {
				$scope.manageRateSlider();
		  }
        }
		
	};

	 $scope.minRangeSlider = {
        minValue: 10,
        maxValue: 90,
        options: {
            floor: 0,
            ceil: 100,
            step: 1
        }
    };
    
	//bar char setting
	function totalSipCalcution(i,j,inv,rate,year){
		var investment = inv; //principal amount
		var annualRate = rate; 
		var monthlyRate = annualRate / 12 / 100;  //Rate of interest
		var years = year; 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		
		futureValue = investment * (Math.pow(1 + monthlyRate, months) - 1)*(1+monthlyRate) / monthlyRate;
		futureValue=Math.round(futureValue);
		if(annualRate==0){
			futureValue =investment*months;
		}
		$scope.databartable[i][j] = futureValue;
		$scope.databar[j][i] = futureValue;
	}
	/***********End Sip Calculator************/
	/************Goal SIP Calculator***********/
	
	/************Inflation Calculator Calculator***********/
	$scope.timePeriod=1;
	$scope.currentExpenses=0;
	$scope.anualInflationRate=0;
	$scope.inflation=0;
	
	/************End Inflation Calculator Calculator***********/
	/************End Inflation Calculator Calculator***********/
	zingchart.MODULESDIR = "/site/modules/";
  
    $scope.myJson = {
      "type":"waterfall",
      "title":{
        "text":"Start early and be consistent with your SIPs. <br/>Longer the time, higher the value you add to your wealth.<br/> The chart below depicts addition of wealth in each extra 5 year block, if you stay invested for 30 years at your chosen CAGR of "+$scope.anualRate, "fontSize":12,
      },
      "plot":{
        "valueBox":{
          "placement":"top",
          "fontColor":"#ccc",
          "fontSize":10,
          "short":false,
		  "shortUnit":"K",
		   "thousands-separator": ",",
        },
        "tooltip":{
          "text":"%kl: <br> Rs %v ",
          "borderRadius":5,
          
		  "short":false,
		  "shortUnit":"K",
		  "thousands-separator": ",",
		  "lakhs-separator": ","
        },
        "animation":{
          "effect":4,
          "sequence":1,
          "speed":1200,
        }
      },
      "scaleX":{
        "labels":['5 years',  '10 years', '15 years', '20 years', '25 years', '30 years']
      },
      "scaleY":{
        "short":true,
        "shortUnit":"K",
        "label":{
          "text":""
        },
        "guide":{
          "lineStyle":"solid"
        },
		"negation":"currency",
		"format":"%v"
		
      },
      "options": {
        "positive": {
          "background-color": "rgba(70,191,189,1)"
        },
        "negative": {
          "background-color": "#00BCD4"
        },
        "intermediate":{
          "background-color":"#009688"    
        },
        "final": {
          "background-color": "#FF5722"
        },
        "line":{
          "line-style":"dashed",
          "line-segment-size":4,
          "line-gap-size":4,
          "line-width":1
        }
      },
      "series":[
        {
          "values": [
                    0,
                   
                    0,
                    0,
                    
                    0,
					0,
					0
                ]
        }
      ]
    };
	$scope.showError = false;
	$scope.showErrorYear = false;
	$scope.showErrorRate = false;
$scope.changeValueForRange = function(){
	if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 500){
		$scope.investment = parseInt($scope.investment_num);
		$scope.showError = false;
	} else if(isNaN($scope.investment_num) === true){
		$scope.showError = false;
		$scope.investment_num = $scope.investment;
	}
	else{
		$scope.showError = true;
		$scope.investment = 500;
		
	}
	var invest_element = angular.element( document.querySelector('#invest_range') );
	invest_element.removeAttr('step');
	invest_element.removeAttr('min');
	var slider_bar = angular.element( document.querySelector('.slider_bg')); 
	if($scope.investment >= 500){
		slider_bar[0].style.width = ($scope.investment - 500) * 100 / (100000 - 500) + '%';
	} else{
		slider_bar[0].style.width = 0;
	}
	
};
$scope.changeSlider = function(){
	$scope.showError = false;
	$scope.investment_num = $scope.investment;
	if($scope.investment_num < 500 || $scope.investment < 500){
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
} else if($scope.totalYear === '' || $scope.totalYear == 0 || isNaN($scope.totalYear) == true || parseInt($scope.totalYear) < 1){
	$scope.showErrorYear = true;
}
};

$scope.manageRate = function(){
	$scope.showErrorRate = false
if($scope.anualRate > 25) {
	$scope.anualRate = 25;
} else if($scope.anualRate === '' || $scope.anualRate == 0 || isNaN($scope.anualRate) === true || $scope.anualRate < 1 ){
	$scope.showErrorRate = true;
}
else if(typeof $scope.anualRate == 'string' && $scope.anualRate.indexOf(".") !== -1 && $scope.anualRate.length > 4 && parseInt($scope.anualRate)> 0){
	$scope.anualRate = $scope.anualRate.slice(0, $scope.anualRate.indexOf(".")+3);
	$scope.showErrorRate = false;
}
$scope.anualRate_slider = $scope.anualRate;

};

function checkFloatNumber (){

}

$scope.manageRateSlider = function(){
	$scope.anualRate = $scope.anualRate_slider;
	$scope.manageRate();
}
	
}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

