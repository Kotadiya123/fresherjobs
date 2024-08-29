/**
 * wordgame Controller
 */

var tdsApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
tdsApp.filter('customcurrency', function() {
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
tdsApp.filter('newcustomcurrency', function() {
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

tdsApp.controller('tdsController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	
  $scope.chartcolors= ['#803690', '#00ADF9', '#F4511E', '#46BFBD', '#FDB45C', '#2E7D32'];
	/*****SIP Calculator*/
	$scope.goalfutureValue=10000000;
	$scope.currentCalculatorId=1;
	$scope.CalculatorName="TDS Calculator";
	$scope.sipStep=1;
	/**Blanck alert*****/
	$scope.tds_amount = 0;
	$scope.tds_amount_num = 0;
	$scope.finalResult = 0;
	$scope.currentIndex = 0;
	$scope.isPanAvailable = "Yes";
	$scope.checkedOthers = false;
	$scope.checkedNotOthers = true;

///pie chart setting
	
	//bar char setting
        
        ///Money Format////
      
        /*****************************////
			
	$scope.showError= true;	
	$scope.goalcalculateTds=function(){
		if($scope.isPanAvailable == 'Yes'){
			$scope.tdsDetailsArray[$scope.currentIndex].pan_available = true;
		} else{
			$scope.tdsDetailsArray[$scope.currentIndex].pan_available = false;
		}
		$scope.rule_msg = $scope.tdsDetailsArray[$scope.currentIndex].message;
		if(parseInt($scope.tds_amount) > $scope.tdsDetailsArray[$scope.currentIndex].amount){
			if($scope.tdsDetailsArray[$scope.currentIndex].pan_available === true){
				if($scope.tdsDetailsArray[$scope.currentIndex].others === true){
					$scope.finalResult = $scope.tds_amount*($scope.tdsDetailsArray[$scope.currentIndex].other_percetage/100);
				}else{
					$scope.finalResult = $scope.tds_amount*($scope.tdsDetailsArray[$scope.currentIndex].tds_percentage/100);
				}
				
			} else{
				$scope.finalResult = $scope.tds_amount*($scope.tdsDetailsArray[$scope.currentIndex].pan_not_percent/100);
			}
			
		} else{
			$scope.finalResult = 0;
		}
		
	};

	$scope.tdsDetailsArray  =  [{
		'id' : 1, 'name': 'Section 192A - Payment of accumulated PF balance to an employee', 'tds_percentage' : 10, 'amount': 50000,   'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross withdrawal before 5 year continuous services during the F.Y. exceeds Rs. 50,000 then TDS will be applicable @ 10 %."
	},{
		'id' : 2, 'name': 'Section 193 - Interest on Securities', 'tds_percentage' : 10, 'amount': 10000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 10,000 then TDS will be applicable @ 10 %. In case where debentures are issued by the listed companies, no TDS shall be deducted upto Rs. 5000/-"
	},{
		'id' : 3, 'name': 'Section 194 - Dividend other than the Dividend as referred to in Section 115-O', 'tds_percentage' : 10, 'amount': 5000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 5,000/- then TDS will be applicable @ 10 %."
	},{
		'id' : 4, 'name': 'Section 194A - Interest other than Banks', 'tds_percentage' : 10, 'amount': 5000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 5,000 then TDS will be applicable @ 10 %."
	},{
		'id' : 5, 'name': 'Section 194A - Interest from Banks', 'tds_percentage' : 10, 'amount': 40000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 40,000 then TDS will be applicable @ 10 %. For senior citizen this limit is Rs. 50,000."
	},{
		'id' : 6, 'name': 'Section 194B - Winnings from Lotteries, Crossword Puzzles etc.', 'tds_percentage' : 30, 'amount': 10000,  'pan_available': true,
		'pan_not_percent' : 30, 'others': false, other_percetage: 0, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 10,000 then TDS will be applicable @ 30 %."
	},{
		'id' : 7, 'name': 'Section 194BB - Income by way of Winnings from Horse Races', 'tds_percentage' : 30, 'amount': 10000,  'pan_available': true,
		'pan_not_percent' : 30, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 10,000 then TDS will be applicable @ 30 %."
	},{
		'id' : 8, 'name': 'Section 194C - Payment to Contractor/Sub-Contractor ( In case of single payment )', 'tds_percentage' : 1, 'amount': 30000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 2, "message" : "If gross payment to the party during the F.Y. exceeds Rs. 1,00,000 then TDS will be applicable @ 1% for individuals and HUF and 2% for others. Also, if single payment exceeds Rs. 30,000 then also TDS will be applicable at the same rate."
	},{
		'id' : 9, 'name': 'Section 194C - Payment to Contractor/Sub-Contractor ( In case of during F.Y. )', 'tds_percentage' : 1, 'amount': 100000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 2,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 1,00,000 then TDS will be applicable @ 1% for individuals and HUF and 2% for others. Also, if single payment exceeds Rs. 30,000 then also TDS will be applicable at the same rate."
	},{
		'id' : 10, 'name': 'Section 194D - TDS on insurance comission', 'tds_percentage' : 5, 'amount': 15000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 15,000 then TDS will be applicable @ 5 %."
	},{
		'id' : 11, 'name': 'Section 194H - Commission or Brokerage', 'tds_percentage' : 5, 'amount': 15000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 15,000 then TDS will be applicable @ 5%."
	},{
		'id' : 12, 'name': 'Section 194I(a) - Rent on Plant & Machinery', 'tds_percentage' : 2, 'amount': 240000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 2,40,000 then TDS will be applicable @ 2% in case of Plant& machinery and 10 % in case of land & building or furniture & fitting."
	},{
		'id' : 13, 'name': 'Section 194I(b) - Rent on Land & building or Furniture & Fitting', 'tds_percentage' : 10, 'amount': 240000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 2,40,000 then TDS will be applicable @ 2% in case of Plant& machinery and 10 % in case of land & building or furniture & fitting."
	},{
		'id' : 14, 'name': 'Section 194IA - Payment on transfer of certain Immovable Property other than agricultural land', 'tds_percentage' : 1, 'amount': 5000000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. is Rs. 50,00,000 or more then TDS will be applicable @ 1 %."
	},{
		'id' : 15, 'name': 'Section 194IB - Rent Payment to Landlord by Individuals', 'tds_percentage' : 5, 'amount': 50000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "The rate of tax is 5% when the payment exceeds Rs. 50,000 and the landlord's PAN is given."
	},{
		'id' : 16, 'name': 'Section 194J - Fees for Professional Services / Royalty etc. (Normally in all cases)', 'tds_percentage' : 10, 'amount': 30000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 30,000 then TDS will be applicable @ 10 %."
	},{
		'id' : 17, 'name': 'Section 194J - Fees for technical services, Fees to Call centre operator', 'tds_percentage' : 2, 'amount': 30000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If gross payment to the party during the F.Y. exceeds Rs. 30,000 then TDS will be applicable @ 2%."
	},{
		'id' : 18, 'name': 'Section 194K - TDS on income from mutual fund units (Dividend income)', 'tds_percentage' : 10, 'amount': 5000,  'pan_available': true,
		'pan_not_percent' : 20, 'others': false, other_percetage: 0,  "message" : "If dividend amount during the F.Y. exceeds Rs. 5,000 then TDS will be applicable @ 10%. No TDS to be deducted on Income from Capital Gains on sale of MFs"
	},{
		'id' : 19, 'name': 'Section 194O - TDS on Payment by E-commerce Operator to E-commerce participant', 'tds_percentage' : 1, 'amount': 500000 ,  'pan_available': true,
		'pan_not_percent' : 5, 'others': false, other_percetage: 0,  "message" : "If sale of goods or provision of services during the F.Y. exceeds Rs. 5,00,000 then TDS will be applicable @ 1 %."
	}];	

    $scope.panDetails = ['Yes', 'No'];
	$scope.otherStatus = function(status){
		$scope.tdsDetailsArray[$scope.currentIndex].others = status;
		$scope.checkedOthers = status;
	};
	$scope.changeTDS=function(index){
		$scope.currentIndex = index;
		$scope.checkedOthers = false;
		$scope.finalResult = 0;
		$scope.tds_amount = 0;
		$scope.tds_amount_num = 0
	};
	$scope.changeValueForRange = function(){
		if(isNaN($scope.tds_amount) == true){
			$scope.tds_amount = $scope.tds_amount_num ;
		} else{
			$scope.tds_amount_num = $scope.tds_amount;
		}
	};
}]);

var elmSite = angular.module('elmSite', ['calculatorApp']);


