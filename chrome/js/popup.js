var app = angular.module('vSeeksBox-Extension', ['ngRoute']);
var currentVID = "";
app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: './main.html'
    })
    .when('/newVSeeks', {
        templateUrl: '../html/new-vseeks.html',
        controller: 'vSeeksController'
    })
    .when('/confirm', {
        templateUrl: '../html/confirmation.html',
        controller: 'confirmController'
    })
    .when('/delete', {
        templateUrl: '../html/delete.html',
        controller: 'deleteController'
    })
});
app.controller('mainController', function($scope, $window) {
    $scope.toggleAcc = function($event) {
        var currentAcc = $event.currentTarget;
        currentAcc.classList.toggle("active");
        var panel = currentAcc.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
    $scope.sendID = function(id) {
        currentVID = id;
        $window.location.href = "#!delete";
    }
    var noVseeks;
    var home_button;
    var newV_button;

    console.log('controller reached', $scope.vseeks);
    chrome.storage.sync.get('userData', function(items){
        $scope.vseeks = items.userData.vSeeks;
        console.log('inside chrome storage get', $scope.vseeks);
        home_button = document.getElementById('home_button');
        newV_button = document.getElementById('newV_button');
        console.log('variables: ', home_button, newV_button);
        if ($scope.vseeks.length < 1) {
            home_button.style.visibility = "hidden";
            newV_button.style.visibility = "hidden";
        }
        else {
            newV_button.style.visibility = "visible";
            if (home_button.style.visibility == "visible") {
                home_button.style.visibility = "hidden";
            }
        }
    });
});

app.controller('vSeeksController', function($scope, $window, $route, $http) {
    document.getElementById('home_button').style.visibility = "visible";
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
            $window.location.href = '#!confirm';
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
app.controller('confirmController', function() {
    //Nothing to see here...
});
app.controller('deleteController', function($scope) {
    $scope.boxStyle = {};
    $scope.checkID = function(input) {
        if (input === currentVID) {
            chrome.alarms.clear(currentVID);
            chrome.storage.sync.get('userData', function(items) {
                var newData = items.userData;
                var vSeek = newData.vSeeks.findIndex(i => i.id === currentVID);
                newData.vSeeks.splice(vSeek, 1);
                chrome.storage.sync.set({'userData': newData});
            });
            $scope.boxStyle = {'background-color': 'rgb(97, 240, 0)'};
            $scope.id_input = "vSEEKS DELETED"
        } else {
            $scope.boxStyle = {'background-color': 'rgb(240, 31, 0)'};
            $scope.id_input = "INVALID vID";
        }
    }
});