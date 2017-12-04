chrome.storage.sync.get('blockingVSeek', function(items) {
    var vseek = items.blockingVSeek;
    console.log(vseek);
    generateCountdown(vseek);
});

function generateCountdown(vseek) {
    var alarmTime;
    var currentTime = Date.now();
    chrome.alarms.get(vseek.id, function(alarm){
        alarmTime = alarm.scheduledTime;
    });
    var countdown = setInterval(function() {
        var time = alarmTime - Date.now();
        var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((time % (1000 * 60)) / 1000);
      
        if (time > 0) {
            document.getElementById('countdown').innerHTML = hours + 'hr ' + minutes + 'm ' + seconds + 's ';
        }
        else { clearInterval(countdown); document.getElementById('countdown').innerHTML = 'RIGHT NOW' }
    }, 1000);
}