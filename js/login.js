let error_register = $('.error-login');
let success_register = $('.success-login');
let modal = $('#loginModal');

btnLogin.click((e) => {
    e.preventDefault();
    let online = navigator.onLine;
    let loader = $('.loading');
    if (online) {
        $.ajax(variaveisDeAmbiente.alunoLogin, {
            method: 'POST',
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(bodyLogin),
            beforeSend: function () {
                $(loader).removeAttr('hidden');
            },
            success: function (json) {
                if (json) {
                    let aluno = json.result;
                    $(loader).attr('hidden', true);
                    if (!aluno || !aluno.codigo) return $(error_register).removeAttr('hidden');
                    else {
                        $(success_register).removeAttr('hidden');
                        $(error_register).attr("hidden", true);
                        setTimeout(() => {
                            $(success_register).attr("hidden", true);
                            $(modal).modal('hide');
                            localStorage.setItem("alunoCodigo", aluno.codigo);
                            localStorage.setItem('alunoLogin', aluno.usuario);
                            localStorage.setItem('alunoSenha', aluno.senha);
                            openDataBase().then(async (db) => {
                                await addAluno(db, aluno);
                            })
                            window.location.assign("./jogos.html");
                        }, 1500);
                    }
                }
            },
            error: function (err) {
                openDataBase().then((db) => carregarJogosDb(db, containerFluid));
                $(containerFluid).append("Ops, tivemos algum erro de comunicação com o servidor");
                $(loader).attr('hidden', true);
            }
        })
    } else {
        if (localStorage.getItem('alunoLogin') == bodyLogin.usuario && localStorage.getItem('alunoSenha') == bodyLogin.senha) {
            $(success_register).removeAttr('hidden');
            $(error_register).attr("hidden", true);
            setTimeout(() => {
                $(success_register).attr("hidden", true);
                $(modal).modal('hide');
                window.location.assign("./jogos.html");
            }, 1500);
        }
    }
});


function addAluno(db, aluno) {
    return new Promise((resolve, reject) => {
        let tx = db.transaction(['aluno'], 'readwrite');
        let store = tx.objectStore('aluno');
        let jogoDB = store.index("codigo").get(Number(aluno.codigo));
        jogoDB.onsuccess = function() {
            let data = jogoDB.result;
            if (data) {
                data = aluno;
                let requestUpdate = store.put(data);
                requestUpdate.onerror = function(event) {
                    console.log(event);
                    return reject(event);
                };
                requestUpdate.onsuccess = function(event) {
                    return resolve('ok')
                };
            } else {
                store.add(aluno);
                tx.oncomplete = function() {
                    return resolve('ok');
                }
                tx.onerror = function(event) {
                    console.log(event);
                    alert('Erro ao criar o aluno');
                }
            }
        }
    })
}