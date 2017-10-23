var createVSeeksButton = document.getElementById('createVseeks');
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
}
