function newVSeeks() {
    console.log("entered new vseek method");
    var body = document.getElementById('body');
    var content = "<form class='vseeks-form' name='vSeekForm'>";
    content += "Task:<br />";
    content += "<input type='text' name='task'><br />";
    content += "<input type='submit' value= 'Submit'";
    content += "</form>";
    body.innerHTML = content;
}