var app = angular.module('vSeeksBox-Extension', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: './main.html'
    })
    .when('/newVSeeks', {
        templateUrl: '../html/new-vseeks.html',
        controller: 'vSeeksController'
    })
});
app.controller('mainController', function($scope, $http) {
    $http.get("https://vseeks-box.herokuapp.com/getVSeeks/newuser")
    .then(function(response) { $scope.vseeks = response.data });
});
app.controller('vSeeksController', function($scope, $http) {
    $scope.createVSeeks = function() {
        var data = {
            task: $scope.task,
            timer: {
                hours: $scope.hours,
                minutes: $scope.minutes,
                seconds: $scope.seconds
            }
        };
        $http.post('https://vseeks-box.herokuapp.com/saveVSeeks/newuser', data)
        .then(function (response) {
            var notif = {
                type: 'basic',
                title: " New vSeek Created!",
                message: 'This vSeek has been tasked with "' + $scope.task + '"!',
                iconUrl: '../assets/icon.png'
            }

            var tone = new Audio('../assets/tada.wav');

            chrome.notifications.create('newVSeeks', notif, function() { });
            tone.play();
            window.location.href = '#/!';
        });
    }
});