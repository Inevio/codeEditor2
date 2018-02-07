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
        "idEvent": "openFileIdClick",
        "name": "Open File"
      },
      {
        "id": "menu-file-open-folder",
        "idEvent": "openFolderIdClick",
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

// -- CodeMirror
// Objeto de configuracion
/* mode: highlight del lenguaje de programacion con el cual se trabajara en el area de edicion
 */
function newFileOpts (mode, value = '') {
  return {
    lineNumbers: true,
    keyMap: "sublime",
    theme: "monokai",
    mode: mode,
    value: value
  }
}

// barOpts: Objeto con las opciones de la barra de navegacion
// newFileOpts: Funcion que retorna un objeto de configuracion para CodeMirror
export { barOpts, newFileOpts }
