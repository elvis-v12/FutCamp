document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            fetch('../Controlador/logout.php')
                .then(() => {
                    window.location.href = '../Vista/index.html';
                })
                .catch(error => {
                    console.error('Error al cerrar sesión:', error);
                    alert('No se pudo cerrar sesión. Intenta de nuevo.');
                });
        });
    }
});
