let buttonScriptFig = $('.btn-script-figura');
let buttonDelScriptFig = $('.btn-del-script-figura');
let modalFuncFigura = $('#adicionar-scripts');
let selectScriptFigura = $('.scripts-figura');
let selectFromScenes = $('.scenes');
let scripts = $('.scripts-val-figura');
let cenarios = $('.selecionar-cenarios');
let actions = $('.actions');
let buttonSaveScript = $('.btn-save-script');

game.getStages().forEach((stage) => {
    $(selectFromScenes).append(`<option value="${stage.id}"> ${stage.name ? stage.name : 'Cenário Principal'} </option>`)
})

$(actions).on('change', function(event) {
    if (Number($(actions).val()) == 4) $(cenarios).css('display', 'flex');
    else $(cenarios).css('display', 'none');
})

$(buttonScriptFig).on('click', function(event) {
    event.preventDefault();
    if ($(selectScriptFigura).val()) $(modalFuncFigura).modal('show');
})

$(buttonDelScriptFig).on('click', function(event) {
    event.preventDefault();
    let options = $(scripts).find('option');
    $(options).each((index, opt) => {
        $(scripts).val().forEach((val) => {
            if (opt.value == val) {
                $(opt).remove();
                // TODO DESVINCULAR SCRIPT DA FIGURA
                return;
            }
        });
    });
});

/*
    0 - mostrar figura
    1 - tocar som
    2 - vai para fase anterior
    3 - vai para proxima fase
    4 - vai para fase desejada
    5 - terminar
*/
$(actions).on('change', function(event) {
    let scriptAssign = $(actions).val();
    let input = $('<input/>')
    .attr('type', "file")
    .attr('name', "file")
    .attr('id', "add-script");
    switch(Number(scriptAssign)) {
        case 0:
            input.attr('accept', 'image/*')
            input.trigger('click');
            $('body').append(input);
            input.change( async function() {
                await readURL(this, "#add-script");
                $(scripts).append('<option> mostrar figura </option>');
                $(buttonSaveScript).trigger('click');
                $('body').find('#add-script').remove();
            });
            break;
        case 1:
            input.attr('accept', 'audio/*')
            input.trigger('click');
            $('body').append(input);
            input.change( async function() {
                await addSound(this.files[0]);
                $(scripts).append('<option> tocar som </option>');
                $(buttonSaveScript).trigger('click');
                $('body').find('#add-script').remove();
            });
            break;
        case 2:
            $(scripts).append('<option> vai para fase anterior </option>');
            $(buttonSaveScript).trigger('click');
            break;
        case 3:
            $(scripts).append('<option> vai para próxima fase </option>');
            $(buttonSaveScript).trigger('click');
            break;
        case 4:
            break;
        case 5:
            $(scripts).append('<option> terminar </option>');
            $(buttonSaveScript).trigger('click');
            break;
        default:
            break;
        }
    $(actions).val(-1);
})

$(buttonSaveScript).on('click', function(event) {
    $(modalFuncFigura).modal('hide');  
});

setInterval(() => {
    let optionNext = $(actions).find('option')[3];
    $(selectFromScenes).find('option').each((index, option) => {
        if (option.value == game.getCurrentStage().id) $(option).attr('hidden', true);
        else $(option).attr('hidden', false);
    });
    if (game.getCurrentStage().id == 1) {
        $(optionNext).attr('hidden', true);
    } else {
        $(optionNext).attr('hidden', false);
    }
}, 1000);



function addSound(file) {
    return new Promise((resolve, reject) => {   
        try { 
            let reader = new FileReader();
            reader.onload = function(e) {
                return resolve(this.result)
            };
            let newBlob = new Blob([file.slice(0, 1000000)],    { type:"audio/mp3" });
            reader.readAsDataURL(newBlob);
        } catch (err) {
            return reject(err);
        }
    })
}




