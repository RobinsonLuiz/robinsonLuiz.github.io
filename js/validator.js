function validaNome(name) {
    if (name.value && name.value.length <= 3) {
        name.classList.remove('color-btn');
        name.classList.remove('correto');
        name.classList.add('errado');
    } else {
        name.classList.add('correto');
        name.classList.remove('errado');
        return name.value;
    }
}

function validaSenha(senha, csenha) {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9_\s\-]*[a-zA-Z0-9](?<![_\s\-]{2,}.*)$/
    let confirm = senha.value.match(regex)
    if (senha.value && csenha.value) {
        if (senha.value == csenha.value && confirm && confirm.length >= 1) {
            senha.classList.remove('color-btn');
            senha.classList.remove('errado');
            senha.classList.add('correto');
            csenha.classList.remove('color-btn');
            csenha.classList.remove('errado');
            csenha.classList.add('correto');
            return senha.value;
        } else {
            senha.classList.remove('color-btn');
            senha.classList.remove('correto');
            senha.classList.add('errado');
            csenha.classList.remove('color-btn');
            csenha.classList.remove('correto');
            csenha.classList.add('errado');
            return false;
        }
    }
}