hashCode = function (s) {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};

function createId() {
  return Math.abs(
    hashCode(
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 10) +
      Math.random() * 10
    )
  );
}

function renderElements(stage, typeBox, coords = null) {
  let rectX = coords
    ? coords.x - 320
    : stage.getHeight() / 2 - 25 - Math.random() * 250;
  let rectY = coords
    ? coords.y - 370
    : stage.getWidth() / 2 - 50 - Math.random() * 250;
  let box;
  let id = createId();
  switch (typeBox) {
    case "rectangle":
      box = new Shape(rectX, rectY, 100, 100, 1, true, true, 10, null, id, null);
      break;
  }
  //10 lento
  //30 normal
  //50 rapido
  //100 teletransporte
  stage.addShape(box);
}

let stage = new Stage(document.querySelector("canvas"), 1);
document.querySelector(".newBox").addEventListener("click", function () {
  let typeBox = document.querySelector(".typeBox").value;
  renderElements(stage, typeBox);
});

let text = document.querySelector(".btn-text");

text.addEventListener("click", function () {
  let textValue = document.querySelector(".text-input").value;
  let id = createId();
  let textClone = new Shape(Math.random() * 800, Math.random() * 600, 100 + (10*textValue.length), 100, 1, true, true, 10, null, id, 
    null, null, { value: textValue, tam: 40, fill: 'black' });
  stage.addShape(textClone);
});

let image = document.querySelector("#image_file");
var oReader = new FileReader();
let imageBase64;
image.addEventListener("change", function (e) {
  var oFile = document.getElementById("image_file").files[0];
  oReader.onload = function (e) {
    imageBase64 = e.target.result;
  };
  oReader.readAsDataURL(oFile);
});

let addImage = document.querySelector("#add_image");
addImage.addEventListener('click', function () {
  let id = createId();
  if (imageBase64) {
    stage.addShape(
      new Shape(Math.random() * 800, Math.random() * 600, 300, 200, 2, true, true, 10, null, id,
        null, imageBase64));
  };
})

let valorVelocidades = {
  'lenta': 10,
  'medio': 30,
  'alta': 50,
  'teletransporte': 5
}


let velocidades = document.querySelector('.velocidades');

velocidades.addEventListener('change', function() {
  stage.shapes[stage.shapeSelected].velocity = valorVelocidades[this.value];
})

