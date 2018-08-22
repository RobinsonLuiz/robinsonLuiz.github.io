let btn_enviar = document.querySelector('.btn-enviar');
let todo_render = document.querySelector('.todolist-render').querySelector('tbody');
btn_enviar.addEventListener('click', function(event) {
    event.preventDefault();
    let todo = document.querySelector('.todo');
    if (todo.value != "") {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("id-"+(localStorage.length + 1), todo.value);
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var td_date = document.createElement('td');
            td_date.textContent = new Date();
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
            td.textContent = todo.value;
            tr.classList.add('id-' + localStorage.length + 1);
            td_button.appendChild(button);
            tr.appendChild(td);
            tr.appendChild(td_date);
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
    var td_date = document.createElement('td');
    td_date.textContent = new Date();
    var button = document.createElement('button');
    button.textContent = "DELETAR";
    button.classList.add('btn');
    button.classList.add('btn-danger');
    td.textContent = local.getItem("id-" + i);
    tr.classList.add('id-' + i);
    td_button.appendChild(button);
    tr.appendChild(td);
    tr.appendChild(td_date);
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