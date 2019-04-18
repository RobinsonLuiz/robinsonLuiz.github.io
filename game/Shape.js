class Shape {


  constructor(x, y, width, height, zIndex, clickable, visible, velocity, fill = null, id = null, matchId = null, src = null, text = null) {
    this.zIndex = zIndex;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
    this.backGroundColor = fill ? fill : 'white';
    this.posInitialX = x;
    this.posInitialY = y;
    this.clickable = clickable; //clicável
    this.visible = visible; //visível
    this.used = false; //encaixado
    this.velocity = velocity;
    this.velocityX = 0;
    this.velocityY = 0;
    this.matchId = [matchId];
    this.text = text;
    if (src) {
      this.img = new Image();
      this.img.src = src;
    }   
  }

  /**
   * Troca as cores do objeto que tem esta opção
   * @param {Cores} color - valor da cor em HEX
   */
  updateColor(color) {
    this.backGroundColor = color;
  }

  /**
   * Verifica o mouse está em cima do objeto
   * @param {Float} mouseX - posição mouse X
   * @param {Float} mouseY - posição mouse y
   */
  contains(mouseX, mouseY) {
    return ((mouseX >= this.x) && (mouseX <= this.x + this.width) && (mouseY >= this.y) && (mouseY <= this.y + this.height));
  }

  draw(ctx) {
    ctx.fillStyle = this.backGroundColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.save();
    }
    if (this.text) {
      ctx.fillStyle = this.text.fill; //TODO PAINEL PARA ADMINISTRAÇÃO DAS CORES
      ctx.font = `${this.text.tam}px Calibri`; //Fonte Calibri estatico, Dinamico
      this.font += 1;
      ctx.fillText(this.text.value, this.x + (this.width / 2) - (10 * this.text.value.length), this.y + (this.height / 2) + 10);
    }
    // this.transform(ctx);
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
    }
    else {
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  /**
   * Retorna a classe do objeto
   */
  class() {
    return this.__proto__.constructor.name;
  }
}
