"use strict";

var container = document.querySelector('.container');
var resultado = document.querySelector('#resultado');
var formulario = document.querySelector('#formulario');
window.addEventListener('load', function () {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
  e.preventDefault(); // Validar

  var ciudad = document.querySelector('#ciudad').value;
  var pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios');
    return;
  } // Consultar API


  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  var alerta = document.querySelector('.alerta');

  if (!alerta) {
    // Para no insertar más alertas
    var divAlerta = document.createElement('DIV');
    divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');
    divAlerta.innerHTML = "\n        <strong class=\"font-bold\">Error!</strong>\n        <span class=\"block\">".concat(mensaje, "</span>\n        ");
    container.appendChild(divAlerta);
    setTimeout(function () {
      if (divAlerta) {
        divAlerta.remove();
      }
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  var appId = '9bb4c8c457b0d1b14194c1c68a6e7bd4';
  var url = "https://api.openweathermap.org/data/2.5/weather?q=".concat(ciudad, ",").concat(pais, "&appid=").concat(appId);
  fetch(url).then(function (respuesta) {
    return respuesta.json();
  }).then(function (datos) {
    limpiarHTML();

    if (datos.cod === "404") {
      mostrarError('Ciudad no encontrada');
      return;
    } // Imprimir la respuesta en HTML


    mostrarClima(datos);
  });
}

function mostrarClima(datos) {
  var name = datos.name,
      _datos$main = datos.main,
      temp = _datos$main.temp,
      temp_max = _datos$main.temp_max,
      temp_min = _datos$main.temp_min;
  var temperaturaCelsius = kelvinACentigrados(temp);
  var max = kelvinACentigrados(temp_max);
  var min = kelvinACentigrados(temp_min); // Scripting para temperaturas

  var nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = "Clima en ".concat(name);
  nombreCiudad.classList.add('text-2xl', 'font-bold');
  var tempActual = document.createElement('p');
  tempActual.innerHTML = "\n        ".concat(temperaturaCelsius, " &#8451;");
  tempActual.classList.add('font-bold', 'text-6xl');
  var tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = "Max: ".concat(max, " &#8451;");
  tempMaxima.classList.add('text-xl');
  var tempMinima = document.createElement('p');
  tempMinima.innerHTML = "Min: ".concat(min, " &#8451;");
  tempMinima.classList.add('text-xl');
  var resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-white', 'text-center');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);
  resultado.appendChild(resultadoDiv);
} // Helpers


var kelvinACentigrados = function kelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
};

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}