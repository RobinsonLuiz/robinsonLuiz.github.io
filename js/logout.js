$('.btn-sair').on('click', function(event) {
    event.preventDefault();
    localStorage.clear();
    location.assign('index.html');
})