$(document).ready(() => {
    localStorage.setItem('currentGame', null);
    localStorage.setItem('render', null);
    let dateUpdate = new Date(localStorage.getItem('dateUpdate'));
    let online = navigator.onLine; // true ou false, (há, não há conexão à internet)
    let containerFluid = $('.container-fluid');
    if (online && (new Date().getTime() - dateUpdate.getTime() >= 500000) || online && !dateUpdate) {
        let loader = $('.loading');
        $.ajax({
            url: variaveisDeAmbiente.jogosPorAluno.replace(':id', localStorage.getItem('alunoCodigo')),
            type: 'GET',
            headers: {
                "Content-type": "Application/json"
            },
            beforeSend: function () {
                $(loader).removeAttr('hidden');
            },
            success: function (json) {
                if (json) {
                    let jogos = json.result;
                    if (jogos.length) {
                        criarCardJogo(jogos, containerFluid, true);
                    } else {
                        $(loader).attr('hidden', true);
                        $(containerFluid).append("Ops, não possui nenhum jogo ainda.");
                    }
                    $(loader).attr('hidden', true);
                }
                localStorage.setItem('dateUpdate', new Date());
            },
            error: function (err) {
                openDataBase().then((db) => carregarJogosDb(db, containerFluid));
                $(containerFluid).append("Ops, tivemos algum erro de comunicação com o servidor");
                $(loader).attr('hidden', true);
            }
        })
    } else {
        openDataBase().then((db) => carregarJogosDb(db, containerFluid));
    }
});


function criarCardJogo(jogos, containerFluid, online = false) {
    jogos.forEach((jogo) => {
        if (jogo.aluno == localStorage.getItem('alunoCodigo')) {
            let card = `
        <div class="col-md-3 col-sm-4 mb-3"> 
            <div class="card">
                <a href="#" class="card-link">
                    <input type="hidden" class="id" value="${jogo.codigo ? jogo.codigo : jogo.id}" />
                    <input type="hidden" class="nome" value="${jogo.nome}" />
                    <img class="imgGame" data-toggle="tooltip" title="" class="card-img-top" src="${jogo.foto ? atob(bufferToBase64(jogo.foto.data)) : '#'}" alt="${jogo.nome}">
                </a>
                <div class="card-body">
                    <p class="card-text">${jogo.nome}</p>
                </div>
            </div>
        </div>`;
            $(containerFluid).find('.row').append(card);
            if (online) openDataBase().then((db) => addJogo(db, jogo));
        }
    })
    $('.card').each((i, card) => {
        let image = $(card).find('.card-link');
        let id = $(card).find('.id').val();
        let name = $(card).find('.nome').val();
        image.click((e) => {
            e.preventDefault();
            localStorage.setItem('id', id);
            localStorage.setItem('nome', name);
            location.assign('canvas.html');
        })
    });
}

function carregarJogosDb(db, containerFluid) {
    let tx = db.transaction(['jogos'], 'readwrite');
    let store = tx.objectStore('jogos');
    let jogoDB = store.index("id").getAll();
    jogoDB.onsuccess = function () {
        let data = jogoDB.result;
        if (data) {
            criarCardJogo(data, containerFluid);
        }
    }
}


function addJogo(db, jogo) {
    let tx = db.transaction(['jogos'], 'readwrite');
    let store = tx.objectStore('jogos');
    let jogoDB = store.index("id").get(jogo.codigo);
    jogoDB.onsuccess = function () {
        let data = jogoDB.result;
        if (!data) {
            store.add({
                'id': jogo.codigo,
                'jogo': jogo.json,
                'aluno': localStorage.getItem('alunoCodigo'),
                'nome': jogo.nome,
                'foto': jogo.foto
            });
            tx.oncomplete = function () {
                console.log('Salvo com sucesso');
            }
            tx.onerror = function (event) {
                console.log(event);
                alert('Erro ao criar o jogo ');
            }
        } else {
            store.put({
                'id': jogo.codigo,
                'jogo': jogo.json,
                'aluno': localStorage.getItem('alunoCodigo'),
                'nome': jogo.nome,
                'foto': jogo.foto
            });
        }
    }
}