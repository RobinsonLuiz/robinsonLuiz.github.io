let image = document.querySelector("#image_file");
let fotoCanvas = $('#fotoCanvas');

image.addEventListener("change", async function (e) {
    let oFile = document.getElementById("image_file").files[0];
    oFile = await compressImage(oFile);
    let oReader = new FileReader();
    oReader.onload = function (e) {
        $(fotoCanvas).attr('src', this.result);
        $("#configFoto").modal('show');
    };
    oReader.readAsDataURL(oFile);
});

$('.btn-foto').on('click', (event) => {
    event.preventDefault();
    let background = $("#background").prop('checked');
    let bordas = $("#bordasFoto").prop('checked');
    if (background) {
        stage.addShape(
            new Shape(0, 0, stage.getCanvas().width, stage.getCanvas().height, -10, false, true, 10, null, id,
                [], $(fotoCanvas).attr('src'), '', 1, null, bordas));
    } else {
        stage.addShape(
            new Shape(Math.random() * 800, Math.random() * 600, 300, 200, 2, true, true, 10, null, id,
            [], $(fotoCanvas).attr('src'), '', 1, null, bordas));
    }
    insertPossibleId(game);
});