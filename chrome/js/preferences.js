var onRadio = document.getElementById('radioON');
var offRadio = document.getElementById('radioOFF');
var reminder = document.getElementById('reminder');
pullPreferences();


function pullPreferences() {
    chrome.storage.sync.get('userData', function(items) {
        if (items.userData.preferences.notifications.tone) {
            onRadio.checked = true;
            offRadio.checked = false;
        }
        else {
            offRadio.checked = true;
            onRadio.checked = false;
        }

        reminder.value = items.userData.preferences.notifications.reminder; 
    });
}
onRadio.onclick = function() { saveTone(true); }
offRadio.onclick = function() { saveTone(false); }
reminder.onchange = function() { saveReminder(); }

function saveTone(bool) {
    console.log('current tone status: ', bool);
    if (bool) {
        onRadio.checked = true;
        offRadio.checked = false;
    }
    else {
        onRadio.checked = false;
        offRadio.checked = true;
    }
    chrome.storage.sync.get('userData', function(items) {
        var newData = items.userData;
        newData.preferences.notifications.tone = bool;
        chrome.storage.sync.set({'userData': newData});
    });
}

function saveReminder() {
    console.log('current reminder value: ', reminder.value);
    chrome.storage.sync.get('userData', function(items) {
        var newData = items.userData;
        newData.preferences.notifications.reminder = reminder.value;
        chrome.storage.sync.set({'userData': newData});
    });
}