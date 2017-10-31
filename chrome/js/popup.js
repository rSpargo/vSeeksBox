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

});
app.controller('vSeeksController', function($scope, $http) {

});

/* var createVSeeksButton = document.getElementById('createVseeks');
var saveVSeeksButton = document.getElementById('newVSubmit');
var vForm = document.getElementById('vseeks-form');
createVSeeksButton.onclick = function() { newVSeeks(); }
vForm.onsubmit = function() { saveVSeeks(vForm); return false; }


function newVSeeks() {
    //set form visibility to visible; set button visibility to none.
    vForm.style.display = 'block';
    createVSeeksButton.style.display = 'none';
}
function saveVSeeks(form) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://vseeks-box.herokuapp.com/saveVSeeks/newuser');
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("task=" + form.task.value);
} */
