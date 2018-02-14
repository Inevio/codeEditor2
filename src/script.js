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
import { listUL, itemLIBar, itemLIHorbito, filesOpened, extension } from './editor-dev/utils.js'
// Opciones del menu y creacion de una nueva zona de edicion
import { barOpts } from './editor-dev/config.js'
// Renderizado
import { render } from './editor-dev/render.js'
// Area de trabajo
// Sidebar
import { fsRead, saveFile, saveFileAs } from './editor-dev/area/sidebar.js'

// TEST
let tabs = 0

// Renderizar el menu
render.navigationBar(barOpts)

// Nuevo Archivo
$('.menu-file-new-file').on('click', () => {
  // El parametro `false` indica que el archivo que se genera no estara horbiting
  render.newFile(tabs++, false, 'untitled', 'text/html')
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
    // El parametro `true` indica que el archivo que se genera si esta horbiting
    fsRead(fsNodeId[0], true)
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

// Guardar
$('.file-save-event').on('click', () => {
  filesOpened.forEach((element, index) => {
    // En caso de que el archivo que se desea guardar este seleccionado
    if (element.focus && element.horbiting) { // Si el archivo esta seleccionado y esta horbiting
      saveFile(element.id, element.cm.getValue())
    } else if (element.focus && !element.horbiting) { // Si el archivo esta seleccionado y no esta horbiting
      saveFileAs(index, {
        title: 'Select destiny for the file',
        mode: 'file',
        name: element.name,
        extension: extension(element.type)
      })
    }
  })
})

// Guardar como...
$('.file-save-as-event').on('click', () => {
  // Objeto de configuracion para el explorador
  const options = {
    title: 'Select destiny for the file',
    mode: 'file',
    name: 'untitled',
    extension: ''
  }

  filesOpened.forEach((element, index) => {
    if (element.focus && element.horbiting) { // En caso de que el archivo este seleccionado y horbiting
      saveFileAs(index, {
        title: 'Select destiny for the file',
        mode: 'file',
        name: element.name,
        extension: extension(element.type)
      })
    } else if (element.focus) { // En caso de que el archivo que se desea guardar este seleccionado
      // Determinar la extension del archivo a guardar
      options.extension = extension(element.type)
      saveFileAs(index, options)
    }
  })
})

// var window = $(':first').parents().slice(-1)[0].parentNode.defaultView;
// var document = window.document;
