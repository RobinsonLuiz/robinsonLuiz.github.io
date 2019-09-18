let liveMode = $("#step6");
let onLiveMode = $('#liveModeOn');

liveMode.on('click', function() {
    $(liveMode).attr('hidden', true);
    $(liveModeOn).attr('hidden', false);
    stage.setLiveMode(true);
});

onLiveMode.on('click', function() {
    $(liveMode).attr('hidden', false);
    $(liveModeOn).attr('hidden', true);
    stage.setLiveMode(false);
})