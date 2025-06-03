document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const overlayCon = document.getElementById('overlayCon');
    const overlayBtn = document.getElementById('overlayBtn');

    // Alternar entre login y registro desde botones del overlay
    const allOverlayButtons = document.querySelectorAll('.overlay-panel button');
    allOverlayButtons.forEach(button => {
        button.addEventListener('click', () => {
            container.classList.toggle('right-panel-active');
        });
    });

    // Botón invisible adicional, por si se usa
    if (overlayBtn) {
        overlayBtn.addEventListener('click', () => {
            container.classList.toggle('right-panel-active');
            overlayBtn.classList.remove('btnScaled');
            window.requestAnimationFrame(() => {
                overlayBtn.classList.add('btnScaled');
            });
        });
    }

    // Middleware inverso: redirige si ya hay sesión activa
    fetch('../Controlador/Admin_login.php', {
        method: 'POST',
        body: new URLSearchParams({ verificar_sesion: true })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.redirect) {
            window.location.href = data.redirect;
        }
    });

    // FORMULARIO DE LOGIN
    const loginForm = document.querySelector('.sign-in-container form');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = loginForm.querySelector('input[type="text"]');
        const passwordInput = loginForm.querySelector('#login-password');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === '' || password === '') {
            alert("Completa todos los campos.");
            return;
        }

        if (email.includes('@')) {
            alert("Solo escribe tu usuario, no incluyas @ucvvirtual.edu.pe");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        fetch('../Controlador/Admin_login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                alert(data.error || 'Credenciales incorrectas.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el servidor. Inténtalo más tarde.');
        });
    });

    // FORMULARIO DE REGISTRO
    const registerForm = document.querySelector('.sign-up-container form');
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm);

        fetch('../Controlador/Admin_registro.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                alert(data.error || 'Error en el registro.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error del servidor. Inténtalo más tarde.');
        });
    });
});

// Forzar recarga cuando el usuario vuelve con el botón "atrás"
window.addEventListener("pageshow", function (event) {
    if (event.persisted || (performance.navigation.type === 2)) {
        location.reload();
    }
});
