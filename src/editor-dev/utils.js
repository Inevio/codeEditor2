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
function itemLIHorbitoSidebarSUB (id, elementId, objectId, icon, el) {
  $(`div[idhorbito='${id}']`).siblings(`.subItem[idhorbito='${id}']`).append(`<li class="${elementId}"><div idhorbito="${objectId}"><i class="${icon}"></i>${el}</div></li>`)
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
  constructor(id, name, type, content) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.content = content;
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

// listUL: Crea una lista desordenada <ul><ul>
// itemLIBar: Crear items en la Barra de Navegacion <li><li>
// itemLIHorbito: Crear items en el contenedor de pestanas, el area de edicion y en el sidebar vinculados entre si <li><li>
// FileCreator: Es una clase que crea objetos que representan un archivo dentro del editor
// filesOpened: Es un array que contiene objetos que representan archivos dentro de editor
// ellipsis: Toma una cadena de texto y si es mayor al limite la corta y le agrega unos puntos suspensivos
export { listUL, itemLIBar, itemLIHorbitoSidebar, baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB, itemLIHorbitoTab, itemLIHorbitoTextarea, FileCreator, filesOpened, ellipsis }
