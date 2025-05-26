document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginFormStudent').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('../api/usuario/estudianteLogin.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
