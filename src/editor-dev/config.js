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
    "name": lang.menuFile,
    "subClass": "sub-menu-file",
    "sub": [
      {
        "id": "menu-file-new-file",
        "name": lang.menuFileNewFile,
        "idEvent": "file-new-file",
        "keyboardShortcuts": "Ctrl-Alt-T"
      },
      {
        "id": "menu-file-open-file",
        "idEvent": "open-file-event",
        "name": lang.menuFileOpenFile,
        "keyboardShortcuts": "Ctrl-Alt-O"
      },
      {
        "id": "menu-file-open-folder",
        "idEvent": "open-folder-event",
        "name": lang.menuFileOpenFolder,
        "keyboardShortcuts": "Ctrl-Alt-P"
      },
      {
        "id": "menu-file-save",
        "idEvent": "file-save-event",
        "name": lang.menuFileSave
      },
      {
        "id": "menu-file-save-as",
        "idEvent": "file-save-as-event",
        "name": `${lang.menuFileSaveAs}...`
      }
    ]
  },
  {
    "id": "menu-edit",
    "name": lang.menuEdit,
    "subClass": "sub-menu-edit",
    "sub": [
      /*{
        "id": "menu-edit-copy",
        "name": lang.menuEditCopy
      },
      {
        "id": "menu-edit-cut",
        "name": lang.menuEditCut
      },
      {
        "id": "menu-edit-paste",
        "name": lang.menuEditPaste
      },*/
      {
        "id": "menu-edit-rename",
        "idEvent": "edit-rename-event",
        "name": lang.menuEditRename,
        "keyboardShortcuts": "Ctrl-Alt-R"
      },
      {
        "id": "menu-edit-delete",
        "idEvent": "edit-delete-event",
        "name": lang.menuEditDelete
      }
    ]
  },
  {
    "id": "menu-view",
    "name": lang.menuView,
    "subClass": "sub-menu-view",
    "sub": [
      {
        "id": "menu-view-zoom",
        "idEvent": "view-zoom-event",
        "name": lang.menuEditZoom,
        "keyboardShortcuts": "Ctrl-Alt-M"
      },
      {
        "id": "menu-view-reduce",
        "idEvent": "view-reduce-event",
        "name": lang.menuEditReduce,
        "keyboardShortcuts": "Ctrl-Alt-N"
      }
    ]
  },
  {
    "id": "menu-selection",
    "name": lang.menuSelection
  },
  {
    "id": "menu-find",
    "name": lang.menuFind
  },
  {
    "id": "menu-packages",
    "name": lang.menuPackages
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
    value: value,
    extraKeys: {
      "Ctrl-Alt-M": function (cm) {
        let fontSize = $('.CodeMirror').css('font-size')
        fontSize = Number(fontSize.split('px')[0]) + 1

        $('.CodeMirror').css('font-size', fontSize)
      },
      "Ctrl-Alt-N": function (cm) {
        let fontSize = $('.CodeMirror').css('font-size')
        fontSize = Number(fontSize.split('px')[0]) - 1

        $('.CodeMirror').css('font-size', fontSize)
      }
    }
  }
}

// barOpts: Objeto con las opciones de la barra de navegacion
// newFileOpts: Funcion que retorna un objeto de configuracion para CodeMirror
export { barOpts, newFileOpts }
