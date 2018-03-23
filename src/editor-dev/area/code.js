'use strict'

import { filesOpened, extension, getName } from '../utils.js'
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

let requestRunningCloseDocument = false
// Cerrar pestanas
$('.code').on('click', '.icon-close', function () {
  // Obtener las clases del tab
  const id = Number($(this).parent().parent().attr('idhorbito'))

  requestRunningCloseDocument = true
  if (requestRunningCloseDocument) {
    setTimeout(function () {
      const dialog = api.dialog()

      dialog.setTitle(`${lang.beforeClousing} ${getName(id)}?`)

      dialog.setButton(0, lang.no, 'red')
      dialog.setButton(1, lang.cancel, 'blue')
      dialog.setButton(2, lang.yes, 'green')

      filesOpened.forEach((element, index) => {
        // Encontrar el elemento segun su ID en filesOpenend
        if (element.id === id) {
          // En caso de existan cambios sin guardar
          if (element.content !== element.cm.getValue()) {
            dialog.render( doIt => {
              // En caso de que sea clickeado [Cancelar] no hacer nada
              if (doIt === 1) return

              // En caso de no querer guardar
              if (doIt === 0) {
                // Cerrar tab
                // Cerrar Textarea
                closeDocument(element, index, id)
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
                // Cerrar Textarea
                closeDocument(element, index, id)
              }
            })
          } else {
            // Cerrar tab
            // Cerrar Textarea
            closeDocument(element, index, id)
          }
        }
      })

      requestRunningCloseDocument = false
    }, 500)
  }
})

// Activar FOCUS al hacer click en una pestana
// Obtener elemento (tab) clickeado
$('.code').on('click', '.tab', function (e) {
  if (e.target.lastChild === this) return

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

// Desplegar pestanas
let requestRunningMenu = false
$('.icon-menu').on('click', () => {
  if (requestRunningMenu) return

  requestRunningMenu = true
  setTimeout(() => {
    if ($('.menu-tabs').css('right') <= '-92.5px') {
      $('.menu-tabs').animate({ right: '0'}, 100)
    } else {
      $('.menu-tabs').animate({ right: '-185px'}, 100)
    }
    // Finalizar despliegue...
    requestRunningMenu = false
  }, 150)
})

// Elimina un documento del editor y enfoca otra (el ultimo en caos de cerrar el enfocado)
function closeDocument (element, index, id) {
  // Cerrar tab
  $(`.tab[idhorbito='${id}']`).remove()

  // Cerrar Textarea
  $(`.myTextArea-${id}`).remove()

  // Si el ID es igual al de un objeto, eliminarlo
  if (element.id === id) filesOpened.splice(index, 1)
  // Actualizar barra de pestanas y contador del menu de hamburguesa
  shortTabs()

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

// Determinar la cantidad de pestanas que caben en el editor
function widthMeter () {
  // Obtener el ancho de la barra del editor
  const width = parseInt($('.tabs').css('width'))

  // Determinar la cantidad de pestanas que caben en la barra principal
  const tabs = parseInt(width / 180)
  // Deteminar la cantidad de pestanas que ya estan en la barra principal
  const tabsOpenend = $('.tabs').children().length
  // Si es true es porque la cantidad de pestanas abiertas son menores a la cantidad de pestanas que se puedne abrir
  return (tabsOpenend < tabs)
}

// Determinar la cantidad de pestanas en el menu de hamburguesa para el badge
function badgeCounter () {
  // Contar la cantidad de pestanas en el menu de hamburguesa
  const tabs = $('.menu-tabs').children().length

  // Almacenar el elemento
  const el = $('.counter').html()
  // Romper los elementos internos y obtener el nombre (texto !== </elements>)
  const name = $('.counter').text()
  // Reemplazar nombre
  $('.counter').html(el.replace(name, tabs))

  if (Number($('.counter').text()) > 0) {
    $('.counter').show()
  } else {
    $('.counter').hide()
  }
}

// Re-organizar pestanas
function shortTabs () {
  if (widthMeter() && $('.menu-tabs .tab:first')) {
    // Mover la primera pestana del menu de hamburguesa a la ultima parte del menu principal
    $('.tabs').append($('.menu-tabs .tab:first'))
  } else {
    // Mueve la ultima pestana del menu principal y la agrega de primera en el menu de hamburguesa
    $('.menu-tabs').prepend($('.tabs .tab:last'))
  }
  // Actualizar contador del menu de hamburguesa
  badgeCounter()
}

// addFocus: Marca como seleccionada una carpeta, como parametro se le pasa el ID del archivo
// closeTabs: Cierra un archivo en el editor, como parametro se le pasa el ID del archivo
// hideTextareas: Se encarga de cerrar todos los textareas y mostrar el relacionado con la pestana activa, como parametro se le pasa el ID del archivo
// widthMeter: Calcula la cantidad de pestanas que caben en el Editor
// badgeCounter: Actualiza el badge del menu de hamburguesa
// shortTabs: Mueve las pestanas del menu de hamburguesa al menu principal en caso de existir espacio
export { addFocus, hideTextareas, widthMeter, badgeCounter, shortTabs }
