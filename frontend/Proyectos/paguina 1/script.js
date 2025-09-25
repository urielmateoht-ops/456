// Seleccionamos los elementos HTML que vamos a manipular
const bioElemento = document.getElementById('bio');
const botonCambiar = document.getElementById('cambiarBioBtn');

// Definimos un texto alternativo para la biografía
const bioAlternativa = "Me encanta aprender a programar y crear cosas increíbles para la web.";

// Añadimos un "escuchador" de eventos al botón para detectar clics
botonCambiar.addEventListener('click', () => {
    // Obtenemos el texto actual de la biografía
    const bioActual = bioElemento.textContent;

    // Si el texto actual es el original, lo cambiamos por el alternativo
    if (bioActual === 'Soy un desarrollador en formación apasionado por la tecnología.') {
        bioElemento.textContent = bioAlternativa;
    } else {
        // Si no, lo volvemos a cambiar por el texto original
        bioElemento.textContent = 'Soy un desarrollador en formación apasionado por la tecnología.';
    }
});