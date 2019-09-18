$(document).ready(function() {
    let body = $('body');
    $(body).css('display', 'none');
    $(body).fadeIn(4000, () => $(body).fadeOut(4000, () => window.location.assign('intro.html')));
})