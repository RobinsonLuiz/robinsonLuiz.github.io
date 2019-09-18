function bufferToBase64(buf) {
    let binstr = Array.prototype.map.call(buf, (ch) => String.fromCharCode(ch)).join('');
    return btoa(binstr);
}

function getIdade(data) {
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        ano_aniversario = +data.getFullYear(),
        mes_aniversario = +data.getMonth() + 1,
        dia_aniversario = +data.getDate(),

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
}


function base64ToArrayBuffer(base64) {
    let binaryString = atob(base64);
    let len = binaryString.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes.buffer;
}