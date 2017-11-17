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
    .when('/detail/:id', {
        templateUrl: '../html/vseeks-detail.html',
        controller: 'detailController'
    })
});
app.controller('mainController', function($scope, $window) {
    /* $http.get("https://vseeks-box.herokuapp.com/getVSeeks/newuser")
    .then(function(response) { $scope.vseeks = response.data }); */
    chrome.storage.sync.get('userData', function(items){
        $scope.vseeks = items.userData.vSeeks;
    });
    $scope.viewDetail = function(vseek) {
        console.log("vSeek: ", vseek);
        var index = $scope.vseeks.indexOf(vseek);
        console.log("index: ", index);
        $window.location.href = '#!/detail/' + index;
    }
});
app.controller('vSeeksController', function($scope, $window, $route, $http) {
    $scope.createVSeeks = function() {
        $http.get('https://vseeks-box.herokuapp.com/genID')
        .then(function(response) {
             $scope.id = response.data;

             var data = {
                id: $scope.id,
                task: $scope.task,
                timer: {
                    hours: $scope.hours,
                    minutes: $scope.minutes,
                    seconds: $scope.seconds
                }
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


    //$window.location.reload();
    //$window.location.href = '#!/';
        
        /* $http.post('https://vseeks-box.herokuapp.com/saveVSeeks/newuser', data)
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
        }); */
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
app.controller('detailController', function($scope, $routeParams){
    var data = "";
    console.log("Controller called. Route params: ", $routeParams);
    chrome.storage.sync.get('userData', function(items){
        $scope.currentVSeek = items.userData.vSeeks[$routeParams.id];
        console.log($scope.currentVSeek);
    });
    console.log($scope.currentVSeek);
});