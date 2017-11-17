chrome.identity.getAuthToken({interactive:true}, function(token) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Received data: ", JSON.parse(this.responseText));
            var authData = JSON.parse(this.responseText);

            var db = new XMLHttpRequest();
            db.open('GET', 'https://vseeks-box.herokuapp.com/getData/' + authData.id);
            db.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var chromeData = JSON.parse(this.responseText);
                    chrome.storage.sync.set({'userData': chromeData}, function() {
                        console.log('Data saved to local storage: ', chromeData);
                    });
                }
            }
            db.send();
        }
    }
    xhttp.send();
});

//listen for changes in local storage
chrome.storage.onChanged.addListener(function(changes) {
    var totalVSeeks = changes.userData.newValue.vSeeks.length;
    console.log(changes);
    chrome.browserAction.setBadgeText({"text": totalVSeeks.toString()});
});

//listen for alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Alarm triggered!", alarm);
    var notif = {
        type: 'basic',
        title: "Look at me!",
        message: 'The time you set is up! Are you finished?',
        iconUrl: '../assets/icon.png',
        buttons: [
            {title: "Nope! I need more time."},
            {title: "Yep! You're free to go."}
        ]
    }
    var tone = new Audio('../assets/tada.wav');
    chrome.notifications.create(alarm.name, notif, function(){ });
    tone.play();
});

//listen for notification button press
chrome.notifications.onButtonClicked.addListener(function(id, index) {
    if (index === 0) {
        console.log("Option button: NO, clicked");
        //keep active
        //keep notifying
    } 
    else {
        //disarm alarm
        chrome.alarms.clear(id);
        chrome.notifications.clear(id);
        //delete from storage
        chrome.storage.sync.get('userData', function(items) {
            var newData = items.userData;
            var vSeek = newData.vSeeks.findIndex(i => i.id === id);
            newData.vSeeks.splice(vSeek, 1);
            console.log(newData.vSeeks);
            chrome.alarms.getAll(function(alarms) {
                console.log("Currently active alarms: ", alarms);
            });
            chrome.notifications.getAll(function(notifications) {
                console.log("Notifications: ", notifications);
            });
            chrome.storage.sync.set({'userData': newData});       
        });
        //reaccess websites
        
    }
});