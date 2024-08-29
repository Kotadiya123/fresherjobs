/**
 * wordgame Controller
 */

var apyApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
apyApp.filter('customcurrency', function() {
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
apyApp.filter('newcustomcurrency', function() {
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
apyApp.controller('apyController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
	
		


	
	/*****SIP Calculator*/
	

	$scope.currentCalculatorId=1;
	$scope.CalculatorName="Atal Pension Yojana Calculator";
	$scope.sipStep=1;
      $scope.goal_amount=2000;
   $scope.price = [5000,4000,3000,2000,1000];
	/**Blanck alert*****/
$scope.activePrice=2000;
$scope.changeprice=function(val){
   $scope.activePrice=val;
      $scope.goal_amount=val;
   };
	
	
///pie chart setting
		
$scope.apy_details ={
      "18": {
         "1000": {
            "monthly": 42,
            "qtrly": 125,
            "hlfyrly": 248,
            "yrly": 496
         },
         "2000": {
            "monthly": 84,
            "qtrly": 250,
            "hlfyrly": 496,
            "yrly": 992
         },
         "3000": {
            "monthly": 126,
            "qtrly": 376,
            "hlfyrly": 744,
            "yrly": 1488
         },
         "4000": {
            "monthly": 168,
            "qtrly": 501,
            "hlfyrly": 991,
            "yrly": 1982
         },
         "5000": {
            "monthly": 210,
            "qtrly": 626,
            "hlfyrly": 1239,
            "yrly": 2478
         }
      },
      "19": {
         "1000": {
            "monthly": 46,
            "qtrly": 137,
            "hlfyrly": 271,
            "yrly": 542
         },
         "2000": {
            "monthly": 92,
            "qtrly": 274,
            "hlfyrly": 543,
            "yrly": 1086
         },
         "3000": {
            "monthly": 138,
            "qtrly": 411,
            "hlfyrly": 814,
            "yrly": 1628
         },
         "4000": {
            "monthly": 183,
            "qtrly": 545,
            "hlfyrly": 1080,
            "yrly": 2160
         },
         "5000": {
            "monthly": 228,
            "qtrly": 679,
            "hlfyrly": 1346,
            "yrly": 2692
         }
      },
      "20": {
         "1000": {
            "monthly": 50,
            "qtrly": 149,
            "hlfyrly": 295,
            "yrly": 590
         },
         "2000": {
            "monthly": 100,
            "qtrly": 298,
            "hlfyrly": 590,
            "yrly": 1180
         },
         "3000": {
            "monthly": 150,
            "qtrly": 447,
            "hlfyrly": 885,
            "yrly": 1770
         },
         "4000": {
            "monthly": 198,
            "qtrly": 590,
            "hlfyrly": 1169,
            "yrly": 2338
         },
         "5000": {
            "monthly": 248,
            "qtrly": 739,
            "hlfyrly": 1464,
            "yrly": 2928
         }
      },
      "21": {
         "1000": {
            "monthly": 54,
            "qtrly": 161,
            "hlfyrly": 319,
            "yrly": 638
         },
         "2000": {
            "monthly": 108,
            "qtrly": 322,
            "hlfyrly": 637,
            "yrly": 1274
         },
         "3000": {
            "monthly": 162,
            "qtrly": 483,
            "hlfyrly": 956,
            "yrly": 1912
         },
         "4000": {
            "monthly": 215,
            "qtrly": 641,
            "hlfyrly": 1269,
            "yrly": 2538
         },
         "5000": {
            "monthly": 269,
            "qtrly": 802,
            "hlfyrly": 1588,
            "yrly": 3176
         }
      },
      "22": {
         "1000": {
            "monthly": 59,
            "qtrly": 176,
            "hlfyrly": 348,
            "yrly": 696
         },
         "2000": {
            "monthly": 117,
            "qtrly": 349,
            "hlfyrly": 690,
            "yrly": 1380
         },
         "3000": {
            "monthly": 177,
            "qtrly": 527,
            "hlfyrly": 1045,
            "yrly": 2090
         },
         "4000": {
            "monthly": 234,
            "qtrly": 697,
            "hlfyrly": 1381,
            "yrly": 2762
         },
         "5000": {
            "monthly": 292,
            "qtrly": 870,
            "hlfyrly": 1723,
            "yrly": 3446
         }
      },
      "23": {
         "1000": {
            "monthly": 64,
            "qtrly": 191,
            "hlfyrly": 378,
            "yrly": 756
         },
         "2000": {
            "monthly": 127,
            "qtrly": 378,
            "hlfyrly": 749,
            "yrly": 1498
         },
         "3000": {
            "monthly": 192,
            "qtrly": 572,
            "hlfyrly": 1133,
            "yrly": 2266
         },
         "4000": {
            "monthly": 254,
            "qtrly": 757,
            "hlfyrly": 1499,
            "yrly": 2998
         },
         "5000": {
            "monthly": 318,
            "qtrly": 948,
            "hlfyrly": 1877,
            "yrly": 3754
         }
      },
      "24": {
         "1000": {
            "monthly": 70,
            "qtrly": 209,
            "hlfyrly": 413,
            "yrly": 826
         },
         "2000": {
            "monthly": 139,
            "qtrly": 414,
            "hlfyrly": 820,
            "yrly": 1640
         },
         "3000": {
            "monthly": 208,
            "qtrly": 620,
            "hlfyrly": 1228,
            "yrly": 2456
         },
         "4000": {
            "monthly": 277,
            "qtrly": 826,
            "hlfyrly": 1635,
            "yrly": 3270
         },
         "5000": {
            "monthly": 346,
            "qtrly": 1031,
            "hlfyrly": 2042,
            "yrly": 4084
         }
      },
      "25": {
         "1000": {
            "monthly": 76,
            "qtrly": 226,
            "hlfyrly": 449,
            "yrly": 898
         },
         "2000": {
            "monthly": 151,
            "qtrly": 450,
            "hlfyrly": 891,
            "yrly": 1782
         },
         "3000": {
            "monthly": 226,
            "qtrly": 674,
            "hlfyrly": 1334,
            "yrly": 2668
         },
         "4000": {
            "monthly": 301,
            "qtrly": 897,
            "hlfyrly": 1776,
            "yrly": 3552
         },
         "5000": {
            "monthly": 376,
            "qtrly": 1121,
            "hlfyrly": 2219,
            "yrly": 4438
         }
      },
      "26": {
         "1000": {
            "monthly": 82,
            "qtrly": 244,
            "hlfyrly": 484,
            "yrly": 968
         },
         "2000": {
            "monthly": 164,
            "qtrly": 489,
            "hlfyrly": 968,
            "yrly": 1936
         },
         "3000": {
            "monthly": 246,
            "qtrly": 733,
            "hlfyrly": 1452,
            "yrly": 2904
         },
         "4000": {
            "monthly": 327,
            "qtrly": 975,
            "hlfyrly": 1930,
            "yrly": 3860
         },
         "5000": {
            "monthly": 409,
            "qtrly": 1219,
            "hlfyrly": 2414,
            "yrly": 4828
         }
      },
      "27": {
         "1000": {
            "monthly": 90,
            "qtrly": 268,
            "hlfyrly": 531,
            "yrly": 1062
         },
         "2000": {
            "monthly": 178,
            "qtrly": 530,
            "hlfyrly": 1050,
            "yrly": 2100
         },
         "3000": {
            "monthly": 268,
            "qtrly": 799,
            "hlfyrly": 1582,
            "yrly": 3164
         },
         "4000": {
            "monthly": 356,
            "qtrly": 1061,
            "hlfyrly": 2101,
            "yrly": 4202
         },
         "5000": {
            "monthly": 446,
            "qtrly": 1329,
            "hlfyrly": 2632,
            "yrly": 5264
         }
      },
      "28": {
         "1000": {
            "monthly": 97,
            "qtrly": 289,
            "hlfyrly": 572,
            "yrly": 1144
         },
         "2000": {
            "monthly": 194,
            "qtrly": 578,
            "hlfyrly": 1145,
            "yrly": 2290
         },
         "3000": {
            "monthly": 318,
            "qtrly": 948,
            "hlfyrly": 1877,
            "yrly": 3754
         },
         "4000": {
            "monthly": 388,
            "qtrly": 1156,
            "hlfyrly": 2290,
            "yrly": 4580
         },
         "5000": {
            "monthly": 485,
            "qtrly": 1445,
            "hlfyrly": 2862,
            "yrly": 5724
         }
      },
      "29": {
         "1000": {
            "monthly": 106,
            "qtrly": 316,
            "hlfyrly": 626,
            "yrly": 1252
         },
         "2000": {
            "monthly": 212,
            "qtrly": 632,
            "hlfyrly": 1251,
            "yrly": 2502
         },
         "3000": {
            "monthly": 318,
            "qtrly": 948,
            "hlfyrly": 1877,
            "yrly": 3754
         },
         "4000": {
            "monthly": 423,
            "qtrly": 1261,
            "hlfyrly": 2496,
            "yrly": 4992
         },
         "5000": {
            "monthly": 529,
            "qtrly": 1577,
            "hlfyrly": 3122,
            "yrly": 6244
         }
      },
      "30": {
         "1000": {
            "monthly": 116,
            "qtrly": 346,
            "hlfyrly": 685,
            "yrly": 1370
         },
         "2000": {
            "monthly": 231,
            "qtrly": 688,
            "hlfyrly": 1363,
            "yrly": 2726
         },
         "3000": {
            "monthly": 347,
            "qtrly": 1034,
            "hlfyrly": 2048,
            "yrly": 4096
         },
         "4000": {
            "monthly": 462,
            "qtrly": 1377,
            "hlfyrly": 2727,
            "yrly": 5454
         },
         "5000": {
            "monthly": 577,
            "qtrly": 1720,
            "hlfyrly": 3405,
            "yrly": 6810
         }
      },
      "31": {
         "1000": {
            "monthly": 126,
            "qtrly": 376,
            "hlfyrly": 744,
            "yrly": 1488
         },
         "2000": {
            "monthly": 252,
            "qtrly": 751,
            "hlfyrly": 1487,
            "yrly": 2974
         },
         "3000": {
            "monthly": 379,
            "qtrly": 1129,
            "hlfyrly": 2237,
            "yrly": 4474
         },
         "4000": {
            "monthly": 504,
            "qtrly": 1502,
            "hlfyrly": 2974,
            "yrly": 5948
         },
         "5000": {
            "monthly": 630,
            "qtrly": 1878,
            "hlfyrly": 3718,
            "yrly": 7436
         }
      },
      "32": {
         "1000": {
            "monthly": 138,
            "qtrly": 411,
            "hlfyrly": 814,
            "yrly": 1628
         },
         "2000": {
            "monthly": 276,
            "qtrly": 823,
            "hlfyrly": 1629,
            "yrly": 3258
         },
         "3000": {
            "monthly": 414,
            "qtrly": 1234,
            "hlfyrly": 2443,
            "yrly": 4886
         },
         "4000": {
            "monthly": 551,
            "qtrly": 1642,
            "hlfyrly": 3252,
            "yrly": 6504
         },
         "5000": {
            "monthly": 689,
            "qtrly": 2053,
            "hlfyrly": 4066,
            "yrly": 8132
         }
      },
      "33": {
         "1000": {
            "monthly": 151,
            "qtrly": 450,
            "hlfyrly": 891,
            "yrly": 1782
         },
         "2000": {
            "monthly": 302,
            "qtrly": 900,
            "hlfyrly": 1782,
            "yrly": 3564
         },
         "3000": {
            "monthly": 453,
            "qtrly": 1350,
            "hlfyrly": 2673,
            "yrly": 5346
         },
         "4000": {
            "monthly": 602,
            "qtrly": 1794,
            "hlfyrly": 3553,
            "yrly": 7106
         },
         "5000": {
            "monthly": 752,
            "qtrly": 2241,
            "hlfyrly": 4438,
            "yrly": 8876
         }
      },
      "34": {
         "1000": {
            "monthly": 165,
            "qtrly": 492,
            "hlfyrly": 974,
            "yrly": 1948
         },
         "2000": {
            "monthly": 330,
            "qtrly": 983,
            "hlfyrly": 1948,
            "yrly": 3896
         },
         "3000": {
            "monthly": 495,
            "qtrly": 1475,
            "hlfyrly": 2921,
            "yrly": 5842
         },
         "4000": {
            "monthly": 659,
            "qtrly": 1964,
            "hlfyrly": 3889,
            "yrly": 7778
         },
         "5000": {
            "monthly": 824,
            "qtrly": 2456,
            "hlfyrly": 4863,
            "yrly": 9726
         }
      },
      "35": {
         "1000": {
            "monthly": 181,
            "qtrly": 539,
            "hlfyrly": 1068,
            "yrly": 2136
         },
         "2000": {
            "monthly": 362,
            "qtrly": 1079,
            "hlfyrly": 2136,
            "yrly": 4272
         },
         "3000": {
            "monthly": 543,
            "qtrly": 1618,
            "hlfyrly": 3205,
            "yrly": 6410
         },
         "4000": {
            "monthly": 722,
            "qtrly": 2152,
            "hlfyrly": 4261,
            "yrly": 8522
         },
         "5000": {
            "monthly": 902,
            "qtrly": 2688,
            "hlfyrly": 5323,
            "yrly": 10646
         }
      },
      "36": {
         "1000": {
            "monthly": 198,
            "qtrly": 590,
            "hlfyrly": 1169,
            "yrly": 2136
         },
         "2000": {
            "monthly": 396,
            "qtrly": 1180,
            "hlfyrly": 2337,
            "yrly": 4674
         },
         "3000": {
            "monthly": 594,
            "qtrly": 1770,
            "hlfyrly": 3506,
            "yrly": 7012
         },
         "4000": {
            "monthly": 792,
            "qtrly": 2360,
            "hlfyrly": 4674,
            "yrly": 9348
         },
         "5000": {
            "monthly": 990,
            "qtrly": 2950,
            "hlfyrly": 5843,
            "yrly": 11686
         }
      },
      "37": {
         "1000": {
            "monthly": 218,
            "qtrly": 650,
            "hlfyrly": 1287,
            "yrly": 2574
         },
         "2000": {
            "monthly": 436,
            "qtrly": 1299,
            "hlfyrly": 2573,
            "yrly": 5146
         },
         "3000": {
            "monthly": 654,
            "qtrly": 1949,
            "hlfyrly": 3860,
            "yrly": 7720
         },
         "4000": {
            "monthly": 870,
            "qtrly": 2593,
            "hlfyrly": 5134,
            "yrly": 10268
         },
         "5000": {
            "monthly": 1087,
            "qtrly": 3239,
            "hlfyrly": 6415,
            "yrly": 12830
         }
      },
      "38": {
         "1000": {
            "monthly": 240,
            "qtrly": 715,
            "hlfyrly": 1416,
            "yrly": 2832
         },
         "2000": {
            "monthly": 480,
            "qtrly": 1430,
            "hlfyrly": 2883,
            "yrly": 5766
         },
         "3000": {
            "monthly": 720,
            "qtrly": 2146,
            "hlfyrly": 4249,
            "yrly": 8498
         },
         "4000": {
            "monthly": 957,
            "qtrly": 2852,
            "hlfyrly": 5648,
            "yrly": 11296
         },
         "5000": {
            "monthly": 1196,
            "qtrly": 3564,
            "hlfyrly": 7058,
            "yrly": 14116
         }
      },
      "39": {
         "1000": {
            "monthly": 264,
            "qtrly": 787,
            "hlfyrly": 1558,
            "yrly": 3116
         },
         "2000": {
            "monthly": 528,
            "qtrly": 1574,
            "hlfyrly": 3116,
            "yrly": 6232
         },
         "3000": {
            "monthly": 792,
            "qtrly": 2360,
            "hlfyrly": 4674,
            "yrly": 9348
         },
         "4000": {
            "monthly": 1054,
            "qtrly": 3141,
            "hlfyrly": 6220,
            "yrly": 12440
         },
         "5000": {
            "monthly": 1318,
            "qtrly": 3928,
            "hlfyrly": 7778,
            "yrly": 15556
         }
      }
   };

   $scope.apy_total_amount = {"1000":"170000","2000":"340000","3000":"510000","4000":"680000","5000":"850000"}

	/************APY Calculator***********/
		$scope.current_age = 25;
		$scope.goal_amount = 2000;
		$scope.goal_age = 60;
	/***********End APY Calculator************/
   if(isNaN($scope.monthlyinvestment) == true){
         $scope.monthlyinvestment = 0;
      }
      if(isNaN($scope.quaterlyinvestment) == true){
         $scope.quaterlyinvestment = 0;
      }
       if(isNaN($scope.halfYearlyinvestment) == true){
         $scope.halfYearlyinvestment = 0;
      }
      if(isNaN($scope.yearlyinvestment) == true){
         $scope.yearlyinvestment = 0;
      }
       if(isNaN($scope.nomineeprice) == true){
         $scope.nomineeprice = 0;
      }
   $scope.apycalculateSip = function()
   {

      $scope.monthlyinvestment = $scope.apy_details[$scope.current_age][$scope.goal_amount].monthly;
      
      $scope.quaterlyinvestment = $scope.apy_details[$scope.current_age][$scope.goal_amount].qtrly;
      
      $scope.halfYearlyinvestment = $scope.apy_details[$scope.current_age][$scope.goal_amount].hlfyrly;
     
      $scope.yearlyinvestment = $scope.apy_details[$scope.current_age][$scope.goal_amount].yrly;
      
      $scope.nomineeprice = $scope.apy_total_amount[$scope.goal_amount];
      
      $scope.return_age = 60;
      
      $scope.leftYears = $scope.return_age - $scope.current_age;
     
   }

   $scope.priceSlider = {
        value: 1,
      options_amt: {
         floor: 1000,
         ceil: 5000,
         step: 1000,
         showSelectionBar: true
      },  
      options_yrs: {
            floor: 18,
            ceil: 39,
            showSelectionBar: true,
            onChange: function(){
               $scope.manageAge();
            }
    
        },
     }

     $scope.showErrorYear = false;

     $scope.manageAge = function(){
     $scope.showErrorYear = false;
      if($scope.current_age > 39){
         $scope.current_age = 39;
      }
      if($scope.current_age < 18 || $scope.current_age === '' || $scope.current_age === '0' || isNaN($scope.current_age) == true){
         $scope.showErrorYear = true
      }
     }
	
}]);

var elmSite = angular.module('elmSite', ['calculatorApp']);

