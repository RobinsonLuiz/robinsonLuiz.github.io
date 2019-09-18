async function readURL(input, id) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        let compress = await compressImage(input.files[0]);
        reader.onload = function(e) {
            $(id).removeAttr('hidden', false);
            $(id).attr('src', e.target.result);
        }

        reader.readAsDataURL(compress);
    }
}

$("#imgInp").change( async function() {
    await readURL(this, '#imgT');
});

$("#imgInpAtualizar").change( async function() {
    await readURL(this, '#imgTAtualizar');
});