var app = angular.module('myApp1', []);
app.controller('myController1', function($scope) {
	$scope.firstName = "Egeye";
	$scope.lastName = "Ignativ";
	$scope.fullName = () => { return $scope.firstName + ' ' + $scope.lastName };
});

angular.module('myAppLi', []).controller('controllerLi', ($scope) => { $scope.liNames = ['Egeye', 'Octavio', 'Will'] } );

/**
 * Example app3
 */
var app3 = angular.module('app3', []);
app3.service('hexafy', function() {
	this.myFunc = function (x) {
        return x.toString(16);
    }
});
app3.controller('controllerApp3', ($scope, $location, $http, $interval, hexafy) => {
	$scope.myUrl = $location.absUrl();

	console.log('or - window.location', window.location);
	console.log('or - $location', $location);
	console.log('or - $location.service', $location.service);
	console.log('or - $http', $http);

	window.setTimeout(() => {
		console.log('or - delay');
	}, 3000);

	// $scope.myTime = new Date().toLocaleString();
	$interval(() => {$scope.myTime = new Date().toLocaleString();}, 1000);

	$scope.hex = hexafy.myFunc(255);
});

/** @type {app4} [description] */
var app4 = angular.module('app4',[]);
app4.service('hexafy4', function() {
	this.myFunc4 = function (x) {
        return x.toString(16);
    }
});
app4.filter('myFormat',['hexafy4', function(hexafy4) {
    return function(x) {
        return hexafy4.myFunc4(x);
    };
}]);

/** app5 */
// var app5 = angular.module('app5', []);
// app5.controller('controllerApp5', ($scope, $http) => {
// 	$http({
// 		method: 'GET',
// 		url: 'index.php'
// 	}).then((respones) => {
// 		console.log('or - respones', respones);
// 		$scope.app5Names = respones.data.sites;
// 	}, (respones) => {
// 		console.log('or - http error', respones);
// 	});
// });


/** app6 */
var app6 = angular.module('app6', []);
app6.controller('controllerApp6', function($scope) {
    $scope.app6Names = ["Google", "Runoob", "Taobao"];
    $scope.btnReset = function() {
    	$scope.count = 0;
    }
});


// ----------------------Start------------------------------------
angular.module('myApp', []).controller('userCtrl', function($scope) {
	$scope.fName = '';
	$scope.lName = '';
	$scope.passw1 = '';
	$scope.passw2 = '';
	$scope.users = [
		{id:1, fName:'Hege', lName:"Pege" },
		{id:2, fName:'Kim',  lName:"Pim" },
		{id:3, fName:'Sal',  lName:"Smith" },
		{id:4, fName:'Jack', lName:"Jones" },
		{id:5, fName:'John', lName:"Doe" },
		{id:6, fName:'Peter',lName:"Pan" }
	];
	$scope.edit = true;
	$scope.error = false;
	$scope.incomplete = false;

	$scope.editUser = function(id) {
		if (id == 'new') {
		    $scope.edit = true;
		    $scope.incomplete = true;
		    $scope.fName = '';
		    $scope.lName = '';
	    } else {
		    $scope.edit = false;
		    $scope.fName = $scope.users[id-1].fName;
		    $scope.lName = $scope.users[id-1].lName;
		}
	};

	$scope.$watch('passw1',function() {$scope.test();});
	$scope.$watch('passw2',function() {$scope.test();});
	$scope.$watch('fName', function() {$scope.test();});
	$scope.$watch('lName', function() {$scope.test();});

	$scope.test = function() {
		if ($scope.passw1 !== $scope.passw2) {
	    	$scope.error = true;
	    } else {
	    	$scope.error = false;
		}
		$scope.incomplete = false;
		if ($scope.edit && (!$scope.fName.length ||
			!$scope.lName.length ||
			!$scope.passw1.length || !$scope.passw2.length)) {
			$scope.incomplete = true;
		}
	};

});
// ----------------------End------------------------------------

var app8 = angular.module('app8', []);
app8.controller('controller8', ($scope, $timeout) => {
	var updateClock = function() {
		$scope.clock = new Date();
		$timeout(function() {
			updateClock();
		}, 1000);
	};
	updateClock();
});


angular.bootstrap(document.getElementById("app1"), ['myApp1']);
angular.bootstrap(document.getElementById("app2", ['myApp2']));
angular.bootstrap(document.getElementById("appFId", ['appF']));
angular.bootstrap(document.getElementById("appLi"), ['myAppLi']);
angular.bootstrap(document.getElementById("appId3"), ['app3']);
angular.bootstrap(document.getElementById("app4Id"), ['app4']);
// angular.bootstrap(document.getElementById('app5id'), ['app5']);
angular.bootstrap(document.getElementById('idApp6'), ['app6']);
angular.bootstrap(document.getElementById('idApp7'), ['myApp']);
angular.bootstrap(document.getElementById('id8'), ['app8']);