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
app.controller('mainController', function($scope, $window) {
    chrome.storage.sync.get('userData', function(items){
        $scope.vseeks = items.userData.vSeeks;
        if ($scope.vseeks.length < 1) {
            document.getElementById('no-vseeks').style.display = 'block';
        }
        else {
            document.getElementById('no-vseeks').style.display = 'none';
        }
    });
});

app.controller('vSeeksController', function($scope, $window, $route, $http) {
    $scope.createVSeeks = function() {
        $http.get('https://vseeks-box.herokuapp.com/genID')
        .then(function(response) {
             $scope.id = response.data;

             var blacklistArr = $scope.blacklist.split(', ');
             var cleanArr = [];
             blacklistArr.forEach(url => {
                var regEx = /^(?:http[s]?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
                var match = regEx.exec(url);
                cleanArr.push(match[1]);        
             });

             var data = {
                id: $scope.id,
                task: $scope.task,
                timer: {
                    hours: $scope.hours,
                    minutes: $scope.minutes,
                    seconds: $scope.seconds
                },
                blacklist: cleanArr
            };
            console.log("new vSeek data", data);
            chrome.storage.sync.get('userData', function(items) {
                var newData = items.userData;
                console.log(newData);
                newData.vSeeks.push(data);
                chrome.storage.sync.set({'userData': newData});
    
                var alarmTime = {
                    when: Date.now() + convertToMilli(data.timer.hours, data.timer.minutes, data.timer.seconds)
                }
                chrome.alarms.create(data.id, alarmTime);        
            });
        });
    }

    function convertToMilli (hrs, mins, secs) {
        console.log("conversion method hit")
        var result = 0;
        result += (hrs * 3600000);
        result += (mins * 60000);
        result += (secs * 1000);
        console.log("result: ", result)
        return result;
    }
});