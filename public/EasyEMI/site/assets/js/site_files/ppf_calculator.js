/**
 * wordgame Controller
 */

var ppfCalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
ppfCalculatorApp.filter('customcurrency', function() {
	return function(value) {	
	return value.toLocaleString('en-IN');
	}
});
ppfCalculatorApp.filter('newcustomcurrency', function() {
	return function(value) {
	return value.toLocaleString('en-IN');
	}
});
ppfCalculatorApp.controller('ppfCalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
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
	$scope.investment=10000;
	$scope.investment_num = 10000
	$scope.showInvestment =  true;
	$scope.anualRate=7.1;
	
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
	$scope.hchartcolors= ['#0CC490', '#005AC6', '#FC890D'];
	
	$scope.currentCalculatorId=1;
	$scope.sipStep=1;
	
	/**Blanck alert*****/
	$scope.investmentAlert=false;
	$scope.totalYearAlert=false;
	$scope.anualRateAlert==false;
	$scope.futureValueYear=[0,0,0,0,0,0];
	$scope.breakDatas = [];
	$scope.calculatePPF=function(){
		var yeararrs=[15,20,30];
		/*var interestrate=[8,10,12,15,18,20];*/
		$scope.seriebar= [15,20,30];
		$scope.arrayRate = $scope.anualRate;
		 //$scope.labelbars= $scope.ratebars;
		var investment = $scope.investment; //principal amount
		var annualRate = $scope.anualRate; 
		var monthlyRate = annualRate / 100;  //Rate of interest
		var years = $scope.totalYear; 
		var months = years * 12;  //Time period 
		var futureValue = 0; //Final Value
		
		futureValue = investment * ((Math.pow(1 + monthlyRate, years) - 1) / monthlyRate) * (1+monthlyRate);
		if(annualRate==0){
			futureValue =investment*months;
		}
		$scope.futureValue=Math.round(futureValue);
		$scope.data[0] = (investment*years);
		$scope.data[1] =($scope.futureValue-(investment*years));
		$scope.data[2]=$scope.futureValue;
		//$scope.breakCalculation()
		return $scope.futureValue;
	};
	
	$scope.breakCalculation = function(){
		var invest =  $scope.investment;
		var year =  $scope.totalYear;
		var rate = $scope.anualRate/100;
		let breakData = [];
		for(let i = 0; i < year; i++){
			var investObj = {};
			investObj['year'] = i +1;
			//investObj['opening_amount'] = breakData[i-1].amount_deposited;
			investObj['amount_deposited'] =  invest*(i+1);
			if(i === 0){
				investObj['pre_total_amount'] = 0;
				investObj['opening_amount'] = 0;
				investObj['interest'] =  Math.round(investObj['amount_deposited'] * rate);

			}else{
				investObj['pre_total_amount'] = breakData[i-1].total_amount_invest;
				investObj['opening_amount'] = breakData[i-1].total_amount;
				investObj['interest'] =  Math.round((investObj['pre_total_amount'] + investObj['amount_deposited']) * rate);
			}
			investObj['total_amount'] = investObj['amount_deposited'] + investObj['interest'];
			if( i === 0){
				investObj['total_amount_invest'] = investObj['total_amount'];
			} else{
				investObj['total_amount_invest'] = breakData[i-1].total_amount_invest + investObj['total_amount'] ;
			}
			breakData.push(investObj);
		}
		$scope.breakDatas = breakData;
	};
	
	$scope.investTotal=function(){
		
		return $scope.investment*$scope.totalYear*12;
	};
	
	$scope.wealthGain=function(){
		
		var gain=$scope.calculateSip()-$scope.investTotal();
		return gain;
	};
	///pie chart setting
	$scope.priceSlider = {
        value: 1,
      
		options_yrs: {
            floor: 15,
            ceil: 50,
            showSelectionBar: true,
			onChange: function() {
				$scope.breakCalculation();
		  }
    
        },
		
	};
    

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
$scope.changeValueForRange = function(){
	if($scope.investment_num !== '' && parseInt($scope.investment_num) >= 500){
		$scope.investment = parseInt($scope.investment_num);
		$scope.showError = false;
	}else if(isNaN($scope.investment_num) === true){
		$scope.showError = false;
		$scope.investment_num = $scope.investment;
	}else{
		$scope.showError = true;
		$scope.investment = 500;
	}
	var invest_element = angular.element( document.querySelector('#invest_range') );
	invest_element.removeAttr('step');
	invest_element.removeAttr('min');
	var slider_bar = angular.element( document.querySelector('.slider_bg')); 
	if($scope.investment >= 500){
		slider_bar[0].style.width = ($scope.investment - 500) * 100 / (150000 - 500) + '%';
	} else{
		slider_bar[0].style.width = 0;
	}
	$scope.breakCalculation();
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
	$scope.breakCalculation();
};	

$scope.manageYear = function(){
    if($scope.totalYear > 50 ){
        $scope.totalYear = 50; 
    } 
	$scope.breakCalculation();
};
$scope.breakCalculation();

}]);
var elmSite = angular.module('elmSite', ['calculatorApp']);

