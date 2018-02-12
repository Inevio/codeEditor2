'use strict'

import './style.css'
// CodeMirror: Mode
import './cm/mode/htmlmixed/htmlmixed.js'
// CodeMirror: KeyMap
import './cm/keymap/sublime.js'
// CodeMirror: Addon
import './cm/addon/search/search.js'
import './cm/addon/search/searchcursor.js'
import './cm/addon/search/jump-to-line.js'
// CodeMirror: Dialog
import './cm/addon/dialog/dialog.js'
// Utilidades
import { listUL, itemLIBar, itemLIHorbito } from './editor-dev/utils.js'
// Opciones del menu y creacion de una nueva zona de edicion
import { barOpts } from './editor-dev/config.js'
// Renderizado
import { render } from './editor-dev/render.js'
// Area de trabajo
// Sidebar
import { fsRead } from './editor-dev/area/sidebar.js'

// TEST
let tabs = 0

// Renderizar el menu
render.navigationBar(barOpts)

// Nuevo Archivo
$('.menu-file-new-file').on('click', () => {
  render.newFile(tabs++, 'untitled', 'text/html')
})

// Abrir Archivo
$('.open-file-event').on('click', () => {
  // Objeto de configuracion para el explorador
  const options = {
    title: 'Select file to open',
    mode: 'file',
    multiple: false
  }

  // Abrir ventana para seleccionar
  api.fs.selectSource(options, (err, fsNodeId) => {
    if (err) return console.log(err) // En caso de error

    // Leer archivo y renderizar contenido
    fsRead(fsNodeId[0])
  })
})

// Abrir Carpeta
$('.open-folder-event').on('click', () => {
  // Objeto de configuracion para el explorador
  const options = {
    title: 'Select folder to open',
    mode: 'directory',
    multiple: false
  }

  // Abrir ventana para seleccionar
  api.fs.selectSource(options, (err, fsNodeId) => {
    if (err) return console.log(err) // En caso de error

    // En caso de existir alguna carpeta abierta, eliminarla
    if ($('.base')) $('.base').remove()

    // API FileSystem de Horbito
    api.fs(fsNodeId[0], (err, fsNode) => {
      if (err) return console.log(err) // En caso de error

      // console.log(fsNode) // Carpeta Root
      // Array de objetos (que representan archivos en Horbito) de la carpeta raiz
      render.sidebar(fsNode)
    })
  })
})

// var window = $(':first').parents().slice(-1)[0].parentNode.defaultView;
// var document = window.document;
