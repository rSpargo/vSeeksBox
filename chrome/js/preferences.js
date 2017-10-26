var add = document.getElementById('addButton');
var deleteButt = document.getElementById('deleteButton');
var commandSave = document.getElementById('commandSave');
var preferenceSubmit = document.getElementById('preferenceSubmit');
var jsonDict = [];
add.onclick = function() { openModal(); return false;}
deleteButt.onclick = function() { deleteCommand(); return false;}
commandSave.onclick = function() { saveCommand();  return false;}
preferenceSubmit.onclick = function() { saveAll(); return false;}

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

function saveCommand() {
    var form = document.forms["newCommand"];
    var selectBox = document.getElementById('custom-commands');
    var optionArr = selectBox.getElementsByTagName('option');
    var command = document.createElement('option');
    var blacklistArr = (form.blacklist.value).split(',');

    command.text = form.phrase.value;
    command.value = optionArr.length;

    var commandJSON = {
        "phrase": form.phrase.value,
        "site_blacklist": blacklistArr
    };

    jsonDict.push(commandJSON);
    selectBox.add(command);

    console.log("Save Command: ", jsonDict);
}

function deleteCommand() {
    var selectBox = document.getElementById('custom-commands');
    var selectedCommand = selectBox.selectedIndex;
    jsonDict.splice(selectedCommand.value, 1);
    selectBox.remove(selectedCommand);
    console.log("Delete Command: ", jsonDict);
}

function saveAll() {
    var form = document.getElementById("preferenceForm");
    var params = "tone=" + form.tone.value + "&commands=" + JSON.stringify(jsonDict);
    console.log('Params to be sent: ', params);
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://vseeks-box.herokuapp.com/savePrefs/newuser');
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    document.getElementById('status').innerText = 'SUCCESS!';

    /* xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var res = JSON.parse(xhttp.responseText);
            if (xhttp.status === 200 && res.status === 'OK') {
                document.getElementById('status').innerText = 'Preferences saved!';
            } else {
                document.getElementById('status').innerText = 'Preferences could not be saved.';
            }
        }
    } */
}