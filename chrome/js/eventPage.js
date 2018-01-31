//listen for changes in local storage
chrome.storage.onChanged.addListener(function(changes) {
    if (typeof changes.userData !== 'undefined') {
        var totalVSeeks = changes.userData.newValue.vSeeks.length;
        console.log(changes);
        if(totalVSeeks != 0) {
            chrome.browserAction.setBadgeText({"text": totalVSeeks.toString()});
        }
        else { chrome.browserAction.setBadgeText({"text": ""}); }
    }
});

//listen for alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Alarm triggered!", alarm);
    var notif = {
        type: 'basic',
        title: "Look at me!",
        message: 'The time you set is up! Are you finished?',
        iconUrl: '../assets/icons/icon128.png',
        buttons: [
            {title: "Nope! I need more time."},
            {title: "Yep! You're free to go."}
        ]
    }
    //put new sound here...
    var tone = new Audio('../assets/tada.wav');
    chrome.notifications.create(alarm.name, notif, function(){ });
    chrome.storage.sync.get('userData', function(items) {
        if(items.userData.preferences.notifications.tone) {
            tone.play();
        }
    });
});

//listen for notification button press
chrome.notifications.onButtonClicked.addListener(function(id, index) {
    if (index === 0) {
        //recreate alarm for reuse with reminder time
        chrome.alarms.clear(id);
        chrome.storage.sync.get('userData', function(items) {
            var newData = items.userData;
            var vSeek = newData.vSeeks.findIndex(i => i.id === id);
            vSeek.denial_count++;
            var reminder_time = items.userData.preferences.notifications.reminder;
            chrome.alarms.create(id, {when: (Date.now() + (reminder_time * 60000))});
            console.log(items);
            console.log(reminder_time);
            chrome.notifications.create('delayNotification', {
                type: 'basic',
                title: 'Alright; no problem.',
                message: 'Your vSeek will check up on you in ' + reminder_time + ' minutes...',
                iconUrl: '../assets/icons/icon128.png'
            }, function(){});
            chrome.storage.sync.set({'userData': newData});
        });
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
    }
});

//listen for updated tabs
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("TAB CHANGED: ", tab.url);
    var urlPattern = /^(?:http[s]?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
    chrome.storage.sync.get('userData', function(items) {
        var vSeeks = items.userData.vSeeks;
        vSeeks.forEach(vseek => {
            var blacklist = vseek.blacklist;
            blacklist.forEach(url => {
                var match = urlPattern.exec(tab.url);
                console.log("RegEx match: ", match[1]);
                if (match[1] === url) {
                    console.log('MATCH: REDIRECTING');
                    chrome.tabs.update({url: '../html/site_block.html'}, function(tab) {
                        chrome.storage.sync.set({'blockingVSeek': vseek});
                    });
                }
            });
        });
    });
});