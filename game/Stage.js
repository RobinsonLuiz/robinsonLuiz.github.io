
let movingCorner = -1;
class Stage {

  constructor(canvas, id) {
    this.id = id;
    this.canvas = canvas;
    this.mouse = new Mouse();
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.html = document.body.parentNode;
    this.shapes = [];
    this.fps = 30;
    this.dragging = false;
    this.shapeSelected = -1;
    this.dragoffx = 0;
    this.dragoffy = 0;
    this.toJSON = { Stage: [] };
    this.corners = {
      shapes: [],
      father: -1
    };
    this.liveMode = false;
    this.startEvents();
    this.loop();
  }

  setLiveMode(flag) {
    this.liveMode = flag;
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

  duploClique() {
    this.canvas.addEventListener("dblclick", e => {
      let mouse = this.mouse.getPosition(this, e);
      let mx = mouse.x;
      let my = mouse.y;
      let zIndex = -1;
      for (let i = 0; i < this.shapes.length; i++) {
        if (this.shapes[i].contains(mx, my) && this.shapes[i].zIndex >= zIndex) {
          zIndex = i;
        }
      }
      if (zIndex != -1) {
        let color = document.createElement("input");
        color.type = "color";
        $(color).trigger("click");
        color.addEventListener("change", () => {
          this.shapes[zIndex].updateColor(color.value);
          color.remove();
          zIndex = -1;
        });
      }
    });
  }

  clicar() {
    $(this.canvas).on("mousedown touchdown", e => {
      e.preventDefault();
      alert(JSON.stringify(e));
      let mouse = this.mouse.getPosition(this, e);
      movingCorner = -1;
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        if (this.shapes[i].contains(mouse.x, mouse.y) && !this.shapes[i].used) {
          this.shapeSelected = i;
          this.dragoffx = mouse.x - this.shapes[this.shapeSelected].x;
          this.dragoffy = mouse.y - this.shapes[this.shapeSelected].y;
          this.shapes[this.shapeSelected].posInitialX = this.shapes[this.shapeSelected].x;
          this.shapes[this.shapeSelected].posInitialY = this.shapes[this.shapeSelected].y;
          if (!this.liveMode) {
            this.corners.shapes = [new Shape(this.shapes[this.shapeSelected].x + (this.shapes[this.shapeSelected].width / 2) - 5, this.shapes[this.shapeSelected].y - 7, 13, 13, 99999, true, true, 0, "red"),
            new Shape(this.shapes[this.shapeSelected].x - 5, this.shapes[this.shapeSelected].y + (this.shapes[this.shapeSelected].height / 2) - 3, 13, 13, 99999, true, true, 0, "red"),
            new Shape(this.shapes[this.shapeSelected].x + (this.shapes[this.shapeSelected].width / 2) - 5, this.shapes[this.shapeSelected].y + this.shapes[this.shapeSelected].height - 5, 13, 13, 99999, true, true, 0, "red"),
            new Shape(this.shapes[this.shapeSelected].x + this.shapes[this.shapeSelected].width - 6, this.shapes[this.shapeSelected].y + (this.shapes[this.shapeSelected].height / 2) - 3, 13, 13, 99999, true, true, 0, "red")
            ];
            this.corners.father = this.shapeSelected;
          }
          break;
        }
        this.shapeSelected = -1;
      }
      if (this.corners.shapes.length > 0) {
        for (let corner = 0; corner < this.corners.shapes.length; corner++) {
          if (this.corners.shapes[corner].contains(mouse.x, mouse.y)) {
            movingCorner = corner;
            break;
          }
        }
        if (movingCorner != -1 && this.corners.father != -1) {
          this.dragging = false;
          return;
        }
      }
      if (movingCorner == -1 && this.shapeSelected != -1) {
        this.dragging = true;
        return;
      }
      else {
        this.shapeSelected = -1;
        movingCorner = -1;
        this.corners.shapes = [];
        this.corners.father = -1;
        return;
      }
    });
  }

  addShape(shape) {
    this.toJSON["Stage"].push(shape);
    this.shapes.push(shape);
  }

  json() {
    return this.toJSON;
  }

  removeShape() {
    document.addEventListener("keydown", e => {
      if (this.corners.father != -1 && e.keyCode == 46) {
        this.shapes = this.shapes.filter((a) => a != this.shapes[this.corners.father]);
        this.corners.shapes = [];
        this.corners.father = -1;
        this.toJSON["Stage"] = this.shapes;
      }
    });
  }

  create(json) {
    json["Stage"].forEach(stage => {
      this.addShape(stage);
    });

  }

  loop() {
    setInterval(() => {
      this.getContext().clearRect(0, 0, this.width, this.height);
      for (let i = 0; i < this.shapes.length; i++) this.shapes[i].update();
      this.draw();
    }, 1000 / this.fps);
  }


  draw() {
    this.shapes = this.shapes.sort((a, b) => a.zIndex - b.zIndex);
    for (let i = 0; i < this.shapes.length; i++) this.shapes[i].draw(this.getContext());
    if (this.corners.shapes.length > 0) for (let i = 0; i < this.corners.shapes.length; i++) this.corners.shapes[i].draw(this.getContext());
  }

  movimentar() {
    this.canvas.addEventListener("mousemove", e => {
      let mouse = this.mouse.getPosition(this, e);
      if (this.dragging) {
        this.shapes[this.shapeSelected].x = mouse.x - this.dragoffx;
        this.shapes[this.shapeSelected].y = mouse.y - this.dragoffy;
        this.corners.shapes = [];
        this.corners.father = -1;
      } else {
        let corners = this.corners.shapes;
        if (movingCorner != -1) {
          if (movingCorner == 0) {
            if (corners[2].posInitialY - mouse.y > 30) {
              this.shapes[this.corners.father].height = corners[2].posInitialY - mouse.y + 6;
              this.shapes[this.corners.father].y = mouse.y;
              corners[0].posInitialY = mouse.y;
              corners[1].y = mouse.y + (this.shapes[this.corners.father].height / 2) - 3;
              corners[3].y = mouse.y + (this.shapes[this.corners.father].height / 2) - 3;
              corners[0].y = mouse.y - 8;
            }
          }

          if (movingCorner == 1) {
            if (corners[3].posInitialX - mouse.x > 30) {
              this.shapes[this.corners.father].width = corners[3].posInitialX - mouse.x + 6;
              this.shapes[this.corners.father].x = mouse.x;
              corners[1].posInitialX = mouse.x;
              corners[0].x = mouse.x + (this.shapes[this.corners.father].width / 2) - 5;
              corners[2].x = mouse.x + (this.shapes[this.corners.father].width / 2) - 5;
              corners[1].x = mouse.x - 6;
            }
          }

          if (movingCorner == 2) {
            if (mouse.y - corners[0].posInitialY > 30) {
              this.shapes[this.corners.father].height = mouse.y - corners[0].posInitialY;
              corners[2].posInitialY = mouse.y;
              corners[1].y = mouse.y - (this.shapes[this.corners.father].height / 2) + 3;
              corners[3].y = mouse.y - (this.shapes[this.corners.father].height / 2) + 3;
              corners[2].y = mouse.y + 3;
            }
          }

          if (movingCorner == 3) {
            if (mouse.x - corners[1].posInitialX > 30) {
              this.shapes[this.corners.father].width = mouse.x - corners[1].posInitialX - 6;
              corners[3].posInitialX = mouse.x;
              corners[0].x = mouse.x - (this.shapes[this.corners.father].width / 2) - 5;
              corners[2].x = mouse.x - (this.shapes[this.corners.father].width / 2) - 5;
              corners[3].x = mouse.x - 6;
            }
          }
        }
      }
    });
  }

  soltar() {
    this.canvas.addEventListener("mouseup", e => {
      this.dragging = false;
      if (this.shapeSelected != -1 && this.liveMode) {
        let angle = Math.atan2(this.shapes[this.shapeSelected].posInitialY
          - this.shapes[this.shapeSelected].y, this.shapes[this.shapeSelected].posInitialX
          - this.shapes[this.shapeSelected].x);
        if (this.shapes[this.shapeSelected].velocity != 5) {
          this.shapes[this.shapeSelected].velocityX = this.shapes[this.shapeSelected].velocity * Math.cos(angle);
          this.shapes[this.shapeSelected].velocityY = this.shapes[this.shapeSelected].velocity * Math.sin(angle);
        } else {
          this.shapes[this.shapeSelected].x = this.shapes[this.shapeSelected].posInitialX;
          this.shapes[this.shapeSelected].y = this.shapes[this.shapeSelected].posInitialY;
        }
        // if (this.liveMode) {
        // clone = this.shapes.find(e => e.id == this.shapeSelected.matchId);
        // if (clone) {
        // if (
        //   clone.x - this.shapeSelected.x <= 5 &&
        //   clone.x - this.shapeSelected.x >= -15 &&
        //   (clone.y - this.shapeSelected.y <= 5 || clone.y - this.shapeSelected.y >= 5)
        // ) {
        //   let filters = this.shapes.filter(e => e != clone);
        //   this.shapeSelected.x = clone.x;
        //   this.shapeSelected.y = clone.y;
        //   this.shapes = filters;
        //   this.executeSound(this.shapeSelected.sons.acertou); //todo sons da imagem efeito de erro do objeto
        //   this.shapeSelected.modify = false;
        //   this.toJSON["Stage"] = this.shapes;
        // } else {
        //   this.executeSound(this.shapeSelected.sons.errou); //todo sons da imagem efeito de erro do objeto
        // }
        // }
        // }
      }
    });
  }

  executeSound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.play();
  }

  startEvents() {
    this.duploClique();
    this.clicar();
    this.soltar();
    this.movimentar();
    this.removeShape();
  }
}
