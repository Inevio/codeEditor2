'use strict'

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
        "idEvent": "open-file-event",
        "name": "Open File"
      },
      {
        "id": "menu-file-open-folder",
        "idEvent": "open-folder-event",
        "name": "Open Folder"
      },
      {
        "id": "menu-file-save",
        "idEvent": "file-save-event",
        "name": "Save"
      },
      {
        "id": "menu-file-save-as",
        "idEvent": "file-save-as-event",
        "name": "Save As"
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
    "id": "menu-selection",
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

// -- CodeMirror
// Objeto de configuracion
/* mode: highlight del lenguaje de programacion con el cual se trabajara en el area de edicion
 */
function newFileOpts (mode, value = '') {
  // Validador de extenciones
  if (mode === 'text/html') mode = 'htmlmixed'
  if (mode === 'text/css') mode = 'css'
  if (mode === 'application/javascript') mode = 'javascript'

  return {
    lineNumbers: true,
    keyMap: "sublime",
    theme: "joe",
    mode: mode,
    value: value
  }
}

// barOpts: Objeto con las opciones de la barra de navegacion
// newFileOpts: Funcion que retorna un objeto de configuracion para CodeMirror
export { barOpts, newFileOpts }
