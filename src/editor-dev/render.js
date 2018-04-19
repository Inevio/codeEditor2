'use strict'

// CodeMirror
import CodeMirror from '../cm/lib/codemirror.js'
// Utilidades
import { listUL, itemLIBar, itemLIBarKeyboardShortcuts, itemLIHorbitoSidebar, itemLIHorbitoTab, itemLIHorbitoTextarea, FileCreator, filesOpened } from './utils.js'
// Opciones del menu y creacion de una nueva zona de edicion
import { newFileOpts } from './config.js'
// Eventos del menu
import { clickItems } from './area/menu.js'
// Code: Edicion
import { addFocus, hideTextareas, widthMeter, badgeCounter, shortTabs } from './area/code.js'
// Sidebar
import { listFolderAndClickItem } from './area/sidebar.js'
// Utilidades
import { changes } from './utils'

// Menu:
// Renderiza el menu basado en el objeto de opciones
function navigationBar (barOpts) {
  // [UL] Crear lista desordenada
  listUL('navigation', 'nav')

  // File, Edit, View, ...
  barOpts.forEach(element => {

    // En caso de existir un sub-menu
    if (element.sub) {
      // [LI] Crear items dentro de UL
      itemLIBar('nav', 'item', element.id, element.name)

      // [UL] Crear lista desordenada
      listUL(element.id, element.subClass)

      // New File, Open File, Open Folder...
      element.sub.forEach(subElement => {
        // [LI] Crear items dentro de UL
        if (subElement.idEvent && subElement.keyboardShortcuts) {
          itemLIBarKeyboardShortcuts(element.subClass, `item ${subElement.idEvent}`, subElement.id, subElement.name, subElement.keyboardShortcuts)
        } else if (subElement.idEvent) {
          // subElement.idEvent: Id del evento a ejecutar dentro de Horbito
          itemLIBar(element.subClass, `item ${subElement.idEvent}`, subElement.id, subElement.name)
        } else {
          itemLIBar(element.subClass, 'item', subElement.id, subElement.name)
        }
      })

      // Desplegar menus
      clickItems(element.subClass, element.id) // File, Edit, ...
      // Continuar con el resto de items...
    }
  })
}

// Code: Edicion
// Renderiza una nueva area de edicion (pestana y area de texto)
function newFile (id, horbiting, name, type) {
  // Se crea el objeto partiendo de la clase FileCreator
  const file = new FileCreator(id, horbiting, name, type, '', true)

  // En tester se almacena el resulado de la operacion de busqueda de igualdad
  let tester = filesOpened.find(element => { return element.id === file.id })
  // Antes de entrar al IF, si ya exite un archivo con el mismo ID la variable tester sera el objeto (es decir, true)
  if (tester) {
    // Clickear la pestana del archivo dentro del editor
    // Agregar focus al tab :)
    addFocus(file.id)
    // Mostrar textarea relacionada a la tab
    hideTextareas(file.id)
  } else { // En caso de que el archivo no se encuentre abierto en el editor
    documentGenerator(file)
  }

  // Reajustar CodeMirror segun el tamano del Editor
  function resize (h) {
    if (filesOpened.length === 0) return // En caso de estar nada abierto en el Editor, no hacer nada
    $('.CodeMirror').css('height', h)
    if ($('.loading')[0] !== undefined) $('.loading').css('height', h)
  }
  // Llamar a la funcion de forma que se ajuste al crear una nueva pestana
  resize($('.text').height())

  // Eventos para modificar el alto del CodeMirror
  $(window).on("mousemove", () => {
    resize($('.text').height())
    $('.menu-tabs').css('max-height', `${($('.CodeMirror').height() - 150)}px`)
    // Verificar si existe espacio en el menu principal y mover las pestanas a el
    shortTabs()
  })

  $('.ui-maximize').on("click", () => {
    setTimeout(() => {
      resize($('.text').height())
      $('.menu-tabs').css('max-height', `${($('.CodeMirror').height() - 150)}px`)
      // Verificar si existe espacio en el menu principal y mover las pestanas a el
      shortTabs()
      filesOpened.forEach(element => {
        if (element.focus) {
          element.cm.refresh()
        }
      })
    }, 100)
  })
}

// Generador de areas de trabajo
function documentGenerator (file) {
  let doc

  // Agregar un objeto (que representa a un archivo) al arreglo "Archivos Abiertos"
  filesOpened.push(file)

  if (widthMeter()) {
    // Adjuntar tab en el editor (en el HTML)
    itemLIHorbitoTab('tabs', 'tab', file.id, file.name, 'icon-close')
  } else {
    // Abrir el menu de hamburguesa
    $('.menu-tabs').animate({ right: '0'}, 100)
    itemLIHorbitoTab('menu-tabs', 'tab', file.id, file.name, 'icon-close')
    // Actualizar badge del menu de hamburguesa
    badgeCounter()
  }

  // Agregar ON a la tab que se crea segun su ID
  addFocus(file.id)

  // Ocultar todos los textareas NO RELACIONADOS a la nueva tab
  hideTextareas(file.id)

  // Adjuntar textarea-div en el editor (en el HTML)
  itemLIHorbitoTextarea('text', file.id)

  // Agregar mensaje de carga
  $(`.myTextArea-${file.id}`).prepend(`<div class="loading l-${file.id}">${lang.loading}...</div>`)
  if (file.horbiting) {
    // Leer archivo
    api.fs(file.id, (err, fsNode) => {
      fsNode.read(function (err, fileContent) {
        if (err) return console.log(err) // En caso de error

        // Agregar contenido del archivo al array de los archivos abiertos
        for (let el of filesOpened) {
          if (el.id === file.id) {
            el.content = fileContent
            // Eliminar mensaje de carga
            $(`.l-${file.id}`).remove()

            // CodeMirror
            // config: Es un objeto de configuraciones para CodeMirror
            el.cm = CodeMirror($(`.myTextArea-${file.id}`)[0], newFileOpts(file.type, file.content))

            // Al clickear el CodeMirror, eliminar texto marcado (con find)
            el.cm.on("mousedown", () => {
              $('.cm-searching').removeClass('cm-searching') // Eliminar marcado
            })

            // Escuchar cambios
            el.cm.on('change', () => {
              changes(el)
            })
          }
        }
      })
    })
  } else {
    // Eliminar mensaje de carga
    $(`.l-${file.id}`).remove()

    // CodeMirror
    // config: Es un objeto de configuraciones para CodeMirror
    file.cm = CodeMirror($(`.myTextArea-${file.id}`)[0], newFileOpts(file.type, file.content))

    // Al clickear el CodeMirror, eliminar texto marcado (con find)
    file.cm.on("mousedown", () => {
      $('.cm-searching').removeClass('cm-searching') // Eliminar marcado
    })

    // Escuchar cambios
    file.cm.on('change', () => {
      changes(file)
    })
  }
}

// Code: Sidebar
function sidebar (rootFolder) {
  // Crear lista desordenada [UL]
  // Crear item de la carpeta raiz (del proyecto)
  api.fs(rootFolder.id, (err, fsNode) => {
    $('.sidebar').append(`<ul class="subItem">
      <li class="item">
        <div idhorbito="${rootFolder.id}" type="folder" special="${(fsNode.type === 0 || fsNode.type === 1) ? 'folder' : undefined}" root>
        <i class="icon-arrow-down"></i><i class="icon-folder"></i>${(rootFolder.type === 0) ? 'Home' : rootFolder.name}
        </div>
      <li>
    </ul>`)
  })

  // Listar contenido (items) de la carpeta raiz del proyecto
  listFolderAndClickItem(rootFolder.id)

  // Mostrar Sidebar
  $('.sidebar').show()
  $('.sidebar').css('width', '180px').css('padding', '3px 10px')
  $('.code').css('width', 'calc(100% - 200px)')
  $('.menu').css('padding', '8px 0')
}

// navigationBar: Renderiza el menus
// newFile: Renderiza un nuevo espacio de trabajo, es decir, abre un nuevo (o creado) archivo
export const render = {
  navigationBar,
  sidebar,
  newFile
}
