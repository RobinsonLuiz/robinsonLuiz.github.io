var btnLogin = $('#login')
var bodyLogin;
setInterval(() => {
    let fields = document.forms.login;
    let usuario = validaNome(fields.user);
    let senha = validaSenhaLogin(fields.password);
    if (usuario && senha) {
        bodyLogin = {
            usuario,
            senha,
        }
        $(btnLogin).prop("disabled", false);
    } else $(btnLogin).prop("disabled", true);
}, 500);


function validaSenhaLogin(password) {
    return password.value ? password.value : false
}