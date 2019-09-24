let liveMode = $("#step6");
let onLiveMode = $('#liveModeOn');
let gameModeLive;
liveMode.on('click', function() {
    $(liveMode).attr('hidden', true);
    $(liveModeOn).attr('hidden', false);
    gameModeLive = JSON.parse(JSON.stringify(game));
    stage.setLiveMode(true);
});

onLiveMode.on('click', function() {
    $(liveMode).attr('hidden', false);
    $(liveModeOn).attr('hidden', true);
    game = JSON.parse(JSON.stringify(gameModeLive));
    stage.setLiveMode(false);
})