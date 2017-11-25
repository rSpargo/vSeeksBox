var add = document.getElementById('addButton');
var deleteButt = document.getElementById('deleteButton');
var commandSave = document.getElementById('commandSave');
//var preferenceSubmit = document.getElementById('preferenceSubmit');
var selectBox = document.getElementById('custom-commands');
var onRadio = document.getElementById('radioON');
var offRadio = document.getElementById('radioOFF');
var jsonDict = [];
pullTone();
pullCommands();

function pullTone() {
    chrome.storage.sync.get('userData', function(items) {
        if (items.userData.preferences.notifications.tone) {
            onRadio.checked = true;
            offRadio.checked = false;
        }
        else {
            offRadio.checked = true;
            onRadio.checked = false;
        }
    });
}
function pullCommands() {
    chrome.storage.sync.get('userData', function(items) {
        var commandArr = items.userData.preferences.commands;
        commandArr.forEach(element => {
            //send all existing commands to optionbox
            var command = document.createElement('option');
            command.text = element.phrase;
            command.value = commandArr.indexOf(element);
            jsonDict.push(element);
            selectBox.add(command);
        });
    });
}

add.onclick = function() { openModal(); return false;}
deleteButt.onclick = function() { deleteCommand();}
commandSave.onclick = function() { saveCommand();}
//preferenceSubmit.onclick = function() { saveAll(); return false;}
onRadio.onclick = function() { saveTone(true); }
offRadio.onclick = function() { saveTone(false); }

function openModal() {
    var modal = document.getElementById('commandModal');
    modal.style.display = 'block';
    var close = document.getElementById('close');

    close.onclick = function() {
        modal.style.display = 'none';
    }
    window.onclick = function(evt) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

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

function saveCommand() {
    //push new command to local storage and refresh selectBox
    var form = document.forms["newCommand"];
    var selectBox = document.getElementById('custom-commands');
    var optionArr = selectBox.getElementsByTagName('option');
    var command = document.createElement('option');
    var blacklistArr = (form.blacklist.value).split(', ');
    var cleanArr = [];

    blacklistArr.forEach(url => {
        var regEx = /^(?:http[s]?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
        var match = regEx.exec(url);
        cleanArr.push(match[1]);
    });

    chrome.storage.sync.get('userData', function(items) {
        var newData = items.userData;
        var prefs = newData.preferences;

        prefs.commands.push({ phrase: form.phrase.value, site_blacklist: cleanArr });
        chrome.storage.sync.set({'userData': newData});
    });
    pullCommands();
/* 
    command.text = form.phrase.value;
    command.value = optionArr.length;

    var commandJSON = {
        "phrase": form.phrase.value,
        "site_blacklist": blacklistArr
    };

    jsonDict.push(commandJSON);
    selectBox.add(command);

    console.log("Save Command: ", jsonDict); */
}

function deleteCommand() {
    var selectBox = document.getElementById('custom-commands');
    var selectedCommand = selectBox.selectedIndex;
    chrome.storage.sync.get('userData', function(items){
        var newData = items.userData;
        var prefs = newData.preferences;
        prefs.commands.splice(selectedCommand.value, 1);
        chrome.storage.sync.set({'userData': newData});
    });
    pullCommands();
    // jsonDict.splice(selectedCommand.value, 1);
    //selectBox.remove(selectedCommand);
    //console.log("Delete Command: ", jsonDict);
}

/* function saveAll() {
    var form = document.getElementById("preferenceForm");
    chrome.storage.sync.get('userData', function(items) {
        var newData = items.userData;
        newData.preferences.notifications.tone = form.tone.value;
        newData.commands = JSON.stringify(jsonDict);

        console.log('data being saved: ', newData);

        chrome.storage.sync.set({'userData': newData});
    });

    /* xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var res = JSON.parse(xhttp.responseText);
            if (xhttp.status === 200 && res.status === 'OK') {
                document.getElementById('status').innerText = 'Preferences saved!';
            } else {
                document.getElementById('status').innerText = 'Preferences could not be saved.';
            }
        }
    }
} */