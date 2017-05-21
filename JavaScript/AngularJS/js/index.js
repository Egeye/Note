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
});

angular.bootstrap(document.getElementById("app1"), ['myApp1']);
angular.bootstrap(document.getElementById("app2", ['myApp2']));
angular.bootstrap(document.getElementById("appFId", ['appF']));
angular.bootstrap(document.getElementById("appLi"), ['myAppLi']);
angular.bootstrap(document.getElementById("appId3"), ['app3']);
angular.bootstrap(document.getElementById("app4Id"), ['app4']);
// angular.bootstrap(document.getElementById('app5id'), ['app5']);
angular.bootstrap(document.getElementById('idApp6'), ['app6']);