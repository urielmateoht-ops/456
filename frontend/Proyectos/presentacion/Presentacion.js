// JavaScript para tarjeta de presentación

// Función para mostrar/ocultar contacto
function toggleContacto() {
    const contacto = document.getElementById('contact-info');
    const boton = document.getElementById('toggle-contact');
    
    if (contacto.classList.contains('contact-hidden')) {
        contacto.classList.remove('contact-hidden');
        contacto.style.display = 'block';
        boton.textContent = 'Ocultar Contacto';
    } else {
        contacto.classList.add('contact-hidden');
        contacto.style.display = 'none';
        boton.textContent = 'Mostrar Contacto';
    }
}

// Saludo según la hora cuando carga la página
window.onload = function() {
    const hora = new Date().getHours();
    const descripcion = document.querySelector('.description');
    
    let saludo = '';
    if (hora < 12) {
        saludo = '🌅 ¡Buenos días! ';
    } else if (hora < 18) {
        saludo = '☀️ ¡Buenas tardes! ';
    } else {
        saludo = '🌙 ¡Buenas noches! ';
    }
    
    descripcion.innerHTML = saludo + descripcion.innerHTML;
    
    // Agregar evento al botón
    const botonContacto = document.getElementById('toggle-contact');
    if (botonContacto) {
        botonContacto.addEventListener('click', toggleContacto);
    }
}