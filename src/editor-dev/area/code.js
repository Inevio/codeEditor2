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
$('.code').on('click', '.icon-close', function () {
  // Obtener las clases del tab
  const id = $(this).parent().attr('idhorbito')
  let click = 0

  click++
  if (click === 1) {
    setTimeout(function () {
      // Cerrar tab
      $(`.tab[idhorbito='${id}']`).remove()

      // Cerrar Textarea
      $(`.myTextArea-${id}`).remove()

      // Eliminar documento del array que contiene los archivos abiertos en el editor
      filesOpened.forEach(function (element, index) {
        // Si el ID es igual al de un objeto, eliminarlo
        if (element.id === Number(id)) filesOpened.splice(index, 1)
      })
      click = 0
    }, 500)
  }
})

// Activar FOCUS al hacer click en una pestana
// Obtener elemento (tab) clickeado
$('.code').on('click', '.tab', function () {
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

// addFocus: Marca como seleccionada una carpeta, como parametro se le pasa el ID del archivo
// closeTabs: Cierra un archivo en el editor, como parametro se le pasa el ID del archivo
// hideTextareas: Se encarga de cerrar todos los textareas y mostrar el relacionado con la pestana activa, como parametro se le pasa el ID del archivo
export { addFocus, hideTextareas }
