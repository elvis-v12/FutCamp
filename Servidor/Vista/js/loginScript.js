const container = document.getElementById('container');
const allOverlayButtons = document.querySelectorAll('.overlay-panel button');

allOverlayButtons.forEach(button => {
    button.addEventListener('click', () => {
        container.classList.toggle('right-panel-active');
    });
});
const overlayBtn = document.getElementById('overlayBtn');
if (overlayBtn) {
    overlayBtn.addEventListener('click', () => {
        container.classList.toggle('right-panel-active');
    });
}