//onload database to local storage
var xhttp = new XMLHttpRequest();
xhttp.open('GET', 'https://vseeks-box.herokuapp.com/getData/newuser');
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        chrome.storage.sync.set({'userData': data}, function() {
            console.log('Data saved to local storage: ', data);
        });
    }
}
xhttp.send();

//listen for changes in local storage
chrome.storage.onChanged.addListener(function(changes) {
    
})