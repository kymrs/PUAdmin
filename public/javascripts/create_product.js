function validateFileExtension(thumbnail) {
    if(!/.(\.jpg|\.jpeg|\.png|\.gif)$/i.test(thumbnail.value)) {
        alert("Hanya file gambar yang diizinkan (jpg, jpeg, png, gif).");
        thumbnail.value = "";
        thumbnail.focus();
        return false;
    }
    return true;
}