let game = new Game();
let stage = new Stage(document.querySelector("canvas"), 1);
let inputNameScene = $('.name-scene');
let btnSceneOne = $('.1-btn-scene');
let modal = $('#excluirCena');
let userInfo = $('.user-info');
let currentGame = localStorage.getItem('id');

openDataBase().then((db) => {
    let idGame = currentGame;
    let tx = db.transaction(['jogos'], 'readonly');
    let store = tx.objectStore('jogos');
    let requestFromIDB = store.index('id').get(idGame ? Number(idGame) : 0);
    requestFromIDB.onsuccess = function (event) {
        let result = event.target.result ? event.target.result.jogo : null;
        if (result) {
            game.create(result);
            scenes = game.getStages().length + 1;
            stage = game.getCurrentStage();
        } else {
            game.setStage(stage);
            game.setCurrentStage(stage);
            console.log("Jogo não encontrado ou criação de um novo jogo");
        }
        stage.start();
        stage.resizeResolution();
    }
})