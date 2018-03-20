'use strict'

import { filesOpened, extension } from '../utils.js'
// Sidebar
import { saveFile, saveFileAs } from './sidebar.js'

// Agregar FOCUS
// Al clickear en una pestana agregar focus
function addFocus (idTab) {
  // Eliminar de todos los tabs la clase ON (el focus)
  filesOpened.forEach(element => {
    if (element.id === Number(idTab)) {
      // Agregar el focus a la tab que se crea o que se clickea
      $(`.tab[idhorbito='${idTab}']`).animate({ bottom: '0' }, 200).addClass('on')
      // Activar el focus en el objeto correspondiente al archivo
      element.focus = true
    } else {
      $(`.tab[idhorbito='${element.id}']`).removeClass('on')
      // Desactivar el focus en el objeto correspondiente a cada archivo
      element.focus = false
    }
  })
}

// Ocultar todos los textareas y mostrar el relacionado a cada tab
function hideTextareas (idTextArea) {
  // Eliminar mensaje de carga
  $('.loading').remove()

  // Ocultar todos los textareas
  filesOpened.forEach(element => {
    $(`.myTextArea-${element.id}`).hide()
  })

  $(`.myTextArea-${idTextArea}`).show()
}

// Cerrar pestanas
$('.code').on('click', '.icon-close', function () {
  // Obtener las clases del tab
  const id = Number($(this).parent().attr('idhorbito'))

  // Contador de clicks
  let click = 0

  click++
  if (click === 1) {
    setTimeout(function () {
      const dialog = api.dialog()

      dialog.setTitle('Desea guardar los cambios de [file].[ext] antes de cerrar?')

      dialog.setButton(0, 'No', 'red')
      dialog.setButton(1, 'Cancelar', 'blue')
      dialog.setButton(2, 'Si', 'green')

      filesOpened.forEach((element, index) => {
        // Encontrar el elemento segun su ID en filesOpenend
        if (element.id === id) {
          // En caso de existan cambios sin guardar
          if (element.content !== element.cm.getValue()) {
            dialog.render(function (doIt) {
              console.log(doIt)
              // En caso de que sea clickeado [Cancelar] no hacer nada
              if (doIt === 1) return

              // En caso de no querer guardar
              if (doIt === 0) {
                // Cerrar tab
                $(`.tab[idhorbito='${id}']`).remove()

                // Cerrar Textarea
                $(`.myTextArea-${id}`).remove()

                // Si el ID es igual al de un objeto, eliminarlo
                if (element.id === id) filesOpened.splice(index, 1)

                // En caso de estar enfocada la pestana, al cerrarla enfocar la ultima
                if (element.focus) {
                  const length = filesOpened.length - 1
                  // Si existen archivos abiertos en el editor
                  if (length > -1) {
                    // Obtener el ID del ultimo archivo abierto
                    const idNEW = filesOpened[length].id
                    // Agregar focus al tab :)
                    addFocus(idNEW)

                    // Mostrar textarea relacionada a la tab
                    hideTextareas(idNEW)
                  }
                }
              }

              // Eliminar documento del array que contiene los archivos abiertos en el editor
              if (doIt === 2) {
                // En caso de que el archivo este horbiting
                if (element.horbiting) {
                  saveFile(element.id, element.cm.getValue(), index)
                } else {
                  // No horbiting
                  saveFileAs(index, {
                    title: lang.selectDestinyFile,
                    mode: 'file',
                    name: element.name,
                    extension: extension(element.type)
                  })
                }
              
                // Cerrar tab
                $(`.tab[idhorbito='${id}']`).remove()

                // Cerrar Textarea
                $(`.myTextArea-${id}`).remove()

                // Si el ID es igual al de un objeto, eliminarlo
                if (element.id === id) filesOpened.splice(index, 1)

                // En caso de estar enfocada la pestana, al cerrarla enfocar la ultima
                if (element.focus) {
                  const length = filesOpened.length - 1
                  // Si existen archivos abiertos en el editor
                  if (length > -1) {
                    // Obtener el ID del ultimo archivo abierto
                    const idNEW = filesOpened[length].id
                    // Agregar focus al tab :)
                    addFocus(idNEW)

                    // Mostrar textarea relacionada a la tab
                    hideTextareas(idNEW)
                  }
                }
              }
            })
          } else {
            // Cerrar tab
            $(`.tab[idhorbito='${id}']`).remove()

            // Cerrar Textarea
            $(`.myTextArea-${id}`).remove()

            // Si el ID es igual al de un objeto, eliminarlo
            if (element.id === id) filesOpened.splice(index, 1)

            // En caso de estar enfocada la pestana, al cerrarla enfocar la ultima
            if (element.focus) {
              const length = filesOpened.length - 1
              // Si existen archivos abiertos en el editor
              if (length > -1) {
                // Obtener el ID del ultimo archivo abierto
                const idNEW = filesOpened[length].id
                // Agregar focus al tab :)
                addFocus(idNEW)

                // Mostrar textarea relacionada a la tab
                hideTextareas(idNEW)
              }
            }
          }
        }
      })

      click = 0
    }, 500)
  }
})

// Activar FOCUS al hacer click en una pestana
// Obtener elemento (tab) clickeado
$('.code').on('click', '.tab', function (e) {
  if (e.target !== this) return

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
