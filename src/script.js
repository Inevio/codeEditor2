'use strict'

import './style.css'
// import './cm/lib/codemirror.js'
// import './cm/mode/javascript/javascript.js'

// const window = $(':first').parents().slice(-1)[0].parentNode.defaultView;
// const document = window.document;

// const editor = CodeMirror.fromTextArea(document.getElementById('myTextArea'), {
//   // lineNumbers: true,
//   // mode: "javascript",
//   // theme: "monokai",
//   // keyMap: "sublime"
// });

// -- Funciones utiles:
// Crear lista desordenada
/* parentID: Clase del elemento padre
 * elementId: Clase que se le aplicara al elemento que se adjunta
 */
function listUL (parentID, elementId) {
  $(`.${parentID}`).append(`<ul class="${elementId}"></ul>`)
}

// Crear items en una lista
/* parentID: Clase del elemento padre
 * objectId: Clase unica (ID) que identifica al elemento
 * elementId: Clase que se le aplicara al elemento que se adjunta
 * el: Nombre de los items que se agregaran a partir de la iteracion del JSON
 */
function itemLI (parentID, objectId, elementId, el) {
  $(`.${parentID}`).append(`<li class="${objectId} ${elementId}">${el}</li>`)
}

// -- Barra de navegacion:
// Database de opciones
/* JSON
 * name: Nombre del item
 * id: Clase unica (ID) del item
 * subClass: Clase unica (ID) del submenu de items
 * sub: Array de Objetos que contienen (o no) las mismas propiedades que aqui se describen
 */
const barOpts = [
  {
    "id": "menu-file",
    "name": "File",
    "subClass": "sub-menu-file",
    "sub": [
      {
        "id": "menu-file-new-file",
        "name": "New File"
      },
      {
        "id": "menu-file-open-file",
        "name": "Open File"
      },
      {
        "id": "menu-file-open-folder",
        "name": "Open Folder"
      }
    ]
  },
  {
    "id": "menu-edit",
    "name": "Edit",
    "subClass": "sub-menu-edit",
    "sub": [
      {
        "id": "menu-edit-copy",
        "name": "Copy"
      },
      {
        "id": "menu-edit-cut",
        "name": "Cut"
      },
      {
        "id": "menu-edit-paste",
        "name": "Paste"
      }
    ]
  },
  {
    "id": "menu-view",
    "name": "View"
  },
  {
    "id": "menu-find",
    "name": "Selection"
  },
  {
    "id": "menu-find",
    "name": "Find"
  },
  {
    "id": "menu-view",
    "name": "Packages"
  }
]

// Builder
function renderMenuSync (opts) {
  // [UL] Crear lista desordenada
  listUL('navigation', 'nav')

  // File, Edit, View, ...
  opts.forEach(element => {
    // [LI] Crear items dentro de UL
    itemLI('nav', 'item', element.id, element.name)

    // En caso de existir un sub-menu
    if (element.sub) {
      // [UL] Crear lista desordenada
      listUL(element.id, element.subClass)

      // New File, Open File, Open Folder...
      element.sub.forEach(subElement => {
        // [LI] Crear items dentro de UL
        itemLI(element.subClass, 'item', subElement.id, subElement.name)
      })
    }
  })
}

renderMenuSync(barOpts)

// Eventos en la barra de navegacion
// Clickeando Items
function clickingItems(subClass, item) {
  // Ocultar todos los sub-menus
  hidingItems(barOpts)
  // Al cliquear algun item, mostrar su respectivo sub-menu
  $(`.${item}`).click(() => {
    // Si el elemento esta oculto
    if ($(`.${subClass}`).css('display') === 'none') {
      // Ocultar todos los sub-menus cuando se le da click a otro item (y luego mostrar el sub-menu respectivo)
      hidingItems(barOpts)
      // Mostrarlo
      $(`.${subClass}`).show()
    } else {
      // Si no, ocultarlo
      $(`.${subClass}`).hide()
    }
  })
}

// Ocultando Items
function hidingItems(opts) {
  // Recorrer el JSON en busca de las sub-clases
  opts.forEach(element => {
    // Ocultar todos los elementos que coincidad con las sub clases encontradas
    $(`.${element.subClass}`).hide()
  })
}

clickingItems('sub-menu-file', 'menu-file') // File
clickingItems('sub-menu-edit', 'menu-edit') // Edit
// Continuar con el resto de items...

// Clickeando fuera del sub-menu
function clickingOutside(area) {
  $(`.${area}`).click(() => {
    // Al hacer click en el "area", ocultar los sub-menus
    hidingItems(barOpts)
  })
}

clickingOutside('container')
clickingOutside('ui-header')
