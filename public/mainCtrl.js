var array=[];
var array1=[];

var myApp = angular.module ("myApp", ['ngRoute','ui.bootstrap']);      //'ui.bootstrap'
myApp.config (function($routeProvider){
	$routeProvider  
		.when ("/", {
			templateUrl:'login.html',
			controller: 'InterfaceCtrl'
				}) 
          .when ('/home', {
			templateUrl:'home.html',
			controller: 'homeCtrl1'
				})
		 .when ('/orderstatus', {
			templateUrl:'ordersearch.html',
			controller: 'OrderCtrl'
				})
		 .when ('/orderdetails', {
			templateUrl:'orderdetails.html',
			controller: 'OrderDetailsCtrl'
				})
		.when ('/invoicesearch', {
			templateUrl:'invoicesearch.html',
			controller: 'invoicesearchCtrl'
				})
		.when ('/invoicedetails', {
			templateUrl:'invoicedetails.html',
			controller: 'invoiceDetailsCtrl'
				})
				.when ('/logout', {
			templateUrl:'login.html',
			controller: 'InterfaceCtrl'
				})
				.when ('/pwd', {
			templateUrl:'pwdchg.html',
			controller: 'sun'
				});
				
           			
});





myApp.controller("InterfaceCtrl", function($scope, $rootScope, $location , $http ,$window){
	
	$rootScope.fullscreen=true;
	$scope.submit = function(isValid){
		$scope.submitted="true";
		
        var Email = $scope.Email;
		
        var Password = $scope.Password;
		
      var data={ 
	  
	   "Email":Email,
	   "Password":Password
	  }
	  
	  
	  $http.post("http://localhost:7000/authenticateCustomer",data).then(function(response){
		//$http.post("https://"+window.location.hostname+"/authenticateCustomer",data).then(function(response){
			//$window.alert(JSON.stringify(response));
	     if(response.data.output.length!=0){
			 if(response.data.output[0].type == "dealer"){
            //$window.alert("welcome"+response.data.output[0].dealerId);
		     
			$location.path("/home" );
			$rootScope.fullscreen=false;
			$window.localStorage.setItem('storage',JSON.stringify(response.data.output))
			
        }
		 }
    
	    else{
		    
			if(Email != null && Password != null)
		   {
			   $scope.errmsg="Please Verify Your Credentials";
		   }
	    }
	
		});
	};
});


myApp.controller("homeCtrl1", function($scope, $rootScope, $location , $http ,$window){
	
	     array = []; //remove any unwanted data in the array
		 
	 var cDetails=JSON.parse($window.localStorage.getItem('storage'));
	 
	  
	  var Iorder=cDetails[0].dealerId;
			var count =0;
			var order={ 
	                   "dealerId" : Iorder,
	                  
	                     }
	  
	               $http.post("http://localhost:7000/getAllOrdersBySpecifiedId",order).then(function(response){
	//$http.post("https://"+window.location.hostname+"/getAllOrdersBySpecifiedId",order).then(function(response){				 
	                     if(response === null)
		                       {
								   
				                  
				                alert("No Matches found");
							   
							   }                                
    
	                     else{
							         
									  var length = response.data.output.length;
								    
									 if(length != 0 ){
								  for(i=0; i<length; i++){
									 
									   if(response.data.output[i].dealerId == Iorder){ 
										   
										  array.push(response.data.output[i]);
										  				                         
									  } 
									
									  
							   }
									 }
							  
							 								  
							    $scope.orders = array;
							   
		                     
	                         } 
	
		                 });
						 
	
	$scope.selectedOrder = function(order){
		
		array1 = []; //removes any unwanted data in the array1
		console.log(order);
		
		var id = order
		0
		$window.localStorage.setItem('orderID',id);
			
		
		var data={
			"orderId" :id 
		}
		
	               $http.post("http://localhost:7000/getAllProductsBySpecifiedId",data).then(function(response){
//$http.post("https://"+window.location.hostname+"/getAllProductsBySpecifiedId",data).then(function(response){	                

					if(response.data.output.length!=0)
		                       {
				                 
									  var length = response.data.output.length;
								    // alert(length);
								  for(i=0;i<length;i++){
									  if(response.data.output[i].orderId == id){ 
									  
										  array1.push(response.data.output[i]);
										 
									  }
									  
								  }
								  
								  $scope.products = array1;
								
				                   $location.path("/orderdetails");
								 
                               }
    
	                     else{
		                        alert("No Matches found");
	                         } 
	
		                 });

		
	};
	
	
});



myApp.controller("OrderCtrl", function($scope, $http, $window, $location, $rootScope, $filter, selectedCustomerOrderTypesFilter){
	 
	 //pagination
	 $scope.filteredproducts = []
  ,$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  $scope.products = [];
  $scope.orderByDate = [];
  //$scope.loading = true;
  
	var loadOrder = function(){
		var length1 = array.length;
		//alert(length1);
		$scope.order = array;
		$scope.order1 =$scope.order ;
		 //console.log($filter('orderBy')($scope.order,'-orderDate'));
		 $scope.order = $filter('orderBy')($scope.order,'-orderDate');
		 $scope.order11 = $filter('orderBy')($scope.order,'-orderDate');
		// $scope.orderByDate = $scope.order;
		 $scope.order = $filter('selectedCustomerOrderTypes')($scope.order);
		next();
		
		
	}
	
	$scope.click=function(){
		console.log("in ng-checked value");
		console.log("filtered order details"+ $scope.order);
		 //pagination
	 $scope.filteredproducts = []
  ,$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  //$scope.order = [];
 // $scope.order = $scope.filteredorder;
 
 $scope.order = $filter('selectedCustomerOrderTypes')($scope.order11);
		next();
		
	}
	 	
	
	 
	$scope.selectedOrder = function(order){
		
		array1 = []; //removes any unwanted data in the array1
		console.log(order);
		
		var id = order
		$window.localStorage.setItem('orderID',id);
			
		
		var data={
			"orderId" :id 
		}
		
	               $http.post("http://localhost:7000/getAllProductsBySpecifiedId",data).then(function(response){
//$http.post("https://"+window.location.hostname+"/getAllProductsBySpecifiedId",data).then(function(response){	                

					if(response.data.output.length!=0)
		                       {
				                 
									  var length = response.data.output.length;
								    // alert(length);
								  for(i=0;i<length;i++){
									  if(response.data.output[i].orderId == id){ 
									  
										  array1.push(response.data.output[i]);
										 
									  }
									  
								  }
								  
								  $scope.products = array1;
								
				                   $location.path("/orderdetails");
								 
                               }
    
	                     else{
		                        alert("No Matches found");
	                         } 
	
		                 });

		
	};
	
	
	//pagination 
			var next = function() {
  $scope.$watch('currentPage + itemsPerPage', function() {
  console.log("in watch");
  $scope.itemsPerPage = $scope.viewby;
   /* var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = begin + $scope.itemsPerPage;
    */
   // $scope.filteredTodos = $scope.todos.slice(begin, end);
	var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = (($scope.currentPage) * $scope.itemsPerPage);
	 $scope.filteredorder = $scope.order.slice(begin, end);
	 console.log(JSON.stringify($scope.filteredorder))
	// console.log($filter('orderBy')($scope.filteredorder,'orderDate'));
  });
  };
loadOrder();

$scope.$watch('order', function() {
    console.log($scope.order);
	console.log($scope.order.checked);
  })
  
});
	
	

myApp.controller("OrderDetailsCtrl", function($scope, $http, $window, $location, $routeParams){

 
 var length1 = array.length;
 
 var length2 = array1.length;

 var order=$window.localStorage.getItem('orderID')
			
 //alert("local storage orderId"+order);
 console.log("array"+JSON.stringify(array))
 
 for(var i=0;i<length1;i++){
	 if(array[i].orderId == order){
		 $scope.customerOrder = array[i];
		 console.log(JSON.stringify($scope.customerOrder));
		 var customerOrder = array[i];
		 $scope.cust=customerOrder.orderId
		 $scope.date=customerOrder.orderDate
		 $scope.cID=customerOrder.customerId
		 $scope.poNumber=customerOrder.PoNumber
		 $scope.reqDate=customerOrder.requestedDate
		 $scope.details=customerOrder.order_response
		 console.log("This is details"+JSON.stringify($scope.details));
		 $scope.ship=customerOrder.ShipTo
		 $scope.sold=customerOrder.SoldTo
		 
	 }
 }
 
 var products=[]
 var prod=[]
 var productInfo=array1
 console.log("var productInfo"+JSON.stringify(productInfo))
 var length=productInfo.length
 for(i=0; i<length; i++){
	 prod.push(productInfo[i].product_response[0])
 }
console.log("prod array"+JSON.stringify(prod))
$scope.products=prod

 
 
});	
	
	// Define our filter
myApp.filter('selectedCustomerOrderTypes', function($filter) {
  return function(order) {
	  //console.log("in custom filter"+JSON.stringify(order))
    var i, len;
    
	//alert("in sellected");
    // get customers that have been checked
    var checkedCustomers = $filter('filter')(order, {checked: true});
    
    // Add in a check to see if any customers were selected. If none, return 
    // them all without filters
    if(checkedCustomers.length == 0) {
      return order;
    }
    
    // get all the unique orderTypes that come from these checked customers
    var orderTypes = {};
    for(i = 0, len = checkedCustomers.length; i < len; ++i) {
      // if this checked customers orderTypes isn't already in the orderTypes object 
      // add it
      if(!orderTypes.hasOwnProperty(checkedCustomers[i].orderType)) {
        orderTypes[checkedCustomers[i].orderType] = true;
      }
    }
    
    // Now that we have the orderTypes that come from the checked customers, we can
    //get all customers from those orderTypes and return them
    var ret = [];
    for(i = 0, len = order.length; i < len; ++i) {
      // If this customer's orderType exists in the orderTypes object, add it to the 
      // return array
      if(orderTypes[order[i].orderType]) {
        ret.push(order[i]);
      } 
    }
    
	console.log("ret custom filter"+JSON.stringify(ret));
    // we have our result!
    return ret;
  };
});

//***************************To Get Unique OrderTypes**********************************//

/* myApp.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
}); */

myApp.controller("invoicesearchCtrl", function($scope, $http, $window, $location, $routeParams, $filter){
 $scope.filteredproducts = []
  ,$scope.currentPage = 1
   ,$scope.viewby = 5
  ,$scope.itemsPerPage = $scope.viewby
  ,$scope.maxSize = 5;
  $scope.products = [];
  $scope.orderByDate = [];
  $scope.todos=[];
  //$scope.loading = true;
  
 	var loadOrder = function(){
		var length1 = array.length;
		//alert(length1);
		$scope.order = array;
		//$scope.order1 =$scope.order ;
		 //console.log($filter('orderBy')($scope.order,'-orderDate'));
		 $scope.order = $filter('orderBy')($scope.order,'-requestedDate');
		// $scope.order11 = $filter('orderBy')($scope.order,'-orderDate');
		// $scope.orderByDate = $scope.order;
		 //$scope.order = $filter('selectedCustomerOrderTypes')($scope.order);
		next();
		
		
	}
	
	var next = function() {
  $scope.$watch('currentPage + itemsPerPage', function() {
  console.log("in watch");
  $scope.itemsPerPage = $scope.viewby;
    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = begin + $scope.itemsPerPage;
    
    $scope.filteredTodos = $scope.todos.slice(begin, end);
	var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
    , end = (($scope.currentPage) * $scope.itemsPerPage);
	 $scope.filteredorder = $scope.order.slice(begin, end);
	 console.log(JSON.stringify($scope.filteredorder))
	// console.log($filter('orderBy')($scope.filteredorder,'orderDate'));
   }); 
  };
  loadOrder();
  
});

myApp.controller("invoiceDetailsCtrl", function ($scope, $http, $window, $location, $routeParams) {


	//var invoiceDetailsArr = [];
	var order = $window.localStorage.getItem('orderID');
	//alert("local storage orderId"+order);
	console.log("array" + $scope)
	var data = {
		"invoiceNo": $scope.invoiceNo
	}
	$http.get("http://localhost:7000/getInvoieDetailsById", data).then(function (response) {
		if (response.data.output.length != 0){
			var length = response.data.output.length;
			// alert(length);
			//for (i = 0; i < length; i++) {
				//if (response.data.output[i].orderId == id) {
			//		invoiceDetailsArr.push(response.data.output[1]);
				//}
			//}
			$scope.invoiceDetails = response.data.output[0];
			console.log('invoice Details 11',$scope.invoiceDetails);
		} else {
			alert("No Matches found");
		}

	});


});
	
	
	
	








