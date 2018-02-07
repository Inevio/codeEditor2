'use strict'

import { filesOpened } from '../utils.js'

// Agregar FOCUS
// Al clickear en una pestana agregar focus
function addFocus (idTab) {
  // Eliminar de todos los tabs la clase ON (el focus)
  filesOpened.forEach(element => {
    $(`.tab[idhorbito='${element.id}']`).removeClass('on')
  })

  // Agregar el focus a la tab que se crea o que se clickea
    $(`.tab[idhorbito='${idTab}']`).addClass('on')
}

// Ocultar todos los textareas y mostrar el relacionado a cada tab
function hideTextareas (idTextArea) {
  // Ocultar todos los textareas
  filesOpened.forEach(element => {
    $(`.myTextArea-${element.id}`).hide()
  })

  $(`.myTextArea-${idTextArea}`).show()
}

// Cerrar pestanas
function closeTabs () {
  $('.icon-close').click(function () {
    // Obtener las clases del tab
    const id = $(this).parent().attr('idhorbito')

    // Cerrar tab
    $(`.tab[idhorbito='${id}']`).hide()

    // Cerrar Textarea
    $(`.myTextArea-${id}`).hide()
  })
}

// Activar FOCUS al hacer click en una pestana
function enableClicksOnTabs() {
  // Obtener elemento (tab) clickeado
  $('.tab').click(function () {
    // Obtener las clases del tab
    const className = $(this).attr('class')

    // Verificar que el elemento tenga la clase ON (no este seleccionado)
    // En caso de tener el focus, salir de la ejecucion
    if (className.search('on') !== -1) return

    // Determinar el ID del elemento clickeado
    const id = $(this).attr('idhorbito')

    // Agregar focus al tab :)
    addFocus(id)

    // Mostrar textarea relacionada a la tab
    hideTextareas(id)
  })
}

// addFocus: Marca como seleccionada una carpeta, como parametro se le pasa el ID del archivo
// closeTabs: Cierra un archivo en el editor, como parametro se le pasa el ID del archivo
// hideTextareas: Se encarga de cerrar todos los textareas y mostrar el relacionado con la pestana activa, como parametro se le pasa el ID del archivo
export { addFocus, closeTabs, hideTextareas, enableClicksOnTabs }
