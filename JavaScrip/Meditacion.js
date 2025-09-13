// ===== VARIABLES GLOBALES =====
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('mensaje');
const subscribeBtn = document.getElementById('subscribeBtn');

// ===== INICIALIZACIÓN CUANDO CARGA LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar validación en tiempo real
    setupRealTimeValidation();
    
    // Configurar animaciones de scroll
    observeElements();
    
    // Configurar navegación suave
    setupSmoothScroll();
    
    // Configurar el formulario
    setupFormSubmission();
    
    console.log('🧘‍♀️ Mindful App cargada correctamente');
});

// ===== CONFIGURACIÓN DE VALIDACIÓN EN TIEMPO REAL =====
function setupRealTimeValidation() {
    // Validar nombre mientras se escribe
    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName); // También al perder foco
    
    // Validar email mientras se escribe
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    
    // Validar mensaje mientras se escribe
    messageInput.addEventListener('input', validateMessage);
    messageInput.addEventListener('blur', validateMessage);
}

// ===== FUNCIONES DE VALIDACIÓN INDIVIDUAL =====

/**
 * Valida el campo nombre
 * @returns {boolean} - true si es válido, false si no
 */
function validateName() {
    const name = nameInput.value.trim();
    const nameGroup = nameInput.parentElement;
    const errorElement = document.getElementById('nameError');
    
    // Verificar que tenga al menos 2 caracteres
    if (name.length < 2) {
        showError(nameGroup, errorElement, 'El nombre debe tener al menos 2 caracteres');
        return false;
    } 
    // Verificar que no tenga números
    else if (/\d/.test(name)) {
        showError(nameGroup, errorElement, 'El nombre no debe contener números');
        return false;
    } 
    else {
        hideError(nameGroup, errorElement);
        return true;
    }
}

/**
 * Valida el campo email con expresión regular
 * @returns {boolean} - true si es válido, false si no
 */
function validateEmail() {
    const email = emailInput.value.trim();
    const emailGroup = emailInput.parentElement;
    const errorElement = document.getElementById('emailError');
    
    // Expresión regular para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showError(emailGroup, errorElement, 'El correo electrónico es obligatorio');
        return false;
    } 
    else if (!emailRegex.test(email)) {
        showError(emailGroup, errorElement, 'Por favor, ingresa un correo electrónico válido');
        return false;
    } 
    else {
        hideError(emailGroup, errorElement);
        return true;
    }
}

/**
 * Valida el campo mensaje
 * @returns {boolean} - true si es válido, false si no
 */
function validateMessage() {
    const message = messageInput.value.trim();
    const messageGroup = messageInput.parentElement;
    const errorElement = document.getElementById('messageError');
    
    if (message.length < 10) {
        showError(messageGroup, errorElement, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    } 
    else if (message.length > 500) {
        showError(messageGroup, errorElement, 'El mensaje no debe exceder 500 caracteres');
        return false;
    }
}