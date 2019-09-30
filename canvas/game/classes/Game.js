class Game {

    constructor(stages=[], currentStage={}) {
        this.stages = stages
        this.currentStage = currentStage
    }

    setStage(stage) {
        this.stages.push(stage);
    }

    getStage(id) {
        let stage = this.stages.find((stage) => stage.id == id);
        return stage ? stage : this.stages[0];
    }

    getStages() {
        return this.stages;
    }

    getCurrentStage() {
        return this.currentStage;
    }

    base64() {
        return btoa(JSON.stringify(this.stages))
    }

    setCurrentStage(stage) {
        this.currentStage = stage;
    }


    create(json) {
        let construct;
        if (json && json !== 'null') {
            construct = JSON.parse(atob(atob(bufferToBase64(json.data))));
            construct.forEach((stageConstruct, index) => {
                let staging = new Stage(document.querySelector('canvas'), ++index, stageConstruct.ids, stageConstruct.countIds, [], stageConstruct.quandoIniciar, stageConstruct.quandoTerminar, stageConstruct.acertosDoCenario);
                stageConstruct.shapes.forEach((shape) => {
                    let newShape = new Shape(shape.x, shape.y, shape.width, shape.height, shape.zIndex, shape.clickable, shape.visible, shape.velocity, shape.backGroundColor, shape.id, shape.matchId, shape.image64, shape.text, shape.opacity, shape.primarySound, shape.bordas, shape.dificult, shape.quandoClicar, shape.quandoAcertar, shape.quandoErrar);
                    staging.addShape(newShape);
                })
                staging.setName(stageConstruct.name);
                this.setStage(staging);
                
            });
            this.setCurrentStage(this.stages[0]);
            this.getCurrentStage().start();
        }
    }
}