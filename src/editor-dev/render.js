'use strict'

// CodeMirror
import CodeMirror from '../cm/lib/codemirror.js'
// Utilidades
import { listUL, itemLIBar, itemLIHorbitoSidebar, itemLIHorbitoTab, itemLIHorbitoTextarea, FileCreator, filesOpened } from './utils.js'
// Opciones del menu y creacion de una nueva zona de edicion
import { newFileOpts } from './config.js'
// Eventos del menu
import { clickItems } from './area/menu.js'
// Code: Edicion
import { addFocus, closeTabs, hideTextareas, enableClicksOnTabs } from './area/code.js'
// Utilidades
import { listFolderAndClickItem } from './area/sidebar.js'

// Menu:
// Renderiza el menu basado en el objeto de opciones
function navigationBar (barOpts) {
  // [UL] Crear lista desordenada
  listUL('navigation', 'nav')

  // File, Edit, View, ...
  barOpts.forEach(element => {
    // [LI] Crear items dentro de UL
    itemLIBar('nav', 'item', element.id, element.name)

    // En caso de existir un sub-menu
    if (element.sub) {
      // [UL] Crear lista desordenada
      listUL(element.id, element.subClass)

      // New File, Open File, Open Folder...
      element.sub.forEach(subElement => {
        // [LI] Crear items dentro de UL
        if (subElement.idEvent) {
          // subElement.idEvent: Id del evento a ejecutar dentro de Horbito
          itemLIBar(element.subClass, `item ${subElement.idEvent}`, subElement.id, subElement.name)
        } else {
          itemLIBar(element.subClass, 'item', subElement.id, subElement.name)
        }
      })
    }
  })

  // Desplegar menus
  clickItems('sub-menu-file', 'menu-file') // File
  clickItems('sub-menu-edit', 'menu-edit') // Edit
  // Continuar con el resto de items...
}

// Code: Edicion
// Renderiza una nueva area de edicion (pestana y area de texto)
function newFile (id, name, type, content) {
  // Se crea el objeto partiendo de la clase FileCreator
  const file = new FileCreator(id, name, type, content)

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
}

// Generador de areas de trabajo
function documentGenerator (file) {
  // Agregar un objeto (que representa a un archivo) al arreglo "Archivos Abiertos"
  filesOpened.push(file)

  // Adjuntar tab en el editor (en el HTML)
  itemLIHorbitoTab('tabs', 'tab', file.id, file.name, 'icon-close')

  // Agregar ON a la tab que se crea segun su ID
  addFocus(file.id)

  // Ocultar todos los textareas NO RELACIONADOS a la nueva tab
  hideTextareas(file.id)

  // Adjuntar textarea-div en el editor (en el HTML)
  itemLIHorbitoTextarea('text', file.id)

  // CodeMirror
  // config: Es un objeto de configuraciones para CodeMirror
  let editor = CodeMirror($(`.myTextArea-${file.id}`)[0], newFileOpts(file.type, file.content))

  // Habilitar clicks en las pestanas
  // Agregar focus a los tabs seleccionados
  enableClicksOnTabs()

  // Habilitar funcion para cerrar las pestanas y textareas
  closeTabs()
}

// Code: Sidebar
function sidebar (filesOpts) {

  // Crear lista desordenada [UL]
  listUL('sidebar', 'base')
  
  for (let file of filesOpts) {
    // Crear items en una lista (Tab, CodeMirror y Sidebar)
    if (file.type !== 3) {
      itemLIHorbitoSidebar('base', 'item', file.id, 'icon-folder', file.name)
    } else {
      itemLIHorbitoSidebar('base', 'item', file.id, 'icon-file', file.name)
    }
  }

  // Mostrar Sidebar
  $('.sidebar').show()
  $('.code').css('width', '80%')

  // $()
  $('div[idhorbito]').click(function () {
    // ID de la carpeta
    const id = $(this).attr('idhorbito')

    if ($(`div[idhorbito='${id}']`).siblings()[0]) { // Determinar si la carpeta ya esta listada
      // Plegar carpeta, eliminar la lista que contiene los archivos y carpetas desplegados
      $(`div[idhorbito='${id}']`).siblings()[0].remove()
    } else { // En caso de no estarlo, listartla (desplegarla)
      listFolderAndClickItem(id)
    }
  })
}

// navigationBar: Renderiza el menus
// newFile: Renderiza un nuevo espacio de trabajo, es decir, abre un nuevo (o creado) archivo
export const render = {
  navigationBar,
  sidebar,
  newFile
}
