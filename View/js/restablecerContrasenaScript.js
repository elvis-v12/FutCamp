document.getElementById('token').value = new URLSearchParams(window.location.search).get('token');

let currentInput = 'nuevaContrasena';

function addDigit(digit) {
    const input = document.getElementById(currentInput);
    if (input.value.length < 8) {
        input.value += digit;
        document.getElementById(`mrk${input.value.length}`).classList.add('filled');
    }
}

function removeDigit() {
    const input = document.getElementById(currentInput);
    if (input.value.length > 0) {
        document.getElementById(`mrk${input.value.length}`).classList.remove('filled');
        input.value = input.value.slice(0, -1);
    }
}

function clearDigits() {
    const input = document.getElementById(currentInput);
    for (let i = 1; i <= input.value.length; i++) {
        document.getElementById(`mrk${i}`).classList.remove('filled');
    }
    input.value = '';
}

document.getElementById('nuevaContrasena').addEventListener('focus', () => {
    currentInput = 'nuevaContrasena';
});

document.getElementById('confirmarContrasena').addEventListener('focus', () => {
    currentInput = 'confirmarContrasena';
});