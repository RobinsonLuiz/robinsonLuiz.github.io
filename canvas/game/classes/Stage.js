let movingCorner = -1;
let sceneScripts;
class Stage {

    constructor(canvas, id, ids = [], countIds = 1, shapes = [], quandoIniciar = {}, quandoTerminar = {}) {
        this.id = id;
        this.canvas = canvas;
        this.mouse = new Mouse();
        this.width = $(window).width();
        this.height = $(window).height();
        this.context = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        this.html = document.body.parentNode;
        this.shapes = shapes;
        this.countIds = countIds;
        this.ids = ids;
        this.executingScript = false;
        this.name = '';
        this.fps = 30;
        this.looping = null;
        this.currentStage = false;
        this.dragging = false;
        this.shapeSelected = -1;
        this.dragoffx = 0;
        this.dragoffy = 0;
        this.toJSON = { Stage: { shapes: [] } };
        this.quandoIniciar = quandoIniciar;
        this.quandoTerminar = quandoTerminar;
        this.clone = null;
        this.stageLiveMode = null;
        this.valorVelocidades = {
            'lenta': 10,
            'medio': 30,
            'alta': 50,
            'teletransporte': 5
        };
        this.liveMode = true;
        let quandoIniciarScrpt = Object.keys(this.quandoIniciar);
        if (quandoIniciarScrpt.length) {
            this.playScript(quandoIniciarScrpt, this.quandoIniciar, true);
        }
        sceneScripts = {
            quandoIniciar: Object.keys(this['quandoIniciar']).length + 1,
            quandoTerminar: Object.keys(this['quandoTerminar']).length + 1,
        }
        this.startEvents();
    }


    resizeResolution() {
        this.shapes.forEach((shape) => shape.resize(800, 1024, this.height, this.width));
    }

    setName(name) {
        this.name = name;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getContext() {
        return this.context;
    }

    getCanvas() {
        return this.canvas;
    }

    click() {
        $(this.canvas).on("mousedown touchstart", e => {
            e.preventDefault();
            if (this.currentStage) {
                let mouse = this.mouse.getPosition(this, e);
                movingCorner = -1;
                for (let i = this.shapes.length - 1; i >= 0; i--) {
                    if (this.shapes[i].contains(mouse.x, mouse.y) && !this.shapes[i].used) {
                        this.shapeSelected = i;
                        this.dragoffx = mouse.x - this.shapes[this.shapeSelected].x;
                        this.dragoffy = mouse.y - this.shapes[this.shapeSelected].y;
                        this.shapes[this.shapeSelected].posInitialX = this.shapes[this.shapeSelected].x;
                        this.shapes[this.shapeSelected].posInitialY = this.shapes[this.shapeSelected].y;
                        break;
                    }
                    this.shapeSelected = -1;
                }
                if (this.shapes[this.shapeSelected]) {
                    let quandoClicar = Object.keys(this.shapes[this.shapeSelected].quandoClicar);
                    if (quandoClicar.length) {
                        this.playScript(quandoClicar, this.shapes[this.shapeSelected].quandoClicar);
                    }
                }
                if (movingCorner == -1 && this.shapeSelected != -1) {
                    this.dragging = true;
                    return;
                } else {
                    this.shapeSelected = -1;
                    movingCorner = -1;
                    return;
                }
            }
        });
    }

    sleep(timer) {
        return new Promise((resolve, reject) => setTimeout(() => resolve(timer), timer));
    }

    
    async playScriptTerminar(value) {
        let quandoTerminar = Object.keys(this.quandoTerminar);
        for (let i = 0; i < quandoTerminar.length; i++) {
            switch(this.quandoTerminar[quandoTerminar[i]].type) {
                case "image":
                    // if (!currentShape.img) currentShape.img = new Image();
                    // currentShape.img.src = script[type[i]].value;
                    break;
                case "sound":
                    await this.loadAudio(this.quandoTerminar[quandoTerminar[i]].value);
                    break;
            }
        }
        if (value == 0) {
            window.location.assign('./jogos.html');
        } else {
            let fase = game.getStages().find((stage) => stage.id == game.getCurrentStage().id + value);
            if (fase) {
                game.currentStage.pauseScene();
                game.getCurrentStage.shapeSelected = -1;
                fase.start();
                game.setCurrentStage(fase);
            }
        }
    }

    addShape(shape) {
        this.toJSON["Stage"].shapes.push(shape);
        this.shapes.push(shape);
    }

    clear() {
        this.getContext().clearRect(0, 0, this.width, this.height);
        this.draw();
    }

    loadAudio(som) {
        return new Promise((resolve, reject) => {
            let sound = new Audio();
            sound.src = som;
            sound.controls = false;
            sound.load();
            sound.play().then(() => {})
            sound.onended = () => resolve();
            sound.onerror = () => reject();
        })
    }


    start() {
        this.currentStage = true;
        this.looping = setInterval(() => {
            this.getContext().clearRect(0, 0, this.width, this.height);
            for (let i = 0; i < this.shapes.length; i++) this.shapes[i].update();
            this.draw();
        }, 1000 / this.fps);
    }

    draw() {
        this.shapes = this.shapes.sort((a, b) => a.zIndex - b.zIndex);
        for (let i = 0; i < this.shapes.length; i++) this.shapes[i].draw(this.getContext());
    }

    moving() {
        $(document).on("mousemove touchmove", e => {
            if (this.currentStage) {
                let mouse = this.mouse.getPosition(this, e);
                if (this.dragging && this.shapes[this.shapeSelected] && this.shapes[this.shapeSelected].clickable) {
                    this.shapes[this.shapeSelected].x = mouse.x - this.dragoffx;
                    this.shapes[this.shapeSelected].y = mouse.y - this.dragoffy;
                }
            }
        });
    }

    /**
     * 
     * @param {Shape} shape 
     * @param {Shape} clone 
     * @param {Number} location - -1 - always, 0 - low, 1 - middle, 2 - high (using 10% off size);
     */
    collision(shape, clone, location=2) {
        if (location == -1) return true;
        let catX = (shape.centerX() - clone.centerX());
        let catY = (shape.centerY() - clone.centerY());
        let halfWidth = shape.halfWidth() + clone.halfWidth();
        let halfHeight = shape.halfHeight() + clone.halfHeight();
        if (location == 1) {
            return (Math.abs(catX) + shape.halfWidth()) < halfWidth && (Math.abs(catY) + shape.halfHeight()) < halfHeight;
        } else if (location == 2) {
            return ((Math.abs(catX) + shape.width - (shape.width * 10 / 100)) <= halfWidth && 
                (Math.abs(catY) + shape.height - (shape.height * 10 / 100)) <= halfHeight);
        } else return (Math.abs(catX) < halfWidth && Math.abs(catY) < halfHeight);
    }

    async playScript(type, script, proccess = false, shapeSelected = null, scene) {
        if (!this.executingScript || proccess) {
            // let shape = JSON.parse(JSON.stringify(shapeSelected || this.shapes[this.shapeSelected]));
            let currentShape = shapeSelected || this.shapes[this.shapeSelected];
            for (let i = 0; i < type.length; i++) {
                this.executingScript = true;
                switch (script[type[i]].type) {
                    case "image":
                        if (!currentShape.img) currentShape.img = new Image();
                        currentShape.img.src = script[type[i]].value;
                        break;
                    case "sound":
                        await this.loadAudio(script[type[i]].value);
                        break;
                    case "end":
                        let quandoTerminar = Object.keys(this.quandoTerminar);
                        if (quandoTerminar.length) return this.playScriptTerminar(0);
                        window.location.assign('./jogos.html');
                        break;
                    case "next":
                        let fase = game.getStages().find((stage) => stage.id == game.getCurrentStage().id + 1);
                        if (fase) {
                            let quandoTerminar = Object.keys(this.quandoTerminar);
                            if (quandoTerminar.length) return this.playScriptTerminar(1);
                            game.currentStage.pauseScene();
                            game.getCurrentStage.shapeSelected = -1;
                            fase.start();
                            game.setCurrentStage(fase);
                        } else alert("NÃO POSSUI PROXIMO CENÁRIO");
                        break;
                    case "previous":
                        let ant = game.getStages().find((stage) => stage.id == game.getCurrentStage().id - 1);
                        if (ant) {
                            let quandoTerminar = Object.keys(this.quandoTerminar);
                            if (quandoTerminar.length) return this.playScriptTerminar(-1);
                            game.currentStage.pauseScene();
                            game.getCurrentStage.shapeSelected = -1;
                            ant.start();
                            game.setCurrentStage(ant);
                        } else alert("NÃO POSSUI PROXIMO CENÁRIO");
                        break;
                    case "specify":
                        let specify = game.getStages().find((stage) => stage.id == script[type[i]].value);
                        if (specify) {
                            let quandoTerminar = Object.keys(this.quandoTerminar);
                            if (quandoTerminar.length) return this.playScriptTerminar(script[type[i]].value);
                            game.currentStage.pauseScene();
                            game.getCurrentStage.shapeSelected = -1;
                            specify.start();
                            game.setCurrentStage(specify);
                        }
                        break;
                }
                await this.sleep(1000);
            }
            // for(let i = 0; i < this.shapes.length; i++) {
            //     if (this.shapes[i].id == shape.id) this.shapes[i].img = null; 
            // }
            this.executingScript = false;
        }
    }
    


    drop() {
        $(document).on("mouseup touchend", e => {
            let shapeSelected = this.shapes[this.shapeSelected];
            if (this.currentStage) {
                if (this.liveMode && this.shapes[this.shapeSelected] && this.shapes[this.shapeSelected].clickable) {
                    if (this.shapes[this.shapeSelected].matchId.length) {
                        for (let i = 0; i < this.shapes[this.shapeSelected].matchId.length; i++) {
                            let match = this.shapes[this.shapeSelected].matchId[i];
                            let clone = this.shapes.find(e => e.id == match);
                            if (clone) {
                                if (this.collision(shapeSelected, clone, shapeSelected.dificult) || this.collision(clone, shapeSelected, shapeSelected.dificult)) {
                                    this.shapes = this.shapes.filter(e => e != clone);
                                    let quandoAcertar = Object.keys(this.shapes[this.shapeSelected].quandoAcertar);
                                    if (quandoAcertar.length) this.playScript(quandoAcertar, this.shapes[this.shapeSelected].quandoAcertar, true);
                                    this.shapes[this.shapeSelected].quandoErrar = {};
                                    shapeSelected.x = clone.x;
                                    shapeSelected.y = clone.y;
                                    shapeSelected.width = clone.width;
                                    shapeSelected.height = clone.height;
                                    this.toJSON["Stage"] = this.shapes;
                                    break;
                                } else {
                                    let quandoErrar = Object.keys(this.shapes[this.shapeSelected].quandoErrar);
                                    if (quandoErrar.length) this.playScript(quandoErrar, this.shapes[this.shapeSelected].quandoErrar, this.dragging);
                                    let angle = Math.atan2(shapeSelected.posInitialY -
                                        shapeSelected.y, shapeSelected.posInitialX -
                                        shapeSelected.x);
                                    if (shapeSelected.velocity != 5) {
                                        shapeSelected.velocityX = shapeSelected.velocity * Math.cos(angle);
                                        shapeSelected.velocityY = shapeSelected.velocity * Math.sin(angle);
                                    } else {
                                        shapeSelected.x = shapeSelected.posInitialX;
                                        shapeSelected.y = shapeSelected.posInitialY;
                                    }
                                }
                            } else {
                                let quandoErrar = Object.keys(this.shapes[this.shapeSelected].quandoErrar);
                                if (quandoErrar.length) this.playScript(quandoErrar, this.shapes[this.shapeSelected].quandoErrar, this.dragging);
                                let angle = Math.atan2(shapeSelected.posInitialY -
                                    shapeSelected.y, shapeSelected.posInitialX -
                                    shapeSelected.x);
                                if (shapeSelected.velocity != 5) {
                                    shapeSelected.velocityX = shapeSelected.velocity * Math.cos(angle);
                                    shapeSelected.velocityY = shapeSelected.velocity * Math.sin(angle);
                                } else {
                                    shapeSelected.x = shapeSelected.posInitialX;
                                    shapeSelected.y = shapeSelected.posInitialY;
                                } 
                            }
                        } 
                    } else {
                        let angle = Math.atan2(shapeSelected.posInitialY -
                            shapeSelected.y, shapeSelected.posInitialX -
                            shapeSelected.x);
                        if (shapeSelected.velocity != 5) {
                            shapeSelected.velocityX = shapeSelected.velocity * Math.cos(angle);
                            shapeSelected.velocityY = shapeSelected.velocity * Math.sin(angle);
                        } else {
                            shapeSelected.x = shapeSelected.posInitialX;
                            shapeSelected.y = shapeSelected.posInitialY;
                        } 
                        let quandoErrar = Object.keys(shapeSelected.quandoErrar);
                        if (quandoErrar.length) this.playScript(quandoErrar, shapeSelected.quandoErrar, this.dragging);
                    }   
                }
                this.dragging = false;
            }
        });
    }

    startEvents() {
        this.click();
        this.drop();
        this.moving();
    }
};