const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    // Consultar API
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.alerta');

    if (!alerta) { // Para no insertar más alertas
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3',
            'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');
        divAlerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `;
        container.appendChild(divAlerta);

        setTimeout(() => {
            if (divAlerta) {
                divAlerta.remove();
            }
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '9bb4c8c457b0d1b14194c1c68a6e7bd4';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }

            // Imprimir la respuesta en HTML
            mostrarClima(datos);
        });    
}

function mostrarClima(datos) {
    const {name, main: {temp, temp_max, temp_min} } = datos;

    const temperaturaCelsius = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    // Scripting para temperaturas
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('text-2xl', 'font-bold')

    const tempActual = document.createElement('p');
    tempActual.innerHTML = `
        ${temperaturaCelsius} &#8451;`;
    tempActual.classList.add('font-bold', 'text-6xl'); 

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-white', 'text-center');    
    

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempActual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultado.appendChild(resultadoDiv);
}

// Helpers
const kelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}