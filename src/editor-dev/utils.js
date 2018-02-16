'use strict'

// -- Funciones utiles:
// Crear lista desordenada
/* parentID: Clase del elemento padre
 * elementId: Clase que se le aplicara al elemento que se adjunta
 */
function listUL (parentID, elementId) {
  $(`.${parentID}`).append(`<ul class="${elementId}"></ul>`)
}

// Crear items en una lista (Barra de Navegacion)
/* parentID: Clase del elemento padre
 * elementId: Clase que se le aplicara al elemento que se adjunta
 * objectId: Clase unica (ID) que identifica al elemento
 * el: Nombre de los items que se agregaran a partir de la iteracion del JSON
 */
function itemLIBar (parentID, elementId, objectId, el) {
  $(`.${parentID}`).append(`<li class="${elementId} ${objectId}">${el}</li>`)
}

// Crear items en una lista (Sidebar)
/* objectId: ID personalizado que se le aplicara al item que se adjunta
 * icon: Icono que se asigna al item con el fin de mejorar su diseno, en este caso se ubica en la parte izquierda
 */
function itemLIHorbitoSidebar (parentID, elementId, objectId, icon, el) {
  $(`.${parentID}`).append(`<li class="${elementId}"><div idhorbito="${objectId}"><i class="${icon}"></i>${el}</div></li>`)
}

// Crear la base de una lista desordenada (UL) para el contenido de los directorios listados
/* id: ID del archivo o directorio en Horbito
 */
function baseULHorbitoSidebarSUB (id, elementId) {
  $(`div[idhorbito='${id}']`).parent().append(`<ul class="${elementId}" idhorbito="${id}"></ul>`)
}

// Crear items (contenido) en una lista desordenada (UL) dentro de un directorio listado
function itemLIHorbitoSidebarSUB (id, elementId, objectId, icon, el, arrow = '') {
  $(`div[idhorbito='${id}']`).siblings(`.subItem[idhorbito='${id}']`).append(`<li class="${elementId}"><div idhorbito="${objectId}">${arrow}<i class="${icon}"></i>${el}</div></li>`)
}

// Crear items en una lista (Tab)
/* elementId: ID personalizado que se le aplicara al item que se adjunta
 * icon: Icono que se asigna al item con el fin de mejorar su diseno, en este caso se ubica en la parte derecha
 */
function itemLIHorbitoTab (parentID, elementId, objectId, el, icon) {
  $(`.${parentID}`).append(`<li class="${elementId}" idhorbito="${objectId}">${ellipsis(el, 12)}<i class="${icon}"></i></li>`)
}

// Crear items en una lista (Tab)
/* objectId: ID personalizado que se le aplicara al item que se adjunta
 */
function itemLIHorbitoTextarea (parentID, objectId) {
  $(`.${parentID}`).append(`<div class="myTextArea-${objectId}"></div>`)
}

// Generador de archivos
class FileCreator {
  constructor(id, horbiting, name, type, content, focus, CodeMirror = null) {
    this.id = id
    this.horbiting = horbiting
    this.name = name
    this.type = type
    this.content = content
    this.focus = focus
    this.cm = CodeMirror
  }
}

// Arreglo de archivos abiertos
let filesOpened = []

// Puntos suspensivos para los nombres largos en las pestanas
function ellipsis(text, limit) {
  if(text.length > limit) {
    return `${text.substring(0,limit)}...`
  }
  return text
}

// Determinar la extension de un archivo (a guardar)
function extension (type) {
  if (type === 'text/html') return '.html'
  if (type === 'text/css') return '.css'
  if (type === 'application/javascript') return '.js'
}

// Rota la posicion de las flechas de Sidebar
function changeArrow(item) {
  // Cambio de flechas
  if ($(item).attr('class') === 'icon-arrow-right') {
    $(item).removeClass('icon-arrow-right').addClass('icon-arrow-down')
  } else {
    $(item).removeClass('icon-arrow-down').addClass('icon-arrow-right')
  } // if ($(item).attr('class') === 'icon-arrow-down')
}

export {
  listUL, // Crea una lista desordenada <ul><ul>
  itemLIBar, // Crear items en la Barra de Navegacion <li><li>
  itemLIHorbitoSidebar, // Crear items en el contenedor de pestanas, el area de edicion y en el sidebar vinculados entre si <li><li>
  baseULHorbitoSidebarSUB, // Crea la base para los items en el Sidebar estructurados en forma de arbol
  itemLIHorbitoSidebarSUB, // Crea items en el Sidebar estructurados en forma de arbol
  itemLIHorbitoTab, // Crea una nueva pestana en el editor
  itemLIHorbitoTextarea, // Crea un nuevo entorno de CodeMirror, es decir, crea un TextArea
  FileCreator, // Es una clase que crea objetos que representan un archivo dentro del editor
  filesOpened, // Es un array que contiene objetos que representan archivos dentro de editor
  ellipsis, // Toma una cadena de texto y si es mayor al limite la corta y le agrega unos puntos suspensivos
  extension, // Retorna la extension del tipo de archivo segun Horbito
  changeArrow // Rota la posicion de la flecha que indica si una carpeta esta abierta o cerrada en el Sidebar
}
