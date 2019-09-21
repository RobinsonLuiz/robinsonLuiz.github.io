let text = document.querySelector(".btn-text");
text.addEventListener("click", function () {
    let textValue = $(".text-input").val();
    let fracionado = $('#fracionado').prop('checked');
    let tamanhoLetra = $('#tamanhoLetra').val();
    let bordas = $('#bordas').prop('checked');
    if (textValue) {
        if (fracionado) {
            for (let i = 0; i < textValue.length; i++) {
                let textoFracionado = new Shape(Math.random() * 800, Math.random() * 600, tamanhoLetra * textValue.length, 100, 1, true, true, 10, null, id,
                    [], null, { value: textValue[i], tam: tamanhoLetra, fill: 'black' });
                stage.addShape(textoFracionado);
                insertPossibleId(id, game);
                ++id;
            }
        } else {
            let texto = new Shape(Math.random() * 800, Math.random() * 600, tamanhoLetra * textValue.length, 100, 1, true, true, 10, null, id,
                [], null, { value: textValue, tam: tamanhoLetra, fill: 'black' }, 1, null, bordas ? true : false);
            stage.addShape(texto);
            insertPossibleId(id, game);
            ++id;
        }
        $('#adicionarTexto').modal('hide');
    }
});