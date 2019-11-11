let movingCorner = -1;
let sceneScripts;
let width_creator = 1024
let height_creator = 800
class Stage {

    constructor(canvas, id, ids = [], countIds = 1, shapes = [], quandoIniciar = {}, quandoTerminar = {}, acertosDoCenario = 0) {
        this.id = id;
        this.canvas = canvas;
        this.mouse = new Mouse();
        this.width = $(window).width() - 20;
        this.height = $(window).height() - 30;
        this.context = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        this.html = document.body.parentNode;
        this.shapes = shapes;
        this.countIds = countIds;
        this.ids = ids;
        this.executingScript = false;
        this.name = '';
        this.resized = false;
        this.fps = 30;
        this.looping = null;
        this.currentStage = false;
        this.dragging = false;
        this.shapeSelected = -1;
        this.dragoffx = 0;
        this.acertosExecutados = 0;
        this.acertosDoCenario = acertosDoCenario;
        this.dragoffy = 0;
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
        sceneScripts = {
            quandoIniciar: Object.keys(this['quandoIniciar']).length + 1,
            quandoTerminar: Object.keys(this['quandoTerminar']).length + 1,
        }
        this.startEvents();
    }


    resizeResolution() {
        let larg_disp = this.width;
        let alt_disp = this.height;
        let padx = 0, alt_mod = 0, larg_mod = 0, pady = 0;
        if (larg_disp < alt_disp) {
            alt_mod = larg_disp / (width_creator / height_creator)
            pady = (alt_disp - alt_mod) / 2
            alt_disp = alt_mod
        } else {
            larg_mod = (width_creator / height_creator) * alt_disp
            padx = (larg_disp - larg_mod) / 2
            larg_disp = larg_mod
        }
        if (!this.resized) {
            this.shapes.forEach((shape) => shape.resize(height_creator, width_creator, alt_disp, larg_disp, padx, pady));
            this.resized = true;
        }
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
                    if (this.shapes[i].contains(mouse.x, mouse.y)) {
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

    async playScriptTerminar(value = null) {
        let quandoTerminar = Object.keys(this.quandoTerminar);
        this.shapeSelected = -1;
        for (let i = 0; i < quandoTerminar.length; i++) {
            switch (this.quandoTerminar[quandoTerminar[i]].type) {
                case "image":
                    // if (!currentShape.img) currentShape.img = new Image();
                    // currentShape.img.src = script[type[i]].value;
                    break;
                case "sound":
                    await this.loadAudio(this.quandoTerminar[quandoTerminar[i]].value);
                    break;
                case "end":
                    value = 0;
                    break;
                case "next":
                    value = +1;
                    break;
                case "previous":
                    value = -1;
                    break;
                case "specify":
                    value = this.quandoTerminar[quandoTerminar[i]].value;
                    break;
            }
        }
        if (value == 0) {
            window.location.assign('./jogos.html');
        } else {
            let fase = game.getStages().find((stage) => stage.id == game.getCurrentStage().id + (value ? value : 1));
            if (fase) {
                game.currentStage.pauseScene();
                game.currentStage.shapeSelected = -1;
                fase.start();
                fase.resizeResolution();
                game.setCurrentStage(fase);
            } else window.location.assign('./jogos.html');
        }
    }

    addShape(shape) {
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
            sound.play().then(() => { })
            sound.onended = () => resolve();
            sound.onerror = () => reject();
        })
    }


    start() {
        this.currentStage = true;
        let quandoIniciarScrpt = Object.keys(this.quandoIniciar);
        if (quandoIniciarScrpt.length) {
            this.playScript(quandoIniciarScrpt, this.quandoIniciar, true);
        }
        this.looping = setInterval(() => {
            if (this.currentStage) {
                this.getContext().clearRect(0, 0, this.width, this.height);
                for (let i = 0; i < this.shapes.length; i++) this.shapes[i].update();
                this.draw();
            }
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
                if (this.dragging && this.shapes[this.shapeSelected] && this.shapes[this.shapeSelected].clickable && !this.shapes[this.shapeSelected].used) {
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
    collision(shape, clone, location = 2) {
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

    async playScript(type, script, shapeSelected = null) {
        let currentShape = shapeSelected || this.shapes[this.shapeSelected];
        for (let i = 0; i < type.length; i++) {
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
                        fase.resizeResolution();
                        game.setCurrentStage(fase);
                    } else window.location.assign('./jogos.html');
                    break;
                case "previous":
                    let ant = game.getStages().find((stage) => stage.id == game.getCurrentStage().id - 1);
                    if (ant) {
                        let quandoTerminar = Object.keys(this.quandoTerminar);
                        if (quandoTerminar.length) return this.playScriptTerminar(-1);
                        game.currentStage.pauseScene();
                        game.getCurrentStage.shapeSelected = -1;
                        ant.start();
                        ant.resizeResolution();
                        game.setCurrentStage(ant);
                    } else window.location.assign('./jogos.html');
                    break;
                case "specify":
                    let specify = game.getStages().find((stage) => stage.id == script[type[i]].value);
                    if (specify) {
                        let quandoTerminar = Object.keys(this.quandoTerminar);
                        if (quandoTerminar.length) return this.playScriptTerminar(script[type[i]].value);
                        game.currentStage.pauseScene();
                        game.getCurrentStage.shapeSelected = -1;
                        specify.start();
                        specify.resizeResolution();
                        game.setCurrentStage(specify);
                    } else window.location.assign('./jogos.html');
                    break;
                case "mostrar":
                    let shapeShow = this.shapes.find((shape) => shape.id == script[type[i]].value);
                    shapeShow.hidden = false;
                    break;
                case "esconder":
                    let shapeHidden = this.shapes.find((shape) => shape.id == script[type[i]].value);
                    shapeHidden.hidden = true;
                    break;
            }
            await this.sleep(500);
        }
    }

    pauseScene() {
        this.clear();
        this.currentStage = false;
        clearInterval(this.looping);
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
                            if (clone && !clone.used) {
                                if (this.collision(shapeSelected, clone, shapeSelected.dificult) || this.collision(clone, shapeSelected, shapeSelected.dificult)) {
                                    this.shapes = this.shapes.filter(e => e != clone);
                                    clone.used = true;
                                    shapeSelected.used = true;
                                    shapeSelected.x = clone.x;
                                    shapeSelected.y = clone.y;
                                    shapeSelected.width = clone.width;
                                    shapeSelected.velocity = 5;
                                    shapeSelected.height = clone.height;
                                    shapeSelected.matchId = [];
                                    shapeSelected.quandoClicar = clone.quandoClicar;
                                    this.acertosExecutados++;
                                    let quandoAcertar = Object.keys(shapeSelected.quandoAcertar);
                                    shapeSelected.quandoErrar = {};
                                    if (quandoAcertar.length) this.playScript(quandoAcertar, shapeSelected.quandoAcertar, shapeSelected);
                                    if (this.acertosExecutados == Number(this.acertosDoCenario)) return this.playScriptTerminar();
                                    break;
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
                                    if (quandoErrar.length) this.playScript(quandoErrar, shapeSelected.quandoErrar, shapeSelected);
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
                                if (quandoErrar.length) this.playScript(quandoErrar, shapeSelected.quandoErrar, shapeSelected);
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
                        if (quandoErrar.length) this.playScript(quandoErrar, shapeSelected.quandoErrar, shapeSelected);
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