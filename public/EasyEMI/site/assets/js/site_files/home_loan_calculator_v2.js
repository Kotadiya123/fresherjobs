/**
 * wordgame Controller
 */

 Date.isLeapYear = function (year) { 
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
      };

      Date.getDaysInMonth = function (year, month) {
      return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
      };

      Date.prototype.isLeapYear = function () { 
      return Date.isLeapYear(this.getFullYear()); 
      };

      Date.prototype.getDaysInMonth = function () { 
      return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
      };

      Date.prototype.addMonths = function (value) {
      var n = this.getDate();
      this.setDate(1);
      this.setMonth(this.getMonth() + value);
      this.setDate(Math.min(n, this.getDaysInMonth()));
      return this;
      };
      

var homeLoancalculatorApp = angular.module('calculatorApp', ['ngAnimate', 'ngSanitize','rzModule','chart.js','zingchart-angularjs']);
homeLoancalculatorApp.filter('customcurrency', function() {
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
homeLoancalculatorApp.filter('newcustomcurrency', function() {
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
homeLoancalculatorApp.controller('homeLoancalculatorController',['$scope', '$http','$log', '$sce','$window','$timeout',function ($scope, $http,$log, $sce,$window,$timeout){
  $scope.totalHomeLoanAmount = 5000000;
  $scope.totalHomeLoanAmount_num = 5000000;
  $scope.ownPercentage = 10;
  $scope.ownPercentage_slide = 10;
  $scope.homeLoanAmount=$scope.totalHomeLoanAmount-($scope.totalHomeLoanAmount * ($scope.ownPercentage/100));
  $scope.homeLoanAmount_num = $scope.homeLoanAmount;
  $scope.inflationRate = 6;
  $scope.inflationRate_slide = 6;
  $scope.difference_year = 0;
  $scope.delayLoanAmount = 5000000;

  $scope.isNow = true;
  
  $scope.currentCalculatorId=1;
  $scope.CalculatorName="Home Loan Calculator";
  $scope.sipStep=1;
  
  /**Blanck alert*****/
  $scope.changeprice=function(val){
    $scope.activePrice=val;
    $scope.homeLoanAmount=val;
                $scope.currencyGoalValue =  $scope.inrcurrencyFormat(val);
  };
  
  ///pie chart setting
  $scope.priceSlider = {
        value: 1,
    
      options_costDelay: {
        floor: 1,
        ceil: 14
      },
        options_invt: {
            floor: 10000,
            ceil: 200000000
      },
      options_homeLoanAmount: {
        floor: 500000,
        ceil: 100000000,
        showSelectionBar: true,
        onChange: function() {
              $scope.changehomeLoanRateTenure();
        }
      },
    options_yrs: {
            floor: 1,
            ceil: 30,
            showSelectionBar: true,
            onChange: function() {
                 $scope.changeYearSlider();
            }
        },
    options_percnt: {
            floor:1,
            ceil: 25,
            showSelectionBar: true,
            step: 0.01,
            precision: 2,
      onChange: function() {
                 $scope.changehomeLoanRateSlider();
            }
        },
     options_own_percnt: {
          floor:1,
          ceil: 25,
          showSelectionBar: true,
          step: 0.01,
          precision: 2,
      onChange: function() {
                $scope.changeLoanAmount();
            }
      },
      options_inflationRate: {
        floor:1,
        ceil: 25,
        showSelectionBar: true,
        step: 0.01,
        precision: 2,
        onChange: function() {
                  $scope.inflationLoanAmount();
              }
    }   
    
  };
  //bar char setting
  
  $scope.yearArray = [];
  $scope.showAll = false;
  $scope.loadingStatus=false;
  $scope.currentStep = 1;
  /***pie Chart**********/
  $scope.labels = ["Total Interest","Principal","Total Amount Payable"];
  $scope.datachart = [0, 0, 0];
  $scope.hchartcolors= ['#0CC490', '#005AC6', '#FC890D'];
  $scope.barlabels = [];
  $scope.barseries = ['Principal', 'Interest'];
$scope.chartcolors= [ '#FDB45C', '#46BFBD'];
  $scope.bardata = [
    [],
    []
  ];  
    
  $scope.presentValueHouse = "";
  $scope.presentValueHouseUnit="";
  $scope.unitFactor=100000;
  $scope.growthRateOfRealEstate = "";
  $scope.numberYearGoal = "";
  $scope.loanTaken=false;
 $scope.futureValueOfHouse ="";

  $scope.homeLoanFunding = "";
  //$scope.homeLoanAmount ="";
  $scope.downPayment = "";
  $scope.downPaymentAmount ="";
  
  
  
  $scope.homeLoanRate = 8.5;
  $scope.homeLoanRate1=$scope.homeLoanRate;
  $scope.r = "";
  $scope.homeLoanTenure = 15;
   $scope.homeLoanTenure1= $scope.homeLoanTenure;
  $scope.homeLoanTenureMonth = "";
  $scope.homeLoanEmi = "";

   /********/

    $scope.changeTimeTaken=function(){
    $scope.fristsectionstep=1;
  };
  /***/
  const d = new Date();
  $scope.currentYear = d.getFullYear();
  $scope.selectedYear = $scope.currentYear;
  $scope.latsetYear = d.getFullYear() + 1;
  $scope.getYearArray = function(){
  let lastYear = $scope.currentYear+4;
   for(let i = $scope.currentYear; i <= lastYear; i++){
      $scope.yearArray.push(i)
   }
  };

  $scope.getYearArray();

  $scope.changeSelectYear = function(value){
    $scope.selectedYear = parseInt(value)
    if($scope.selectedYear === $scope.currentYear){
      $scope.startDate = new Date(d.getFullYear(), d.getMonth()+1, 1);
      $scope.difference_year = 0;
      $scope.isNow = true;
    } else{
      $scope.startDate = new Date($scope.selectedYear, 0, 1);
      $scope.difference_year = $scope.selectedYear - $scope.currentYear;
      $scope.isNow = false;
    }
    $scope.inflationLoanAmount();
    $scope.changehomeLoanRateTenure();
    $scope.eachMonthlyDistribution();
  };


    $scope.series = ['Now', 'After '+$scope.numberYearGoal+'Yr.'];

     $scope.data = [
      [{
        x: 0,
        y: 0,
        r: 20
      }],
      [{
        x: 5,
        y: 5,
        r:50
      }],
      [{
        x: 10,
        y: 10,
        r:0
      }]
    ];


       $scope.options = {
      scales: {
        yAxes: [
          {
            
            display: false,
            
          },
         
        ],
        xAxes:[{
          display: false,
          scaleLabel: {
          display: false,
          labelString: "Number of Years for Goal",
          fontColor: "green"
        }
      }]
      }
    };


  $scope.monthArr=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

  $scope.secondsectionstep=0;
 /******change Step for******/
  $scope.changeStep = function (st) {
  $scope.loadingStatus=true;
  $scope.gotoElement('top');
  $timeout(function(){ 
  $scope.loadingStatus=false; 
  $scope.currentStep = st;
  
  if(st==2){
    $scope.secondsectionstep=1;
  }
  
  },500);
  //$scope.gotoAnchor('start');
   
  };

  $scope.changeSecond=function(secondsectionstep){
    $scope.secondsectionstep=secondsectionstep+1;
    //$scope.gotoAnchor('step'+(6+secondsectionstep));
    $scope.changehomeLoanRateTenure();
  };

  $scope.changeFristSectionStep=function(step,anchorId){
    $scope.fristsectionstep=step;
    //$scope.gotoAnchor(anchorId);
  };

  $scope.changeTimeTaken=function(){
   
    //$scope.fristsectionstep=1;
    if(!$scope.loanTaken){
      $scope.numberYearGoal=0;
      $scope.growthRateOfRealEstate=0;
      $scope.changeParameter(4);
    }else{
       $scope.growthRateOfRealEstate = "";
       $scope.numberYearGoal = "";
       $scope.changeParameter(4);
    }
  };
  

  $scope.changeYear=function(yr){
    
    $scope.numberYearGoal=yr;
    if($scope.fristsectionstep>3){
    $scope.changeParameter(4);
    }else{
       $scope.changeParameter(4);
    }
   // $scope.gotoAnchor('step1');
    
  };


  $scope.changeParameter = function (st){
    
    
    $scope.presentValueHouse=$scope.presentValueHouseUnit*$scope.unitFactor;
    $scope.fristsectionstep=st;
    
   if($scope.loanTaken){
      $scope.futureValueOfHouse = Math.round($scope.presentValueHouse * (Math.pow(1 + ($scope.growthRateOfRealEstate / 100), $scope.numberYearGoal)));
   }else{
     $scope.futureValueOfHouse = $scope.presentValueHouse;
   }
  //$scope.changedownPaymentAmount();
    $scope.homeLoanAmount = Math.round(($scope.futureValueOfHouse * $scope.homeLoanFunding) / 100);
    
    $scope.downPaymentAmount = Math.round(($scope.futureValueOfHouse * $scope.downPayment) / 100);
  if($scope.downPaymentAmount==0){
    $scope.downPaymentAmount="";
  }
  if(st<=2){
  //$scope.gotoAnchor('step1'); 
  }else{
  //$scope.gotoAnchor('step1');
  }
    $scope.changehomeLoanRateTenure();
   
  };


   /***** changehomeLoanAmount *****/
  $scope.changehomeLoanAmount = function (){
    if(parseInt($scope.futureValueOfHouse)>0){
    $scope.homeLoanFunding = Math.round(($scope.homeLoanAmount / $scope.futureValueOfHouse) * 100);
    $scope.downPayment = Math.round(100 - $scope.homeLoanFunding);
    $scope.downPaymentAmount = Math.round(($scope.futureValueOfHouse * $scope.downPayment) / 100);
    if($scope.downPaymentAmount==0){
      $scope.downPaymentAmount="";
    }
    }
  //$scope.changepresentValueOfCurrentHouse();
  //$scope.changemonthlyInvestments();
  };

        /*****************************////

      
  
  /***********End Sip Calculator************/
  
  /************Inflation Calculator Calculator***********/
   $scope.changedownPayment = function (st) {
    $scope.fristsectionstep=st;
    $scope.homeLoanFunding = Math.round(100 - $scope.downPayment);
  
    $scope.homeLoanAmount = Math.round(($scope.futureValueOfHouse * $scope.homeLoanFunding) / 100);
    $scope.downPaymentAmount = Math.round(($scope.futureValueOfHouse * $scope.downPayment) / 100);
  if($scope.downPaymentAmount==0){
    $scope.downPaymentAmount="";
  }
    $scope.changehomeLoanRateTenure();
    //$scope.changepresentValueOfCurrentHouse();
  };
  
   $scope.changedownPaymentAmount = function () {
    
    $scope.downPayment = Math.round(($scope.downPaymentAmount / $scope.futureValueOfHouse) * 100);
    $scope.homeLoanFunding = Math.round(100 - $scope.downPayment);
    $scope.homeLoanAmount = Math.round(($scope.futureValueOfHouse * $scope.homeLoanFunding) / 100);
   
    $scope.changehomeLoanRateTenure();
  // $scope.changepresentValueOfCurrentHouse();
  };
  $scope.changeHomeValue = function(){
    if($scope.isNow === true){
      $scope.homeLoanAmount=$scope.totalHomeLoanAmount-($scope.totalHomeLoanAmount * ($scope.ownPercentage/100));
      $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    } else if($scope.isNow === false){
      $scope.delayLoanAmount = Math.round($scope.totalHomeLoanAmount * (Math.pow(1 + ($scope.inflationRate/100), $scope.difference_year)));
      $scope.homeLoanAmount=$scope.delayLoanAmount-($scope.delayLoanAmount * ($scope.ownPercentage/100));
      $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    }
  };
    $scope.showErrorOwnPercent = false;
    $scope.showErrorRate = false;
    $scope.showErrorYear = false;
    $scope.showErrorInflation = false;
  /************Home Loan Calculator***********/
  $scope.changehomeLoanRateTenure=function(){
    $scope.showError = false;
    $scope.showErrorOwnPercent = false;
    $scope.showErrorRate = false;
    $scope.showErrorYear = false;
    $scope.showErrorInflation = false;
    if($scope.totalHomeLoanAmount === 0 || $scope.totalHomeLoanAmount === '' || $scope.totalHomeLoanAmount < 300000){
      $scope.totalHomeLoanAmount = 300000;
    }
    $scope.totalHomeLoanAmount_num = $scope.totalHomeLoanAmount;
    if($scope.ownPercentage > 25){
      $scope.ownPercentage = 25;
    }else if($scope.ownPercentage === '' || $scope.ownPercentage === 0 || isNaN($scope.ownPercentage) == true || $scope.ownPercentage === null || $scope.ownPercentage < 1) {
      //$scope.ownPercentage  = $scope.ownPercentage < 1 ? 0 : $scope.ownPercentage;
      $scope.showErrorOwnPercent = true;
    }else if(typeof $scope.ownPercentage == 'string' && $scope.ownPercentage.indexOf(".") !== -1 && $scope.ownPercentage.length > 4 && parseInt($scope.ownPercentage) > 0){
      $scope.ownPercentage = $scope.ownPercentage.slice(0, $scope.ownPercentage.indexOf(".")+3);
      $scope.showErrorOwnPercent = false;
    }
   
    if($scope.homeLoanTenure > 30){
      $scope.homeLoanTenure = 30;
    } else if($scope.homeLoanTenure === '' || $scope.homeLoanTenure === '0' || isNaN($scope.homeLoanTenure)== true || $scope.homeLoanTenure < 1){
      //$scope.homeLoanTenure = 1;
     $scope.showErrorYear = true;

      
    }
    if($scope.homeLoanRate > 25){
      $scope.homeLoanRate = 25;
    } else if($scope.homeLoanRate === '' || $scope.homeLoanRate === '0' || isNaN($scope.homeLoanRate)== true || $scope.homeLoanRate < 1){
      $scope.showErrorRate  = true;
    } else if(typeof $scope.homeLoanRate == 'string' && $scope.homeLoanRate.indexOf(".") !== -1 && $scope.homeLoanRate.length > 4 && parseInt($scope.homeLoanRate) > 0){
      $scope.homeLoanRate = $scope.homeLoanRate.slice(0, $scope.homeLoanRate.indexOf(".") + 3);
      $scope.showErrorRate  = false;
    }
    if($scope.homeLoanAmount === 0 || $scope.homeLoanAmount === '' || $scope.homeLoanAmount < 300000){
      $scope.homeLoanAmount = 300000;
    }
    if($scope.inflationRate > 25){
      $scope.inflationRate = 25;
    }else if($scope.inflationRate === '' || $scope.inflationRate === 0 || isNaN($scope.inflationRate) == true || $scope.inflationRate === null || $scope.inflationRate < 1){
      $scope.showErrorInflation = true;
    } else if(typeof $scope.inflationRate == 'string' && $scope.inflationRate.indexOf(".") !== -1 && $scope.inflationRate.length > 4 && parseInt($scope.inflationRate) > 0){
      $scope.inflationRate = $scope.inflationRate.slice(0, $scope.inflationRate.indexOf(".") + 3);
      $scope.showErrorInflation = false;
    }
    $scope.changeHomeValue();
    $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    $scope.homeLoanRate1=($scope.homeLoanRate < 1 ? 0 : $scope.homeLoanRate);
    $scope.homeLoanTenure1=($scope.homeLoanTenure < 1 ? 0 : $scope.homeLoanTenure);
    $scope.ownPercentage_slide = $scope.ownPercentage;
    $scope.inflationRate_slide = $scope.inflationRate;
    $scope.r = (($scope.homeLoanRate < 1 ? 0 : $scope.homeLoanRate) / 12) / 100
    $scope.homeLoanTenureMonth = ($scope.homeLoanTenure < 1 ? 0 : $scope.homeLoanTenure) * 12;
    if ($scope.homeLoanTenureMonth == 0) {
      $scope.homeLoanEmi = $scope.homeLoanAmount;
      return true;
    }
    if ($scope.r == 0) {
      if ($scope.homeLoanTenureMonth > 0) {
        $scope.homeLoanEmi = ($scope.homeLoanAmount / $scope.homeLoanTenureMonth);
      }else {
        $scope.homeLoanEmi = $scope.homeLoanAmount;
      }
      return true;
    }

    $scope.homeLoanEmi = ($scope.homeLoanAmount * $scope.r * (Math.pow(1 + $scope.r, $scope.homeLoanTenureMonth) / ((Math.pow(1 + $scope.r, $scope.homeLoanTenureMonth)) - 1)));
  $scope.calculateEmiForKeyup();
  $scope.eachMonthlyDistribution();
  };
  $scope.showError = false;
  $scope.changeValueForRange = function(){
    if($scope.totalHomeLoanAmount_num !== '' && parseInt($scope.totalHomeLoanAmount_num) >= 500000){
      $scope.totalHomeLoanAmount = parseInt($scope.totalHomeLoanAmount_num);
      $scope.showError = false;
    } else if(isNaN($scope.totalHomeLoanAmount_num) === true){
      $scope.showError = false;
      $scope.totalHomeLoanAmount_num = $scope.totalHomeLoanAmount;
    }  
    else{
      $scope.showError = true;
		  $scope.totalHomeLoanAmount = 500000;
    }
    if(parseInt($scope.totalHomeLoanAmount_num) > 100000000){
      $scope.totalHomeLoanAmount_num = 100000000;
      $scope.totalHomeLoanAmount = 100000000;
    }
    // $scope.homeLoanAmount=$scope.totalHomeLoanAmount-($scope.totalHomeLoanAmount * ($scope.ownPercentage/100));
    // $scope.homeLoanAmount_num = $scope.homeLoanAmount;
   // $scope.changehomeLoanRateTenure();
    $scope.calculateEmiForKeyup();
    $scope.eachMonthlyDistribution();
  };

  $scope.calculateEmiForKeyup = function(){
    if($scope.isNow === true){
      $scope.homeLoanAmount=$scope.totalHomeLoanAmount-($scope.totalHomeLoanAmount * (($scope.ownPercentage < 1 ? 0 : $scope.ownPercentage)/100));
      $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    } else if($scope.isNow === false){
      $scope.delayLoanAmount = Math.round($scope.totalHomeLoanAmount * (Math.pow(1 + ($scope.inflationRate/100), $scope.difference_year)));
      $scope.homeLoanAmount=$scope.delayLoanAmount-($scope.delayLoanAmount * (($scope.ownPercentage < 1 ? 0 : $scope.ownPercentage)/100));
      $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    }
$scope.homeLoanAmount_num = $scope.homeLoanAmount;
    $scope.homeLoanRate1=($scope.homeLoanRate < 1 ? 0 : $scope.homeLoanRate);
    $scope.homeLoanTenure1=($scope.homeLoanTenure < 1 ? 0 : $scope.homeLoanTenure);
    $scope.r = (($scope.homeLoanRate < 1 ? 0 : $scope.homeLoanRate) / 12) / 100
    $scope.homeLoanTenureMonth = ($scope.homeLoanTenure < 1 ? 0 : $scope.homeLoanTenure) * 12;
    if ($scope.homeLoanTenureMonth == 0) {
      $scope.homeLoanEmi = $scope.homeLoanAmount;
      return true;
    }
    if ($scope.r == 0) {
      if ($scope.homeLoanTenureMonth > 0) {
        $scope.homeLoanEmi = ($scope.homeLoanAmount / $scope.homeLoanTenureMonth);
      }else {
        $scope.homeLoanEmi = $scope.homeLoanAmount;
      }
      return true;
    }

    $scope.homeLoanEmi = ($scope.homeLoanAmount * $scope.r * (Math.pow(1 + $scope.r, $scope.homeLoanTenureMonth) / ((Math.pow(1 + $scope.r, $scope.homeLoanTenureMonth)) - 1)));
  
  }
  /***********End Goal SIP Calculator************/

   $scope.changeYearSlider = function () {
   $scope.homeLoanTenure=$scope.homeLoanTenure1;
   $scope.changehomeLoanRateTenure();
  };

   $scope.emiDistribution=[];
  $scope.yearArr=[];
  $scope.totalInterest=0;
  $scope.totalPayment=0;
  $scope.restAmount=$scope.homeLoanAmount;
  var today = new Date();
  $scope.startDate = new Date(today.getFullYear(), today.getMonth()+1, 1);
  $scope.totalPaymentValue=function(){
    //$scope.eachMonthlyDistribution();
    return $scope.totalPayment;
    
  };

  $scope.yearDataArr=[];
  $scope.changehomeLoanRateSlider=function(){
    $scope.homeLoanRate=$scope.homeLoanRate1;
    
    $scope.changehomeLoanAmount()
    $scope.changehomeLoanRateTenure();
  };

      var dataprincipal=[];
      var interest=[];
  $scope.eachMonthlyDistribution=function(){
    
      $scope.totalInterest=0;
      $scope.totalPayment=0;
      var nextDate = $scope.startDate;
      var myDate = new Date(nextDate);
      var year=0;
      var month=0;
      var j=0;
      year=myDate.getFullYear();
      var lastYear=year;
      var j=0;
      $scope.emiDistribution[year]=[];
      
      $scope.yearArr=[];
      $scope.totalInterest=0;
      $scope.totalPayment=0;
      $scope.restAmount=$scope.homeLoanAmount;
      $scope.bardata=[];
      $scope.barlabels=[];
      var arr={month:0,principal:0,interest:0,total:0,outstanding:$scope.homeLoanAmount};
      for(var i=0;i<$scope.homeLoanTenureMonth;i++){
        var arr={month:0,principal:0,interest:0,total:0,outstanding:$scope.restAmount};
        year=myDate.getFullYear();
        month=myDate.getMonth();
        
        arr.month=month+1;
        arr.date=nextDate;
        
        arr.interest=$scope.restAmount*$scope.r;
        arr.principal=($scope.homeLoanEmi-arr.interest);
        arr.total=($scope.homeLoanEmi);
        arr.interest=(arr.interest);
        $scope.totalInterest=$scope.totalInterest+arr.interest;
        if(i>0){
          if(year!=lastYear){
            j=0;
            $scope.emiDistribution[year]=[];
            $scope.yearDataArr[year]=[];
            
            
          }else{
            j++;
          }
          
          
        }
        if(j==0){
          $scope.yearArr.push(year);
          
        }
        
        $scope.restAmount=$scope.restAmount-arr.principal;
        arr.outstanding=($scope.restAmount);
        $scope.emiDistribution[year][j]=(arr);
        
        
        
        lastYear=year;
        nextDate = myDate.addMonths(1);
        
        myDate=new Date(nextDate);
        
        
      }
      $scope.totalPayment=$scope.totalInterest+$scope.homeLoanAmount;
      $scope.datachart=[Math.round($scope.totalInterest),Math.round($scope.homeLoanAmount),Math.round($scope.totalPayment)];
      
      $scope.res=($scope.homeLoanAmount);
      dataprincipal=[];
      interest=[];
      for(var l=0;l<$scope.yearArr.length;l++){
        $scope.barlabels.push($scope.yearArr[l]);
        $scope.yearDataArr[$scope.yearArr[l]]=$scope.sumValue($scope.yearArr[l]);
        dataprincipal.push(Math.round($scope.yearDataArr[$scope.yearArr[l]].principal));
        interest.push(Math.round($scope.yearDataArr[$scope.yearArr[l]].interest));
      }
      $scope.bardata=[dataprincipal,interest];
      
  };

   $scope.res=($scope.homeLoanAmount);
  $scope.sumValue=function(year){
    
    var totalAllArr={principal:0,interest:0,total:0,outstanding:$scope.homeLoanAmount};
    var totalArr=$scope.emiDistribution[year];
    
    
    for(var i=0;i<totalArr.length;i++){
      
      totalAllArr.principal=((totalAllArr.principal) +(totalArr[i].principal));
      totalAllArr.interest=((totalAllArr.interest) +(totalArr[i].interest));
      totalAllArr.total=((totalAllArr.total) +(totalArr[i].total));
      totalAllArr.outstanding=($scope.res-(totalArr[i].principal));
      $scope.res=totalAllArr.outstanding;
    }
    
    return totalAllArr;
  };

   $scope.showYear=0;
  $scope.monthdetails=function(y){
    if($scope.showYear==y){
      $scope.showYear=0;
      return true;
    }
    $scope.showYear=y;
    
  };

  $scope.changeLoanAmount = function(){
    $scope.homeLoanAmount=$scope.totalHomeLoanAmount-($scope.totalHomeLoanAmount * (($scope.ownPercentage < 1 ? 0 : $scope.ownPercentage)/100));
    $scope.homeLoanAmount_num = $scope.homeLoanAmount;
    $scope.ownPercentage = $scope.ownPercentage_slide;
    $scope.changehomeLoanRateTenure();
  };

  $scope.inflationLoanAmount = function(){

    $scope.delayLoanAmount = Math.round($scope.totalHomeLoanAmount * (Math.pow(1 + (($scope.inflationRate < 1 ? 0 : $scope.inflationRate)/100), $scope.difference_year)));
    $scope.inflationRate = $scope.inflationRate_slide;
    $scope.changehomeLoanRateTenure();
  };
  $scope.changeSelectTab = function(status){
    $scope.isNow = status;
    if(status ===  true){
      $scope.startDate = new Date(d.getFullYear(), d.getMonth()+1, 1);
      $scope.selectedYear = d.getFullYear();
    } else{
      $scope.selectedYear = $scope.latsetYear;
      $scope.startDate = new Date($scope.selectedYear, 0, 1);
      $scope.difference_year = $scope.selectedYear - $scope.currentYear;
      $scope.inflationLoanAmount();
    }
    
    $scope.changehomeLoanRateTenure();
    $scope.eachMonthlyDistribution();
  };

  $scope.eachMonthlyDistribution();
  
}]);

function changeDate() {

    $('.datetimepicker').datetimepicker({
        format: "YYYY-MM-DD",
        useCurrent: true
    });
    $('.datetimepicker1').datetimepicker({
        format: 'LT'
    });
}

var elmSite = angular.module('elmSite', ['calculatorApp']);

