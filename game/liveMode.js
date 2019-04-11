let liveMode = document.querySelector("#live");
let onLiveMode = document.querySelector('#liveModeOn');
let stageModeOn;
liveMode.addEventListener('click', function() {
    liveMode.setAttribute('disabled', 'disabled');
    liveModeOn.removeAttribute('disabled');
    stage.setLiveMode(true);
});

onLiveMode.addEventListener('click', function() {
    liveModeOn.setAttribute('disabled', 'disabled');
    liveMode.removeAttribute('disabled');
    stage.setLiveMode(false);
})