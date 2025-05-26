// Variable que almacena el índice del dígito actual ingresado
let currentDigitIndex = 0;

// Constante que define el número máximo de dígitos permitidos en la contraseña
const maxDigits = 8;

// Función para agregar un dígito al campo de contraseña
function addDigit(digit) {
    // Verifica si el número actual de dígitos ingresados es menor que el máximo permitido
    if (currentDigitIndex < maxDigits) {
        // Obtiene el elemento de verificación correspondiente al dígito actual
        const checkElement = document.getElementById(`mrk${currentDigitIndex + 1}`);
        // Obtiene el campo de contraseña
        const passwordField = document.getElementById('contrasena');

        // Verifica si los elementos existen
        if (checkElement && passwordField) {
            // Agrega la clase 'filled' al elemento de verificación
            checkElement.classList.add('filled');
            // Agrega el dígito al campo de contraseña
            passwordField.value += digit;
            // Incrementa el índice del dígito actual
            currentDigitIndex++;
        }
    }
}

// Función para eliminar el último dígito del campo de contraseña
function removeDigit() {
    // Verifica si hay dígitos ingresados para eliminar
    if (currentDigitIndex > 0) {
        // Decrementa el índice del dígito actual
        currentDigitIndex--;
        // Obtiene el elemento de verificación correspondiente al dígito actual
        const checkElement = document.getElementById(`mrk${currentDigitIndex + 1}`);
        // Obtiene el campo de contraseña
        const passwordField = document.getElementById('contrasena');

        // Verifica si los elementos existen
        if (checkElement && passwordField) {
            // Remueve la clase 'filled' del elemento de verificación
            checkElement.classList.remove('filled');
            // Elimina el último dígito del campo de contraseña
            passwordField.value = passwordField.value.slice(0, -1);
        }
    }
}

// Función para limpiar todos los dígitos ingresados en el campo de contraseña
function clearDigits() {
    // Itera sobre todos los elementos de verificación
    for (let i = 1; i <= maxDigits; i++) {
        const checkElement = document.getElementById(`mrk${i}`);
        // Verifica si el elemento existe
        if (checkElement) {
            // Remueve la clase 'filled' del elemento de verificación
            checkElement.classList.remove('filled');
        }
    }
    // Obtiene el campo de contraseña
    const passwordField = document.getElementById('contrasena');
    // Verifica si el campo de contraseña existe
    if (passwordField) {
        // Limpia el campo de contraseña
        passwordField.value = '';
    }
    // Reinicia el índice del dígito actual
    currentDigitIndex = 0;
}