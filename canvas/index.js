$(document).ready(() => {
    $('.sp-dd').remove();
    // $('#iniciarJogo').modal('show');
})
let inGame = null;
let codigoJogo = null;
if (localStorage.getItem('currentGame') != 'null') {
    inGame = JSON.parse(localStorage.getItem('currentGame'));
    $('.nome-game').val(inGame.nome);
    codigoJogo = inGame.id;
}

let fotoJogo = localStorage.getItem('foto');
let imagemTemporaria = $('#imgT');
let saveDataCanvas = $('.save-canvas-game');
let error_register = $('.error');
let success_register = $('.success');


if (fotoJogo) {
    $(imagemTemporaria).removeAttr('hidden');
    $(imagemTemporaria).attr('src', fotoJogo);
}

$(saveDataCanvas).on('click', function(event) {
    event.preventDefault()
    let forms = document.forms.game;
    let formData = new FormData();
    let foto = $(imagemTemporaria).attr('src');
    if (foto !== '#' && foto.match(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi))
        formData.append('foto', foto);
    formData.append('json', game.base64());
    formData.append('aluno', localStorage.getItem('alunoCodigo'));
    formData.append('nome', forms.nome.value);
    $.ajax({
        url: codigoJogo ? variaveisDeAmbiente.atualizarJogo.replace(':id', codigoJogo) : variaveisDeAmbiente.criarJogo,
        data: formData,
        type: codigoJogo ? 'PUT' : 'POST',
        contentType: false,
        processData: false,
        success: function(success) {
            let result = success.result;
            if (!result || !result.affectedRows) return $(error_register).removeAttr('hidden');
            else {
                if (!codigoJogo) {
                    localStorage.setItem('currentGame', JSON.stringify({
                        id: result.insertId,
                        nome: forms.nome.value,
                        foto
                    }));
                    console.log(localStorage.getItem('currentGame'));
                }
                $(success_register).removeAttr('hidden');
                setTimeout(() => {
                    openDataBase().then((db) => {
                        atualizarJogo(db, {
                            game: JSON.stringify({ game: game.base64(), type: 'indexedDB' })
                        }).then(() => {
                            $(success_register).attr("hidden", true);
                            $('#saveGame').modal('hide');
                        });
                    })
                }, 2500);
            }
        },
        error: function(err) {
            console.log(err);
            $(error_register).removeAttr('hidden');
        }
    });
})

function atualizarJogo(db, href) {
    return new Promise((resolve, reject) => {
        let tx = db.transaction(['jogos'], 'readwrite');
        let store = tx.objectStore('jogos');
        let jogoDB = store.index("id").get(codigoJogo ? String(codigoJogo) : 0);
        jogoDB.onsuccess = function() {
            let data = jogoDB.result;
            if (data) {
                data.jogo = href;
                let requestUpdate = store.put(data);
                requestUpdate.onerror = function(event) {
                    console.log(event);
                    return reject(event);
                };
                requestUpdate.onsuccess = function(event) {
                    return resolve('ok')
                };
            } else {
                return resolve('');
            }
        }
    })
}

// window.onbeforeunload = function () {
//     return "Não será apresentado na tela";
// }