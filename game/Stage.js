
let movingCorner = -1;
class Stage {
  stylePaddingLeft;
  stylePaddingTop;
  styleBorderLeft;
  styleBorderTop;
  canvas;
  shapes;
  toJSON;
  constructor(canvas) {
    canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    this.html = document.body.parentNode;
    this.htmlTop = this.html.offsetTop;
    this.htmlLeft = this.html.offsetLeft;
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
    this.loadContext();
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

  loadContext() {
    if (document.defaultView && document.defaultView.getComputedStyle) {
      this.stylePaddingLeft =
        parseInt(
          document.defaultView.getComputedStyle(canvas, null)["paddingLeft"],
          10
        ) || 0;
      this.stylePaddingTop =
        parseInt(
          document.defaultView.getComputedStyle(canvas, null)["paddingTop"],
          10
        ) || 0;
      this.styleBorderLeft =
        parseInt(
          document.defaultView.getComputedStyle(canvas, null)[
          "borderLeftWidth"
          ],
          10
        ) || 0;
      this.styleBorderTop =
        parseInt(
          document.defaultView.getComputedStyle(canvas, null)["borderTopWidth"],
          10
        ) || 0;
    }
  }

  duploClique() {
    canvas.addEventListener("dblclick", e => {
      let mouse = this.getMouse(e);
      let mx = mouse.x;
      let my = mouse.y;
      let shapes = this.shapes;
      for (let i = 0; i < shapes.length; i++) {
        if (shapes[i].contains(mx, my)) {
          let color = document.createElement("input");
          color.type = "color";
          $(color).trigger("click");
          color.addEventListener("change", () => {
            shapes[i].updateColor(color.value);
            color.remove();
          });
        }
      }
    });
  }

  clicar() {
    canvas.addEventListener("mousedown", e => {
      let mouse = this.getMouse(e);
      movingCorner = -1;
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        if (this.shapes[i].contains(mouse.x, mouse.y) && !this.shapes[i].used) {
          this.shapeSelected = i;
          this.dragoffx = mouse.x - this.shapes[this.shapeSelected].x;
          this.dragoffy = mouse.y - this.shapes[this.shapeSelected].y;
          this.shapes[this.shapeSelected].posInitialX = this.shapes[this.shapeSelected].x;
          this.shapes[this.shapeSelected].posInitialY = this.shapes[this.shapeSelected].y;
          this.corners.shapes = [new Shape(this.shapes[this.shapeSelected].x + (this.shapes[this.shapeSelected].width / 2) - 3, this.shapes[this.shapeSelected].y - 7, 10, 10, 1, true, true, 0, "red"),
          new Shape(this.shapes[this.shapeSelected].x - 3, this.shapes[this.shapeSelected].y + (this.shapes[this.shapeSelected].height / 2) - 3, 10, 10, 1, true, true, 0, "red"),
          new Shape(this.shapes[this.shapeSelected].x + (this.shapes[this.shapeSelected].width / 2) - 3, this.shapes[this.shapeSelected].y + this.shapes[this.shapeSelected].height - 5, 10, 10, 1, true, true, 0, "red"),
          new Shape(this.shapes[this.shapeSelected].x + this.shapes[this.shapeSelected].width - 3, this.shapes[this.shapeSelected].y + (this.shapes[this.shapeSelected].height / 2) - 3, 10, 10, 1, true, true, 0, "red")
          ];
          this.corners.father = this.shapeSelected;
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
      if (this.shapeSelected != -1 && e.keyCode == 46) {
        this.shapes.splice(this.shapeSelected, 1);
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
      for (let i = 0; i < this.shapes.length; i++) {
        this.shapes[i].update();
      }
      this.draw();
    }, 1000 / this.fps);
  }


  draw() {
    this.shapes = this.shapes.sort((a, b) => a.zIndex - b.zIndex);
    for (let i = 0; i < this.shapes.length; i++) this.shapes[i].draw(this.getContext());
    if (this.corners.shapes.length > 0) for (let i = 0; i < this.corners.shapes.length; i++) this.corners.shapes[i].draw(this.getContext());
  }

  movimentar() {
    canvas.addEventListener("touchmove", e => {
      let mouse = this.getMouse(e);
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
              this.shapes[this.corners.father].height = corners[2].posInitialY - mouse.y;
              this.shapes[this.corners.father].y = mouse.y;
              corners[0].posInitialY = mouse.y;
              corners[1].y = mouse.y + (this.shapes[this.corners.father].height / 2);
              corners[3].y = mouse.y + (this.shapes[this.corners.father].height / 2);
              corners[0].y = mouse.y - 6;
            }
          }

          if (movingCorner == 1) {
            if (corners[3].posInitialX - mouse.x > 30) {
              this.shapes[this.corners.father].width = corners[3].posInitialX - mouse.x;
              this.shapes[this.corners.father].x = mouse.x;
              corners[1].posInitialX = mouse.x;
              corners[0].x = mouse.x + (this.shapes[this.corners.father].width / 2);
              corners[2].x = mouse.x + (this.shapes[this.corners.father].width / 2);
              corners[1].x = mouse.x - 6;
            }
          }

          if (movingCorner == 2) {
            if (mouse.y - corners[0].posInitialY > 30) {
              this.shapes[this.corners.father].height = mouse.y - corners[0].posInitialY;
              corners[2].posInitialY = mouse.y;
              corners[1].y = mouse.y - (this.shapes[this.corners.father].height / 2);
              corners[3].y = mouse.y - (this.shapes[this.corners.father].height / 2);
              corners[2].y = mouse.y + 6;
            }
          }

          if (movingCorner == 3) {
            if (mouse.x - corners[1].posInitialX > 30) {
              this.shapes[this.corners.father].width = mouse.x - corners[1].posInitialX;
              corners[3].posInitialX = mouse.x;
              corners[0].x = mouse.x - (this.shapes[this.corners.father].width / 2);
              corners[2].x = mouse.x - (this.shapes[this.corners.father].width / 2);
              corners[3].x = mouse.x + 6;
            }
          }
        }
      }
    });
    canvas.addEventListener("mousemove", e => {
      let mouse = this.getMouse(e);
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
              this.shapes[this.corners.father].height = corners[2].posInitialY - mouse.y;
              this.shapes[this.corners.father].y = mouse.y;
              corners[0].posInitialY = mouse.y;
              corners[1].y = mouse.y + (this.shapes[this.corners.father].height / 2);
              corners[3].y = mouse.y + (this.shapes[this.corners.father].height / 2);
              corners[0].y = mouse.y - 6;
            }
          }

          if (movingCorner == 1) {
            if (corners[3].posInitialX - mouse.x > 30) {
              this.shapes[this.corners.father].width = corners[3].posInitialX - mouse.x;
              this.shapes[this.corners.father].x = mouse.x;
              corners[1].posInitialX = mouse.x;
              corners[0].x = mouse.x + (this.shapes[this.corners.father].width / 2);
              corners[2].x = mouse.x + (this.shapes[this.corners.father].width / 2);
              corners[1].x = mouse.x - 6;
            }
          }

          if (movingCorner == 2) {
            if (mouse.y - corners[0].posInitialY > 30) {
              this.shapes[this.corners.father].height = mouse.y - corners[0].posInitialY;
              corners[2].posInitialY = mouse.y;
              corners[1].y = mouse.y - (this.shapes[this.corners.father].height / 2);
              corners[3].y = mouse.y - (this.shapes[this.corners.father].height / 2);
              corners[2].y = mouse.y + 6;
            }
          }

          if (movingCorner == 3) {
            if (mouse.x - corners[1].posInitialX > 30) {
              this.shapes[this.corners.father].width = mouse.x - corners[1].posInitialX;
              corners[3].posInitialX = mouse.x;
              corners[0].x = mouse.x - (this.shapes[this.corners.father].width / 2);
              corners[2].x = mouse.x - (this.shapes[this.corners.father].width / 2);
              corners[3].x = mouse.x + 6;
            }
          }
        }
      }
    });
  }

  soltar() {
    canvas.addEventListener("mouseup", e => {
      this.dragging = false;
      if (this.shapeSelected != -1 && !this.dragging) {
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

  getMouse(e) {
    let element = canvas,
      offsetX = 0,
      offsetY = 0,
      mx,
      my;
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    return { x: mx, y: my };
  }

  startEvents() {
    this.duploClique();
    this.clicar();
    this.soltar();
    this.movimentar();
    this.removeShape();
  }
}
