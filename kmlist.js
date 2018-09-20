let btn_enviar = document.querySelector('.btn-enviar');
let todo_render = document.querySelector('.todolist-render').querySelector('tbody');
btn_enviar.addEventListener('click', function(event) {
    event.preventDefault();
    let todo = document.querySelector('.adp');
    if (todo) {
        if (typeof(Storage) !== "undefined") {
            let rotas = [];
            todo.querySelectorAll('.adp-text').forEach(item => {
                rotas.push(item.textContent);
            });
            let rotas_send = {
                "rotas": rotas,
                "km": document.querySelector('#total').textContent
            }
            localStorage.setItem("id-"+(localStorage.length + 1), JSON.stringify(rotas_send));
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var td_rota1 = document.createElement('td');
            td_rota1.textContent = rotas[0];
            var td_rota2 = document.createElement('td');
            td_rota2.textContent = rotas[1];
            var td_button = document.createElement('td');
            var button = document.createElement('button');
            button.textContent = "DELETAR";
            button.classList.add('btn');
            button.classList.add('btn-danger');
            button.addEventListener('click', function(event) {
                event.preventDefault();
                local.removeItem("id-" + (localStorage.length));
                button.parentElement.parentElement.remove();
            })
            td.textContent = document.querySelector('#total').textContent;
            tr.classList.add('id-' + localStorage.length + 1);
            td_button.appendChild(button);
            tr.appendChild(td);
            tr.appendChild(td_rota1);
            tr.appendChild(td_rota2);
            tr.appendChild(td_button);
            todo_render.appendChild(tr);
            todo.value = "";
        }
    }
})
let local = localStorage;
for(let i = 1; i <= localStorage.length; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var td_button = document.createElement('td');
    var td_rota1 = document.createElement('td');
    var td_rota2 = document.createElement('td');
    td_rota1.textContent = JSON.parse(local.getItem("id-" + i)).rotas[0];
    td_rota2.textContent = JSON.parse(local.getItem("id-" + i)).rotas[1];
    var button = document.createElement('button');
    button.textContent = "DELETAR";
    button.classList.add('btn');
    button.classList.add('btn-danger');
    td.textContent = JSON.parse(local.getItem("id-" + i)).km;
    tr.classList.add('id-' + i);
    td_button.appendChild(button);
    tr.appendChild(td);
    tr.appendChild(td_rota1);
    tr.appendChild(td_rota2);
    tr.appendChild(td_button);
    todo_render.appendChild(tr);
}
 let buttons_del = document.querySelectorAll('.btn-danger');
buttons_del.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        local.removeItem(button.parentElement.parentElement.className);
        button.parentElement.parentElement.remove();
    })
}) 