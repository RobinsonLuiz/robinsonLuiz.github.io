$('.possible-ids').selectpicker();

class Shape {


    constructor(x,
        y,
        width,
        height,
        zIndex,
        clickable,
        visible,
        velocity,
        fill = null,
        id = null,
        matchId = [],
        base64Image = null,
        text = null,
        opacity = 1,
        primarySound = null,
        bordas = true,
        dificult = 0,
        quandoClicar={},
        quandoAcertar={},
        quandoErrar={}) {
        this.dificult = dificult;
        this.primarySound = primarySound;
        this.opacity = opacity;
        this.zIndex = zIndex;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.backGroundColor = fill ? fill : '#FFFFFF';
        this.posInitialX = x;
        this.posInitialY = y;
        this.clickable = clickable; //clicável
        this.visible = visible; //visível
        this.used = false; //encaixado
        this.velocity = velocity;
        this.velocityX = 0;
        this.velocityY = 0;
        this.matchId = matchId;
        this.text = text;
        this.image64 = base64Image;
        this.bordas = bordas;
        this.quandoClicar = quandoClicar;
        this.quandoAcertar = quandoAcertar;
        this.quandoErrar = quandoErrar;
        if (base64Image) {
            this.img = new Image();
            this.img.src = base64Image;
        }
    }

    //resize in mode tablet
    resize(previousHeight, previousWidth, height, width) {
        this.width = (this.width / previousWidth) * width;
        this.height = (this.height / previousHeight) * height;
        this.x = (this.x / previousWidth) * width;
        this.y = (this.y / previousHeight) * height;
    }

    /**
     * Troca as cores do objeto que tem esta opção
     * @param {Cores} color - valor da cor em HEX
     */
    updateColor(color) {
        this.backGroundColor = color;
    }

    playSound() {
        this.sound = document.createElement("audio");
        this.sound.src = this.primarySound;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.play();
    }

    /**
     * Verifica o mouse está em cima do objeto
     * @param {Float} mouseX - posição mouse X
     * @param {Float} mouseY - posição mouse y
     */
    contains(mouseX, mouseY) {
        return  (this.x <= mouseX) && (this.x + this.width >= mouseX) &&
        (this.y <= mouseY) && (this.y + this.height >= mouseY);
    }

    draw(ctx) {
        if (this.visible) {
            ctx.globalAlpha = this.opacity;
            if (this.img || this.text) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0)';
            } else ctx.fillStyle = this.backGroundColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.bordas) {
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
            if (this.img && this.img.src) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
                ctx.save();
            }
            if (this.text) {
                ctx.fillStyle = this.text.fill; //TODO PAINEL PARA ADMINISTRAÇÃO DAS CORES
                ctx.font = `${this.text.tam}px Calibri`; //Fonte Calibri estatico, Dinamico
                this.font += 1;
                ctx.fillText(this.text.value, this.x + (this.width / 2) - (10 * this.text.value.length), this.y + (this.height / 2) + 10);
            }
            ctx.restore();
        }
    }
    
    /**
     * Update de velocidade
     */
    update() {
        if ((Math.abs(this.x - this.posInitialX) <= this.velocity) && (Math.abs(this.y - this.posInitialY) <= this.velocity)) {
            this.velocityX = 0;
            this.velocityY = 0;
            this.x = this.posInitialX;
            this.y = this.posInitialY;
        } else {
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
    }

    centerX() {
        return this.x + this.halfWidth();
    }

    centerY() {
        return this.y + this.halfHeight();
    }

    halfWidth() {
        return this.width / 2;
    }

    halfHeight() {
        return this.height / 2;
    }

    /**
     * Retorna a classe do objeto
     */
    class() {
        return this.__proto__.constructor.name;
    }
}