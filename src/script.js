'use strict'

import './style.css'
// import './cm/lib/codemirror.js'
// import './cm/mode/javascript/javascript.js'

// const window = $(':first').parents().slice(-1)[0].parentNode.defaultView;
// const document = window.document;

// console.log(`Hello World: ${document}`)

// const editor = CodeMirror.fromTextArea(document.getElementById('myTextArea'), {
//   // lineNumbers: true,
//   // mode: "javascript",
//   // theme: "monokai",
//   // keyMap: "sublime"
// });

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
    "name": "File",
    "id": "menu-file",
    "subClass": "sub-menu-file",
    "sub": [
      {
        "name": "New File",
        "id": "menu-file-new-file"
      },
      {
        "name": "Open File",
        "id": "menu-file-open-file"
      },
      {
        "name": "Open Folder",
        "id": "menu-file-open-folder"
      }
    ]
  },
  {
    "name": "Edit",
    "id": "menu-edit",
    "subClass": "sub-menu-edit",
    "sub": [
      {
        "name": "Copy",
        "id": "menu-edit-copy"
      },
      {
        "name": "Cut",
        "id": "menu-edit-cut"
      },
      {
        "name": "Paste",
        "id": "menu-edit-paste"
      }
    ]
  },
  {
    "name": "View",
    "id": "menu-view"
  },
  {
    "name": "Selection",
    "id": "menu-find"
  },
  {
    "name": "Find",
    "id": "menu-find"
  },
  {
    "name": "Packages",
    "id": "menu-view"
  }
]

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

// Builder
function recursive (opts) {
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

recursive(barOpts)

// -- Eventos en la barra de navegacion
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

// 
